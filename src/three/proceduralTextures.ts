import * as THREE from 'three';
import { CelestialId, MoonId, MoonTextureType } from '../data/solarSystemData.ts';

export interface PlanetTextureBundle {
  map: THREE.CanvasTexture;
  bumpMap?: THREE.CanvasTexture;
  roughnessMap?: THREE.CanvasTexture;
  cloudsMap?: THREE.CanvasTexture;
  plasmaMap?: THREE.CanvasTexture;
  ringMap?: THREE.CanvasTexture;
}

/**
 * Deterministic pseudo-random generator for consistent planetary terrain features.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

function toTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean = true
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a soft radial glow texture for the Sun's corona and atmospheric halos.
 */
export function createSolarCoronaTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = createCanvas(512, 512);
  const grad = ctx.createRadialGradient(256, 256, 14, 256, 256, 256);
  grad.addColorStop(0.0, 'rgba(255, 254, 242, 1.0)');
  grad.addColorStop(0.16, 'rgba(255, 222, 130, 0.92)');
  grad.addColorStop(0.38, 'rgba(255, 148, 38, 0.48)');
  grad.addColorStop(0.68, 'rgba(225, 72, 14, 0.15)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle coronal streamer rays
  const rand = mulberry32(777);
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2 + rand() * 0.08;
    const len = 140 + rand() * 110;
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(angle);
    const rayGrad = ctx.createLinearGradient(18, 0, len, 0);
    rayGrad.addColorStop(0, 'rgba(255, 210, 115, 0.14)');
    rayGrad.addColorStop(1, 'rgba(255, 120, 20, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(18, -6);
    ctx.lineTo(len, -1);
    ctx.lineTo(len, 1);
    ctx.lineTo(18, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates high-detail procedural textures for each celestial body.
 */
export function createPlanetTextures(id: CelestialId): PlanetTextureBundle {
  const w = 1024;
  const h = 512;
  const { canvas, ctx } = createCanvas(w, h);
  const { canvas: bumpCanvas, ctx: bumpCtx } = createCanvas(w, h);
  const rand = mulberry32(id.charCodeAt(0) * 1337 + id.length * 97);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, w, h);

  if (id === 'sun') {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#ff770f');
    bg.addColorStop(0.25, '#ffa724');
    bg.addColorStop(0.5, '#ffd859');
    bg.addColorStop(0.75, '#ffa724');
    bg.addColorStop(1, '#ff770f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Fine photospheric convection granules
    for (let i = 0; i < 2400; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 2.5 + rand() * 14;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      if (rand() > 0.18) {
        g.addColorStop(0, 'rgba(255, 252, 215, 0.52)');
        g.addColorStop(0.65, 'rgba(255, 185, 45, 0.22)');
        g.addColorStop(1, 'rgba(230, 95, 10, 0)');
      } else {
        // Dark intergranular lane
        g.addColorStop(0, 'rgba(175, 52, 6, 0.48)');
        g.addColorStop(1, 'rgba(255, 120, 12, 0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Active magnetic sunspot groups (umbra + penumbra + bright faculae) near +/- 15-25 deg latitude
    const sunspotGroups = [
      { x: 240, y: 185, r: 16 },
      { x: 268, y: 192, r: 10 },
      { x: 580, y: 315, r: 19 },
      { x: 612, y: 308, r: 12 },
      { x: 810, y: 195, r: 14 },
    ];
    sunspotGroups.forEach((sp) => {
      // Bright magnetic faculae ring
      const fac = ctx.createRadialGradient(sp.x, sp.y, sp.r * 0.8, sp.x, sp.y, sp.r * 2.6);
      fac.addColorStop(0, 'rgba(255, 255, 230, 0.55)');
      fac.addColorStop(1, 'rgba(255, 220, 110, 0)');
      ctx.fillStyle = fac;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Penumbra + Dark Umbra
      const umb = ctx.createRadialGradient(sp.x, sp.y, 1, sp.x, sp.y, sp.r);
      umb.addColorStop(0, 'rgba(42, 8, 2, 0.92)');
      umb.addColorStop(0.48, 'rgba(85, 20, 4, 0.82)');
      umb.addColorStop(0.82, 'rgba(185, 68, 12, 0.45)');
      umb.addColorStop(1, 'rgba(255, 140, 20, 0)');
      ctx.fillStyle = umb;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Secondary animated plasma filament shell texture
    const { canvas: plasmaCanvas, ctx: plasmaCtx } = createCanvas(w, h);
    for (let i = 0; i < 420; i++) {
      const px = rand() * w;
      const py = rand() * h;
      const pr = 10 + rand() * 38;
      const pg = plasmaCtx.createRadialGradient(px, py, 1, px, py, pr);
      pg.addColorStop(0, `rgba(255, 240, 175, ${0.18 + rand() * 0.25})`);
      pg.addColorStop(0.6, `rgba(255, 125, 25, ${0.1 + rand() * 0.15})`);
      pg.addColorStop(1, 'rgba(255, 80, 0, 0)');
      plasmaCtx.fillStyle = pg;
      plasmaCtx.beginPath();
      plasmaCtx.arc(px, py, pr, 0, Math.PI * 2);
      plasmaCtx.fill();
    }

    return {
      map: toTexture(canvas, true),
      plasmaMap: toTexture(plasmaCanvas, true),
    };
  }

  if (id === 'mercury') {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#7c7872');
    bg.addColorStop(0.5, '#9d9890');
    bg.addColorStop(1, '#6f6b66');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Silicate regolith mottling & impact craters (Caloris Basin style)
    for (let i = 0; i < 950; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 2 + Math.pow(rand(), 3) * 42;
      ctx.strokeStyle = `rgba(230, 225, 215, ${0.12 + rand() * 0.22})`;
      ctx.lineWidth = Math.max(1, r * 0.12);
      ctx.fillStyle = `rgba(55, 52, 48, ${0.2 + rand() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bump crater rim
      bumpCtx.strokeStyle = '#ffffff';
      bumpCtx.lineWidth = Math.max(1, r * 0.15);
      bumpCtx.fillStyle = '#303030';
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r, 0, Math.PI * 2);
      bumpCtx.fill();
      bumpCtx.stroke();
    }

    return {
      map: toTexture(canvas, true),
      bumpMap: toTexture(bumpCanvas, false),
    };
  }

  if (id === 'venus') {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#c89648');
    bg.addColorStop(0.3, '#e7be74');
    bg.addColorStop(0.5, '#f4d599');
    bg.addColorStop(0.7, '#e2b261');
    bg.addColorStop(1, '#bd893d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Swirling V-shaped sulfuric acid super-rotation cloud bands
    for (let i = 0; i < 180; i++) {
      const y = rand() * h;
      const bandH = 6 + rand() * 28;
      ctx.fillStyle =
        rand() > 0.5
          ? `rgba(255, 240, 200, ${0.08 + rand() * 0.14})`
          : `rgba(165, 105, 35, ${0.08 + rand() * 0.14})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) {
        const wave = Math.sin((x / w) * Math.PI * 4 + i) * 14;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(w, y + bandH);
      ctx.lineTo(0, y + bandH);
      ctx.closePath();
      ctx.fill();
    }

    return {
      map: toTexture(canvas, true),
      bumpMap: toTexture(bumpCanvas, false),
    };
  }

  if (id === 'earth') {
    const { canvas: roughCanvas, ctx: roughCtx } = createCanvas(w, h);

    // 1. Deep Ocean Base with realistic bathymetric depth gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#072247');
    oceanGrad.addColorStop(0.22, '#07356e');
    oceanGrad.addColorStop(0.5, '#09498f');
    oceanGrad.addColorStop(0.78, '#07356e');
    oceanGrad.addColorStop(1, '#072247');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Ocean roughness is low (smooth water reflects sunlight glints)
    roughCtx.fillStyle = '#383838';
    roughCtx.fillRect(0, 0, w, h);
    bumpCtx.fillStyle = '#404040';
    bumpCtx.fillRect(0, 0, w, h);

    // Helper to draw recognizable polygonal continental shapes with coastal shelves, biomes, and mountain relief
    const drawContinentPolygon = (
      points: Array<[number, number]>,
      biome: 'temperate' | 'tropical' | 'arid' | 'boreal' | 'polar',
      mountainSpine?: Array<[number, number]>
    ) => {
      // Continental shelf shallow turquoise water glow
      ctx.save();
      ctx.beginPath();
      points.forEach(([px, py], idx) => {
        if (idx === 0) ctx.moveTo(px * w, py * h);
        else ctx.lineTo(px * w, py * h);
      });
      ctx.closePath();
      ctx.lineJoin = 'round';
      ctx.lineWidth = 18;
      ctx.strokeStyle = 'rgba(18, 138, 178, 0.35)';
      ctx.stroke();
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(42, 175, 198, 0.45)';
      ctx.stroke();

      // Fill main continental landmass
      const fillColors: Record<typeof biome, string> = {
        temperate: '#2d6e36',
        tropical: '#1e5c29',
        arid: '#c29b61',
        boreal: '#3d5e3a',
        polar: '#eef6fc',
      };
      ctx.fillStyle = fillColors[biome];
      ctx.fill();

      // Clip interior to paint sub-biome texture variations (forests, plains, deserts)
      ctx.clip();
      for (let i = 0; i < 95; i++) {
        const rx = rand() * w;
        const ry = rand() * h;
        const rr = 8 + rand() * 34;
        const g = ctx.createRadialGradient(rx, ry, 1, rx, ry, rr);
        if (biome === 'arid') {
          g.addColorStop(0, 'rgba(218, 182, 118, 0.55)');
          g.addColorStop(1, 'rgba(145, 112, 62, 0)');
        } else if (biome === 'tropical') {
          g.addColorStop(0, 'rgba(24, 112, 42, 0.5)');
          g.addColorStop(1, 'rgba(52, 132, 58, 0)');
        } else if (biome === 'polar') {
          g.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          g.addColorStop(1, 'rgba(210, 230, 248, 0)');
        } else {
          const isDryPatch = rand() > 0.65;
          g.addColorStop(
            0,
            isDryPatch
              ? 'rgba(168, 145, 92, 0.45)'
              : 'rgba(48, 128, 54, 0.48)'
          );
          g.addColorStop(1, 'rgba(34, 92, 40, 0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(rx, ry, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Landmass Roughness (matte land ~0.85) & Bump elevation
      roughCtx.save();
      roughCtx.beginPath();
      points.forEach(([px, py], idx) => {
        if (idx === 0) roughCtx.moveTo(px * w, py * h);
        else roughCtx.lineTo(px * w, py * h);
      });
      roughCtx.closePath();
      roughCtx.fillStyle = '#d8d8d8';
      roughCtx.fill();
      roughCtx.restore();

      bumpCtx.save();
      bumpCtx.beginPath();
      points.forEach(([px, py], idx) => {
        if (idx === 0) bumpCtx.moveTo(px * w, py * h);
        else bumpCtx.lineTo(px * w, py * h);
      });
      bumpCtx.closePath();
      bumpCtx.fillStyle = '#9e9e9e';
      bumpCtx.fill();
      bumpCtx.restore();

      if (mountainSpine && mountainSpine.length > 1) {
        ctx.save();
        ctx.beginPath();
        mountainSpine.forEach(([mx, my], idx) => {
          if (idx === 0) ctx.moveTo(mx * w, my * h);
          else ctx.lineTo(mx * w, my * h);
        });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'rgba(138, 118, 94, 0.68)';
        ctx.stroke();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(235, 242, 248, 0.55)';
        ctx.stroke();
        ctx.restore();

        bumpCtx.save();
        bumpCtx.beginPath();
        mountainSpine.forEach(([mx, my], idx) => {
          if (idx === 0) bumpCtx.moveTo(mx * w, my * h);
          else bumpCtx.lineTo(mx * w, my * h);
        });
        bumpCtx.lineCap = 'round';
        bumpCtx.lineWidth = 9;
        bumpCtx.strokeStyle = '#ffffff';
        bumpCtx.stroke();
        bumpCtx.restore();
      }
    };

    // North America (Alaska, Canada, USA, Mexico/Central America)
    drawContinentPolygon(
      [
        [0.08, 0.14],
        [0.16, 0.12],
        [0.27, 0.14],
        [0.32, 0.21],
        [0.28, 0.29],
        [0.23, 0.36],
        [0.21, 0.43],
        [0.25, 0.49],
        [0.22, 0.49],
        [0.18, 0.41],
        [0.15, 0.32],
        [0.12, 0.22],
      ],
      'temperate',
      [
        [0.12, 0.16],
        [0.16, 0.24],
        [0.19, 0.35],
        [0.21, 0.43],
      ]
    );

    // Greenland
    drawContinentPolygon(
      [
        [0.33, 0.08],
        [0.41, 0.07],
        [0.43, 0.15],
        [0.37, 0.19],
        [0.34, 0.14],
      ],
      'polar'
    );

    // South America (Amazonia + Andes + Patagonia)
    drawContinentPolygon(
      [
        [0.26, 0.49],
        [0.32, 0.51],
        [0.37, 0.58],
        [0.35, 0.69],
        [0.31, 0.81],
        [0.29, 0.86],
        [0.27, 0.78],
        [0.26, 0.64],
        [0.24, 0.54],
      ],
      'tropical',
      [
        [0.26, 0.52],
        [0.27, 0.63],
        [0.28, 0.75],
        [0.29, 0.84],
      ]
    );

    // Africa (Sahara + Congo Basin + East African Rift + Southern Africa)
    drawContinentPolygon(
      [
        [0.46, 0.33],
        [0.54, 0.32],
        [0.59, 0.36],
        [0.63, 0.46],
        [0.6, 0.57],
        [0.57, 0.71],
        [0.54, 0.76],
        [0.51, 0.66],
        [0.49, 0.53],
        [0.44, 0.47],
        [0.44, 0.38],
      ],
      'arid',
      [
        [0.58, 0.44],
        [0.58, 0.56],
        [0.56, 0.68],
      ]
    );

    // Central African Rainforest belt over Africa
    drawContinentPolygon(
      [
        [0.48, 0.48],
        [0.58, 0.49],
        [0.58, 0.62],
        [0.51, 0.62],
      ],
      'tropical'
    );

    // Madagascar
    drawContinentPolygon(
      [
        [0.62, 0.64],
        [0.64, 0.63],
        [0.64, 0.71],
        [0.62, 0.71],
      ],
      'tropical'
    );

    // Europe & Scandinavia
    drawContinentPolygon(
      [
        [0.46, 0.16],
        [0.54, 0.13],
        [0.59, 0.16],
        [0.58, 0.28],
        [0.53, 0.3],
        [0.47, 0.29],
        [0.45, 0.24],
      ],
      'temperate',
      [
        [0.48, 0.26],
        [0.53, 0.26],
        [0.57, 0.25],
      ]
    );

    // Eurasia (Russia, Central Asia, East Asia, India, Southeast Asia)
    drawContinentPolygon(
      [
        [0.58, 0.14],
        [0.74, 0.12],
        [0.89, 0.16],
        [0.92, 0.24],
        [0.86, 0.34],
        [0.81, 0.44],
        [0.77, 0.47],
        [0.73, 0.39],
        [0.7, 0.46],
        [0.67, 0.38],
        [0.62, 0.37],
        [0.58, 0.28],
      ],
      'temperate',
      [
        [0.61, 0.31], // Zagros / Alborz
        [0.67, 0.33], // Hindu Kush
        [0.74, 0.35], // Himalayas / Tibetan Plateau
        [0.8, 0.32],
      ]
    );

    // Arabian Peninsula & Iranian Plateau arid belt
    drawContinentPolygon(
      [
        [0.58, 0.31],
        [0.68, 0.3],
        [0.69, 0.39],
        [0.61, 0.42],
        [0.58, 0.36],
      ],
      'arid'
    );

    // Maritime Southeast Asia / Indonesia & Japan
    drawContinentPolygon(
      [
        [0.78, 0.48],
        [0.85, 0.5],
        [0.87, 0.55],
        [0.79, 0.54],
      ],
      'tropical'
    );

    // Australia
    drawContinentPolygon(
      [
        [0.79, 0.63],
        [0.88, 0.62],
        [0.91, 0.71],
        [0.87, 0.78],
        [0.79, 0.75],
        [0.77, 0.68],
      ],
      'arid',
      [
        [0.89, 0.64],
        [0.89, 0.75],
      ]
    );

    // Arctic & Antarctic Polar Ice Caps
    drawContinentPolygon(
      [
        [0, 0.91],
        [1, 0.91],
        [1, 1],
        [0, 1],
      ],
      'polar'
    );
    ctx.fillStyle = 'rgba(238, 248, 255, 0.92)';
    ctx.fillRect(0, 0, w, 18);

    // Separate dynamic atmospheric cloud layer with synoptic cyclone spirals and trade-wind bands
    const { canvas: cloudCanvas, ctx: cloudCtx } = createCanvas(w, h);
    for (let i = 0; i < 460; i++) {
      const cx = rand() * w;
      const cy = rand() * h;
      const rx = 16 + rand() * 72;
      const ry = 4 + rand() * 15;
      const grad = cloudCtx.createRadialGradient(cx, cy, 1, cx, cy, rx);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.26 + rand() * 0.38})`);
      grad.addColorStop(0.65, `rgba(245, 250, 255, ${0.12 + rand() * 0.18})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      cloudCtx.fillStyle = grad;
      cloudCtx.save();
      cloudCtx.translate(cx, cy);
      cloudCtx.rotate((rand() - 0.5) * 0.35);
      cloudCtx.scale(1, ry / rx);
      cloudCtx.beginPath();
      cloudCtx.arc(0, 0, rx, 0, Math.PI * 2);
      cloudCtx.fill();
      cloudCtx.restore();
    }

    return {
      map: toTexture(canvas, true),
      bumpMap: toTexture(bumpCanvas, false),
      roughnessMap: toTexture(roughCanvas, false),
      cloudsMap: toTexture(cloudCanvas, true),
    };
  }

  if (id === 'mars') {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#9c3e22');
    bg.addColorStop(0.5, '#cf5932');
    bg.addColorStop(1, '#8c351b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Basaltic dark regions (Syrtis Major) & bright rust plains
    for (let i = 0; i < 480; i++) {
      const x = rand() * w;
      const y = 35 + rand() * (h - 70);
      const r = 8 + rand() * 55;
      ctx.fillStyle =
        rand() > 0.42
          ? `rgba(232, 118, 68, ${0.12 + rand() * 0.2})`
          : `rgba(88, 32, 18, ${0.14 + rand() * 0.25})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      bumpCtx.fillStyle = rand() > 0.5 ? '#c4c4c4' : '#4a4a4a';
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      bumpCtx.fill();
    }

    // Valles Marineris equatorial canyon scar
    ctx.strokeStyle = 'rgba(58, 18, 8, 0.78)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(380, 260);
    ctx.bezierCurveTo(450, 248, 540, 272, 620, 256);
    ctx.stroke();

    // Olympus Mons shield volcano
    const omGrad = ctx.createRadialGradient(240, 195, 2, 240, 195, 36);
    omGrad.addColorStop(0, '#ffd2b3');
    omGrad.addColorStop(0.35, '#a83e20');
    omGrad.addColorStop(1, 'rgba(168, 62, 32, 0)');
    ctx.fillStyle = omGrad;
    ctx.beginPath();
    ctx.arc(240, 195, 36, 0, Math.PI * 2);
    ctx.fill();

    // Polar CO2 & water ice caps
    ctx.fillStyle = '#f5ebe6';
    ctx.fillRect(0, 0, w, 16);
    ctx.fillRect(0, h - 18, w, 18);

    return {
      map: toTexture(canvas, true),
      bumpMap: toTexture(bumpCanvas, false),
    };
  }

  if (id === 'jupiter') {
    // Alternating zonal ammonia belts & zones
    const bands = [
      { stop: 0.0, color: '#7a6752' },
      { stop: 0.12, color: '#c8ab89' },
      { stop: 0.2, color: '#9e6b43' },
      { stop: 0.28, color: '#e8d5bc' },
      { stop: 0.36, color: '#b57445' },
      { stop: 0.45, color: '#f3e5d0' },
      { stop: 0.54, color: '#c48352' },
      { stop: 0.64, color: '#dfcaa8' },
      { stop: 0.73, color: '#8f5f3d' },
      { stop: 0.84, color: '#cbb393' },
      { stop: 1.0, color: '#6e5c49' },
    ];
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bands.forEach((b) => bg.addColorStop(b.stop, b.color));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Turbulent Kelvin-Helmholtz eddies along band boundaries
    for (let i = 0; i < 320; i++) {
      const y = rand() * h;
      const x = rand() * w;
      const rw = 24 + rand() * 90;
      const rh = 3 + rand() * 9;
      ctx.fillStyle =
        rand() > 0.5
          ? 'rgba(255, 244, 226, 0.18)'
          : 'rgba(135, 68, 30, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Iconic Great Red Spot in southern hemisphere
    const grsX = 540;
    const grsY = 335;
    ctx.save();
    ctx.translate(grsX, grsY);
    const grsGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 56);
    grsGrad.addColorStop(0, '#e84c27');
    grsGrad.addColorStop(0.55, '#c83b1b');
    grsGrad.addColorStop(0.85, '#f0d5b8');
    grsGrad.addColorStop(1, 'rgba(240, 213, 184, 0)');
    ctx.fillStyle = grsGrad;
    ctx.scale(1.65, 0.95);
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    return { map: toTexture(canvas, true) };
  }

  if (id === 'saturn') {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0.0, '#9c8861');
    bg.addColorStop(0.2, '#d8c08e');
    bg.addColorStop(0.4, '#f0dbb0');
    bg.addColorStop(0.5, '#faeac9');
    bg.addColorStop(0.6, '#ebd4a7');
    bg.addColorStop(0.8, '#cfb582');
    bg.addColorStop(1.0, '#8f7b56');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle golden atmospheric banding
    for (let i = 0; i < 140; i++) {
      const y = rand() * h;
      ctx.fillStyle =
        rand() > 0.5
          ? 'rgba(255, 248, 225, 0.12)'
          : 'rgba(160, 130, 80, 0.12)';
      ctx.fillRect(0, y, w, 2 + rand() * 6);
    }

    // Generate concentric ring texture (radial UV mapping or planar ring canvas)
    const ringMap = createPlanetaryRingTexture('saturn');
    return { map: toTexture(canvas, true), ringMap };
  }

  if (id === 'uranus') {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#58b8cc');
    bg.addColorStop(0.5, '#8ce8f8');
    bg.addColorStop(1, '#52aec2');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 90; i++) {
      const y = rand() * h;
      ctx.fillStyle = 'rgba(220, 252, 255, 0.1)';
      ctx.fillRect(0, y, w, 3 + rand() * 10);
    }

    const ringMap = createPlanetaryRingTexture('uranus');
    return { map: toTexture(canvas, true), ringMap };
  }

  // Neptune
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#18368c');
  bg.addColorStop(0.3, '#2856cc');
  bg.addColorStop(0.5, '#3b73f0');
  bg.addColorStop(0.7, '#244eb8');
  bg.addColorStop(1, '#152f7a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // High-altitude white methane cirrus streaks & Great Dark Spot
  for (let i = 0; i < 150; i++) {
    const x = rand() * w;
    const y = rand() * h;
    ctx.fillStyle =
      rand() > 0.35
        ? 'rgba(175, 220, 255, 0.22)'
        : 'rgba(15, 32, 95, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x, y, 25 + rand() * 65, 2 + rand() * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Great Dark Spot vortex
  ctx.save();
  ctx.translate(460, 295);
  ctx.scale(1.6, 0.9);
  const gds = ctx.createRadialGradient(0, 0, 4, 0, 0, 38);
  gds.addColorStop(0, 'rgba(10, 22, 68, 0.85)');
  gds.addColorStop(0.75, 'rgba(28, 62, 155, 0.45)');
  gds.addColorStop(1, 'rgba(40, 86, 204, 0)');
  ctx.fillStyle = gds;
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return { map: toTexture(canvas, true) };
}

/**
 * Generates a radial concentric ring texture on a 1024x1024 canvas for `THREE.RingGeometry`
 * with default planar UVs (where center is (0.5, 0.5) and outer edge is radius 0.5).
 */
function createPlanetaryRingTexture(
  planet: 'saturn' | 'uranus'
): THREE.CanvasTexture {
  const size = 1024;
  const { canvas, ctx } = createCanvas(size, size);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  const grad = ctx.createRadialGradient(cx, cy, maxR * 0.35, cx, cy, maxR);

  if (planet === 'saturn') {
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.08, 'rgba(140, 120, 95, 0.22)'); // D & C Ring
    grad.addColorStop(0.24, 'rgba(225, 198, 152, 0.78)'); // B Ring inner
    grad.addColorStop(0.46, 'rgba(248, 228, 186, 0.92)'); // B Ring peak
    grad.addColorStop(0.56, 'rgba(215, 190, 145, 0.82)');
    grad.addColorStop(0.60, 'rgba(15, 15, 22, 0.06)'); // Cassini Division gap!
    grad.addColorStop(0.65, 'rgba(205, 182, 142, 0.68)'); // A Ring
    grad.addColorStop(0.84, 'rgba(185, 165, 130, 0.52)');
    grad.addColorStop(0.87, 'rgba(15, 15, 22, 0.08)'); // Encke Gap
    grad.addColorStop(0.92, 'rgba(210, 190, 155, 0.45)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  } else {
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.45, 'rgba(130, 220, 240, 0.18)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.02)');
    grad.addColorStop(0.75, 'rgba(160, 235, 250, 0.32)');
    grad.addColorStop(0.92, 'rgba(120, 210, 235, 0.15)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const MOON_TEXTURE_CACHE = new Map<
  string,
  { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture }
>();

/**
 * Generates and caches realistic procedural 2D canvas textures for each moon archetype & specific Galilean moons.
 */
export function createMoonTexture(
  type: MoonTextureType,
  moonId?: MoonId
): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const cacheKey = moonId ? `${type}:${moonId}` : type;
  const cached = MOON_TEXTURE_CACHE.get(cacheKey);
  if (cached) return cached;

  const w = 512;
  const h = 256;
  const { canvas, ctx } = createCanvas(w, h);
  const { canvas: bumpCanvas, ctx: bumpCtx } = createCanvas(w, h);
  const rand = mulberry32(
    cacheKey.charCodeAt(0) * 911 + cacheKey.length * 173 + (moonId ? moonId.charCodeAt(1) * 43 : 0)
  );

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, w, h);

  if (type === 'lunar') {
    // Anorthositic lunar highlands + dark basaltic Maria (Mare Imbrium, Tranquillitatis, Serenitatis)
    ctx.fillStyle = '#b4b8c2';
    ctx.fillRect(0, 0, w, h);

    // Dark basaltic maria basins
    const maria = [
      { x: 165, y: 95, r: 54 },
      { x: 245, y: 115, r: 46 },
      { x: 310, y: 135, r: 38 },
      { x: 120, y: 140, r: 42 },
    ];
    maria.forEach((m) => {
      const g = ctx.createRadialGradient(m.x, m.y, 4, m.x, m.y, m.r);
      g.addColorStop(0, 'rgba(68, 72, 82, 0.85)');
      g.addColorStop(0.7, 'rgba(82, 86, 96, 0.55)');
      g.addColorStop(1, 'rgba(180, 184, 194, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Impact craters & bright ejecta rays (Tycho & Copernicus)
    for (let i = 0; i < 420; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 1.5 + Math.pow(rand(), 3) * 18;
      ctx.fillStyle = `rgba(75, 78, 86, ${0.22 + rand() * 0.25})`;
      ctx.strokeStyle = `rgba(238, 242, 248, ${0.2 + rand() * 0.3})`;
      ctx.lineWidth = Math.max(0.8, r * 0.14);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      bumpCtx.fillStyle = '#383838';
      bumpCtx.strokeStyle = '#ececec';
      bumpCtx.lineWidth = Math.max(1, r * 0.16);
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r, 0, Math.PI * 2);
      bumpCtx.fill();
      bumpCtx.stroke();
    }
  } else if (type === 'volcanic') {
    // Io: Sulfur yellow, orange silicate lava flows & dark volcanic calderas (Pele, Loki Patera)
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#ca8a04');
    bg.addColorStop(0.5, '#facc15');
    bg.addColorStop(1, '#d97706');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 190; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 4 + rand() * 28;
      ctx.fillStyle =
        rand() > 0.32
          ? `rgba(234, 88, 12, ${0.24 + rand() * 0.35})`
          : `rgba(38, 16, 6, ${0.42 + rand() * 0.45})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pele red sulfur ring plume deposit
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.55)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(280, 138, 34, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === 'icy-cracked') {
    // Europa / Titania: Bright water-ice shell crisscrossed by reddish-brown tectonic lineae fractures
    ctx.fillStyle = '#e6f2fa';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 75; i++) {
      ctx.strokeStyle =
        i % 2 === 0
          ? 'rgba(162, 88, 52, 0.48)'
          : 'rgba(105, 162, 204, 0.38)';
      ctx.lineWidth = 0.8 + rand() * 2.2;
      ctx.beginPath();
      ctx.moveTo(rand() * w, rand() * h);
      ctx.bezierCurveTo(
        rand() * w,
        rand() * h,
        rand() * w,
        rand() * h,
        rand() * w,
        rand() * h
      );
      ctx.stroke();

      bumpCtx.strokeStyle = '#454545';
      bumpCtx.lineWidth = 1.5;
      bumpCtx.stroke();
    }
  } else if (type === 'titan') {
    // Titan: Thick golden-orange nitrogen & methane photochemical haze with subtle dark hydrocarbon seas
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#b45309');
    bg.addColorStop(0.5, '#f59e0b');
    bg.addColorStop(1, '#d97706');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 80; i++) {
      const y = rand() * h;
      ctx.fillStyle = 'rgba(254, 243, 199, 0.12)';
      ctx.fillRect(0, y, w, 3 + rand() * 8);
    }
  } else if (type === 'enceladus') {
    // Enceladus: Purest bright snow-white ice with cyan "Tiger Stripes" fractures at south pole
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 35; i++) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.48)';
      ctx.lineWidth = 1.5 + rand() * 2;
      ctx.beginPath();
      ctx.moveTo(rand() * w, h * 0.65 + rand() * h * 0.3);
      ctx.lineTo(rand() * w, h * 0.65 + rand() * h * 0.3);
      ctx.stroke();
    }
  } else if (type === 'triton') {
    // Triton: Pinkish-cyan frozen nitrogen & methane ice with cantaloupe dimples and dark geyser streaks
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#cbd5e1');
    bg.addColorStop(0.55, '#e2e8f0');
    bg.addColorStop(1, '#f1d4d4');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 160; i++) {
      const x = rand() * w;
      const y = rand() * h;
      ctx.fillStyle =
        rand() > 0.3
          ? 'rgba(148, 163, 184, 0.3)'
          : 'rgba(51, 65, 85, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x, y, 8 + rand() * 16, 2 + rand() * 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (moonId === 'ganymede') {
    // Ganymede: Visually distinct dichotomous surface — dark Galileo Regio patches + bright grooved sulci bands
    ctx.fillStyle = '#9aa6b8';
    ctx.fillRect(0, 0, w, h);

    // Dark ancient Galileo Regio regions
    const darkRegions = [
      { x: 150, y: 105, rx: 85, ry: 52 },
      { x: 370, y: 145, rx: 95, ry: 58 },
    ];
    darkRegions.forEach((dr) => {
      ctx.fillStyle = 'rgba(68, 62, 58, 0.72)';
      ctx.beginPath();
      ctx.ellipse(dr.x, dr.y, dr.rx, dr.ry, 0.25, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bright grooved tectonic sulci ribbons
    for (let i = 0; i < 55; i++) {
      ctx.strokeStyle = 'rgba(226, 236, 248, 0.38)';
      ctx.lineWidth = 2 + rand() * 4;
      ctx.beginPath();
      const sy = rand() * h;
      ctx.moveTo(0, sy);
      ctx.bezierCurveTo(w * 0.33, sy + (rand() - 0.5) * 45, w * 0.66, sy + (rand() - 0.5) * 45, w, sy);
      ctx.stroke();
    }

    // Moderate craters
    for (let i = 0; i < 160; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 1.5 + rand() * 8;
      ctx.strokeStyle = 'rgba(240, 246, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (moonId === 'callisto') {
    // Callisto: Dark ancient carbonaceous-ice surface densely speckled with bright white frost impact craters + Valhalla multi-ring basin
    ctx.fillStyle = '#4c5361';
    ctx.fillRect(0, 0, w, h);

    // Valhalla concentric multi-ring impact structure
    for (let ring = 1; ring <= 6; ring++) {
      ctx.strokeStyle = `rgba(218, 228, 242, ${0.42 - ring * 0.05})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(240, 122, ring * 11, 0, Math.PI * 2);
      ctx.stroke();
    }

    // High-density bright-rimmed frost craters
    for (let i = 0; i < 520; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 1.2 + Math.pow(rand(), 3) * 14;
      ctx.fillStyle = 'rgba(32, 36, 44, 0.45)';
      ctx.strokeStyle = `rgba(235, 244, 255, ${0.35 + rand() * 0.45})`;
      ctx.lineWidth = Math.max(0.9, r * 0.18);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      bumpCtx.fillStyle = '#303030';
      bumpCtx.strokeStyle = '#f0f0f0';
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r, 0, Math.PI * 2);
      bumpCtx.fill();
      bumpCtx.stroke();
    }
  } else {
    // rocky / icy-dark (Phobos, Deimos, Oberon)
    ctx.fillStyle = type === 'rocky' ? '#8c827a' : '#788496';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 340; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = 2 + Math.pow(rand(), 2.6) * 16;
      ctx.fillStyle = `rgba(40, 44, 52, ${0.25 + rand() * 0.3})`;
      ctx.strokeStyle =
        type === 'icy-dark'
          ? `rgba(226, 232, 240, ${0.25 + rand() * 0.35})`
          : `rgba(195, 185, 175, ${0.2 + rand() * 0.25})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      bumpCtx.fillStyle = '#363636';
      bumpCtx.strokeStyle = '#e5e5e5';
      bumpCtx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      bumpCtx.fill();
      bumpCtx.stroke();
    }
  }

  const bundle = {
    map: toTexture(canvas, true),
    bumpMap: toTexture(bumpCanvas, false),
  };
  MOON_TEXTURE_CACHE.set(cacheKey, bundle);
  return bundle;
}
