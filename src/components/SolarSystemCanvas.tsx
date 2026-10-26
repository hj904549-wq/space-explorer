import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  CELESTIAL_BODIES,
  CelestialBodyData,
  CelestialId,
  Language,
  MoonId,
  MoonInfo,
  ScrollSectionId,
} from '../data/solarSystemData.ts';
import {
  CELESTIAL_INTERIOR_MODELS,
  InteriorLayer3D,
} from '../data/interiorAndSourcesData.ts';
import {
  computeScrollCameraState,
  distanceVec3,
  getCelestialBody,
  getMoonById,
  getMoonCameraState,
  getMoonWorldPosition,
  getPlanetWorldPosition,
  tText,
} from '../utils/astronomyMath.ts';
import {
  createMoonTexture,
  createPlanetTextures,
  createSolarCoronaTexture,
} from '../three/proceduralTextures.ts';

export interface SolarSystemCanvasProps {
  lang: Language;
  scrollProgress: number;
  selectedPlanetId: CelestialId | null;
  selectedMoonId: MoonId | null;
  isDossierOpen: boolean;
  isExploringInterior: boolean;
  selectedInteriorLayerId: string | null;
  recenterSignal?: number;
  isPaused: boolean;
  orbitSpeedMultiplier: number;
  showOrbits: boolean;
  showLabels: boolean;
  showStarfield: boolean;
  highQualityGlow: boolean;
  activeTab: 'explore' | 'compare' | 'learn' | 'quiz';
  comparePlanetIds: CelestialId[];
  onSelectPlanet: (id: CelestialId, openDossier?: boolean) => void;
  onSelectMoon: (moonId: MoonId) => void;
  onSelectInteriorLayer: (layerId: string) => void;
  onActiveSectionChange?: (section: ScrollSectionId) => void;
}

interface HoveredScreenInfo {
  kind: 'planet' | 'moon' | 'interior-layer';
  planetId: CelestialId;
  moonId?: MoonId;
  interiorLayer?: InteriorLayer3D;
  x: number;
  y: number;
}

interface SelectedMoonScreenMarker {
  moonId: MoonId;
  x: number;
  y: number;
  visible: boolean;
}

interface MoonSceneNode {
  info: MoonInfo;
  indexOnPlanet: number;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  hitMesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  reticleMesh: THREE.Mesh;
  orbitLine: THREE.LineLoop;
  phase: number;
}

interface InteriorLayerMeshEntry {
  layer: InteriorLayer3D;
  meshes: THREE.Mesh[];
  materials: THREE.MeshStandardMaterial[];
}

interface PlanetSceneNode {
  data: CelestialBodyData;
  rootGroup: THREE.Group;
  tiltGroup: THREE.Group;
  surfaceMesh: THREE.Mesh;
  cloudMesh?: THREE.Mesh;
  plasmaMesh?: THREE.Mesh;
  atmosphereMesh?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
  reticleMesh: THREE.Mesh;
  orbitLine?: THREE.LineLoop;
  interiorGroup: THREE.Group;
  interiorLayers: InteriorLayerMeshEntry[];
  moons: MoonSceneNode[];
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  lang,
  scrollProgress,
  selectedPlanetId,
  selectedMoonId,
  isDossierOpen,
  isExploringInterior,
  selectedInteriorLayerId,
  recenterSignal = 0,
  isPaused,
  orbitSpeedMultiplier,
  showOrbits,
  showLabels,
  showStarfield,
  highQualityGlow,
  activeTab,
  comparePlanetIds,
  onSelectPlanet,
  onSelectMoon,
  onSelectInteriorLayer,
  onActiveSectionChange,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<HoveredScreenInfo | null>(
    null
  );
  const [selectedMoonMarker, setSelectedMoonMarker] =
    useState<SelectedMoonScreenMarker | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [hudTelemetry, setHudTelemetry] = useState<{
    activeSection: ScrollSectionId;
    camDistance: number;
  }>({
    activeSection: 'overview-start',
    camDistance: 165,
  });

  const stateRef = useRef({
    lang,
    scrollProgress,
    selectedPlanetId,
    selectedMoonId,
    isDossierOpen,
    isExploringInterior,
    selectedInteriorLayerId,
    isPaused,
    orbitSpeedMultiplier,
    showOrbits,
    showLabels,
    showStarfield,
    highQualityGlow,
    activeTab,
    comparePlanetIds,
    onSelectPlanet,
    onSelectMoon,
    onSelectInteriorLayer,
    onActiveSectionChange,
  });

  useEffect(() => {
    stateRef.current = {
      lang,
      scrollProgress,
      selectedPlanetId,
      selectedMoonId,
      isDossierOpen,
      isExploringInterior,
      selectedInteriorLayerId,
      isPaused,
      orbitSpeedMultiplier,
      showOrbits,
      showLabels,
      showStarfield,
      highQualityGlow,
      activeTab,
      comparePlanetIds,
      onSelectPlanet,
      onSelectMoon,
      onSelectInteriorLayer,
      onActiveSectionChange,
    };
  }, [
    lang,
    scrollProgress,
    selectedPlanetId,
    selectedMoonId,
    isDossierOpen,
    isExploringInterior,
    selectedInteriorLayerId,
    isPaused,
    orbitSpeedMultiplier,
    showOrbits,
    showLabels,
    showStarfield,
    highQualityGlow,
    activeTab,
    comparePlanetIds,
    onSelectPlanet,
    onSelectMoon,
    onSelectInteriorLayer,
    onActiveSectionChange,
  ]);

  const inspectOffsetRef = useRef({
    azimuth: 0,
    elevation: 0,
    zoomDelta: 0,
    isDragging: false,
    downX: 0,
    downY: 0,
    movedDistance: 0,
  });

  // Reset user orbital drag offset when recenterSignal changes or when switching moon/interior focus
  useEffect(() => {
    inspectOffsetRef.current.azimuth = 0;
    inspectOffsetRef.current.elevation = 0;
    inspectOffsetRef.current.zoomDelta = 0;
  }, [recenterSignal, selectedMoonId, isExploringInterior]);

  const prevScrollRef = useRef(scrollProgress);
  useEffect(() => {
    if (Math.abs(scrollProgress - prevScrollRef.current) > 0.015) {
      inspectOffsetRef.current.azimuth *= 0.5;
      inspectOffsetRef.current.elevation *= 0.5;
      inspectOffsetRef.current.zoomDelta *= 0.5;
      prevScrollRef.current = scrollProgress;
    }
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch (err) {
      setWebglError(
        err instanceof Error ? err.message : 'WebGL initialization failed'
      );
      return;
    }

    const gl = renderer.getContext();
    const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = dbgInfo
      ? String(gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) || '')
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe/i.test(rendererName);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('WebGL context lost');
    };
    const handleContextRestored = () => {
      setWebglError(null);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050811');
    scene.fog = new THREE.FogExp2('#050811', 0.0012);

    const camera = new THREE.PerspectiveCamera(
      46,
      (container.clientWidth || window.innerWidth) /
        Math.max(1, container.clientHeight || window.innerHeight),
      0.1,
      1200
    );
    camera.position.set(0, 88, 165);

    const ambientLight = new THREE.AmbientLight('#24345a', 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#65d9ff', '#0b0e18', 0.45);
    scene.add(hemiLight);

    const sunLight = new THREE.PointLight('#fff4dc', 3.4, 650, 0.35);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Multi-Layered Starfield
    const starGroup = new THREE.Group();
    scene.add(starGroup);

    const buildStarLayer = (
      count: number,
      size: number,
      radiusMin: number,
      radiusMax: number
    ) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const palette = [
        new THREE.Color('#e0e2f1'),
        new THREE.Color('#65d9ff'),
        new THREE.Color('#b2c5ff'),
        new THREE.Color('#f8c270'),
      ];

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radiusMin + Math.random() * (radiusMax - radiusMin);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const c = palette[i % palette.length];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false,
      });
      return new THREE.Points(geo, mat);
    };

    const starCountFine = isSoftwareGl ? 1400 : 3200;
    const starCountBright = isSoftwareGl ? 250 : 500;
    starGroup.add(buildStarLayer(starCountFine, 1.1, 240, 520));
    starGroup.add(buildStarLayer(starCountBright, 2.3, 210, 440));

    // Asteroid Belt
    const asteroidCount = isSoftwareGl ? 260 : 650;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.24, 0);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: '#8f877c',
      roughness: 0.9,
      metalness: 0.1,
    });
    const asteroidBelt = new THREE.InstancedMesh(
      asteroidGeo,
      asteroidMat,
      asteroidCount
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < asteroidCount; i++) {
      const angle = (i / asteroidCount) * Math.PI * 2 + Math.random() * 0.2;
      const r = 50.5 + (Math.random() - 0.5) * 7.5;
      const y = (Math.random() - 0.5) * 2.4;
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scale = 0.45 + Math.random() * 1.45;
      dummy.scale.set(scale, scale * 0.75, scale);
      dummy.updateMatrix();
      asteroidBelt.setMatrixAt(i, dummy.matrix);
    }
    asteroidBelt.instanceMatrix.needsUpdate = true;
    scene.add(asteroidBelt);

    // Build Celestial Bodies, Moons, and 3D Cutaway Interior Models
    const planetNodes = new Map<CelestialId, PlanetSceneNode>();
    const moonNodes = new Map<MoonId, MoonSceneNode>();
    const interactableMeshes: THREE.Object3D[] = [];
    const sphereSegments = isSoftwareGl ? 32 : 64;
    const moonSegments = isSoftwareGl ? 20 : 32;

    const coronaTexture = createSolarCoronaTexture();
    let sunCoronaSprite: THREE.Sprite | null = null;
    const sunProminenceGroup = new THREE.Group();

    for (const body of CELESTIAL_BODIES) {
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg);
      rootGroup.add(tiltGroup);

      const textures = createPlanetTextures(body.id);
      const sphereGeo = new THREE.SphereGeometry(
        body.sceneRadius,
        sphereSegments,
        sphereSegments
      );

      let surfaceMat: THREE.Material;
      if (body.id === 'sun') {
        surfaceMat = new THREE.MeshBasicMaterial({
          map: textures.map,
        });
      } else {
        surfaceMat = new THREE.MeshStandardMaterial({
          map: textures.map,
          ...(textures.bumpMap
            ? { bumpMap: textures.bumpMap, bumpScale: 0.065 }
            : {}),
          ...(textures.roughnessMap
            ? { roughnessMap: textures.roughnessMap, roughness: 0.9 }
            : { roughness: body.category === 'terrestrial' ? 0.72 : 0.52 }),
          metalness: body.id === 'earth' ? 0.12 : 0.08,
        });
      }

      const surfaceMesh = new THREE.Mesh(sphereGeo, surfaceMat);
      surfaceMesh.userData = { bodyId: body.id };
      tiltGroup.add(surfaceMesh);
      interactableMeshes.push(surfaceMesh);

      let plasmaMesh: THREE.Mesh | undefined;
      if (body.id === 'sun') {
        if (textures.plasmaMap) {
          const plasmaGeo = new THREE.SphereGeometry(
            body.sceneRadius * 1.014,
            sphereSegments,
            sphereSegments
          );
          const plasmaMat = new THREE.MeshBasicMaterial({
            map: textures.plasmaMap,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
          tiltGroup.add(plasmaMesh);
        }

        // 3D Solar Magnetic Prominence Loops around active regions
        const loopAngles = [0.4, 1.85, 3.3, 4.9];
        loopAngles.forEach((ang, lIdx) => {
          const loopGeo = new THREE.TorusGeometry(
            body.sceneRadius * (0.16 + (lIdx % 2) * 0.05),
            0.09,
            10,
            28,
            Math.PI
          );
          const loopMat = new THREE.MeshBasicMaterial({
            color: lIdx % 2 === 0 ? '#ff9d2e' : '#ff5e1a',
            transparent: true,
            opacity: 0.68,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          const loopMesh = new THREE.Mesh(loopGeo, loopMat);
          const lat = (lIdx % 2 === 0 ? 1 : -1) * 0.28;
          const r = body.sceneRadius * 0.98;
          loopMesh.position.set(
            Math.cos(ang) * Math.cos(lat) * r,
            Math.sin(lat) * r,
            Math.sin(ang) * Math.cos(lat) * r
          );
          loopMesh.lookAt(0, 0, 0);
          loopMesh.rotateY(Math.PI / 2);
          sunProminenceGroup.add(loopMesh);
        });
        tiltGroup.add(sunProminenceGroup);

        const chromoGeo = new THREE.SphereGeometry(
          body.sceneRadius * 1.045,
          sphereSegments,
          sphereSegments
        );
        const chromoMat = new THREE.MeshBasicMaterial({
          color: '#ff9d2e',
          transparent: true,
          opacity: 0.34,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        tiltGroup.add(new THREE.Mesh(chromoGeo, chromoMat));

        const spriteMat = new THREE.SpriteMaterial({
          map: coronaTexture,
          color: '#ffbe55',
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        sunCoronaSprite = new THREE.Sprite(spriteMat);
        sunCoronaSprite.scale.set(
          body.sceneRadius * 4.4,
          body.sceneRadius * 4.4,
          1
        );
        rootGroup.add(sunCoronaSprite);
      }

      let cloudMesh: THREE.Mesh | undefined;
      if (textures.cloudsMap) {
        const cloudGeo = new THREE.SphereGeometry(
          body.sceneRadius * 1.018,
          sphereSegments,
          sphereSegments
        );
        const cloudMat = new THREE.MeshStandardMaterial({
          map: textures.cloudsMap,
          transparent: true,
          opacity: 0.8,
          blending: THREE.NormalBlending,
          depthWrite: false,
          roughness: 0.9,
        });
        cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        cloudMesh.userData = { bodyId: body.id };
        tiltGroup.add(cloudMesh);
      }

      let atmosphereMesh: THREE.Mesh | undefined;
      if (body.atmosphereColor && body.id !== 'sun') {
        const atmoGeo = new THREE.SphereGeometry(
          body.sceneRadius * 1.055,
          sphereSegments,
          sphereSegments
        );
        const atmoMat = new THREE.MeshBasicMaterial({
          color: body.atmosphereColor,
          transparent: true,
          opacity: body.atmosphereOpacity ?? 0.2,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
        tiltGroup.add(atmosphereMesh);
      }

      let ringMesh: THREE.Mesh | undefined;
      if (
        body.hasRings &&
        body.ringInnerRadius &&
        body.ringOuterRadius &&
        textures.ringMap
      ) {
        const ringGeo = new THREE.RingGeometry(
          body.ringInnerRadius,
          body.ringOuterRadius,
          isSoftwareGl ? 64 : 128
        );
        const ringMat = new THREE.MeshStandardMaterial({
          map: textures.ringMap,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: body.id === 'saturn' ? 0.95 : 0.48,
          roughness: 0.6,
          metalness: 0.1,
          depthWrite: false,
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.userData = { bodyId: body.id, isRing: true };
        tiltGroup.add(ringMesh);
      }

      // Build True 3D Cutaway Cross-Section Interior Group (Phase 5)
      // Note: When `interiorGroup.lookAt(camera.position)` runs, local +Z (phi = Math.PI * 0.5) points directly at the camera.
      // By starting the sphere arc at `cutPhiStart = Math.PI * 0.82` with `cutPhiLength = Math.PI * 1.36`,
      // the open 115-degree cutaway wedge is centered around `phi = Math.PI * 0.5` (+Z), facing the user's camera directly!
      const interiorGroup = new THREE.Group();
      interiorGroup.visible = false;
      rootGroup.add(interiorGroup);

      const interiorModel = CELESTIAL_INTERIOR_MODELS[body.id];
      const interiorLayers: InteriorLayerMeshEntry[] = [];
      const cutSegs = isSoftwareGl ? 24 : 40;
      const cutPhiStart = Math.PI * 0.82;
      const cutPhiLength = Math.PI * 1.36;

      // 3/4 Exterior Reference Shell wrapping the back and sides of the cutaway
      const extShellGeo = new THREE.SphereGeometry(
        body.sceneRadius * 1.005,
        cutSegs,
        cutSegs,
        cutPhiStart,
        cutPhiLength
      );
      const extShellMat = new THREE.MeshStandardMaterial({
        map: textures.map,
        side: THREE.FrontSide,
        roughness: 0.65,
      });
      const extShellMesh = new THREE.Mesh(extShellGeo, extShellMat);
      interiorGroup.add(extShellMesh);

      if (interiorModel) {
        interiorModel.layers.forEach((layer) => {
          const outerR = body.sceneRadius * layer.outerRadiusRatio;
          const innerR = body.sceneRadius * layer.innerRadiusRatio;
          const layerMeshes: THREE.Mesh[] = [];
          const layerMats: THREE.MeshStandardMaterial[] = [];

          const baseMat = new THREE.MeshStandardMaterial({
            color: layer.color,
            emissive: layer.emissiveColor ?? layer.color,
            emissiveIntensity: Math.max(0.52, layer.emissiveIntensity ?? 0.55),
            roughness: 0.42,
            metalness: 0.1,
            side: THREE.DoubleSide,
            transparent:
              layer.regionType === 'atmosphere' && layer.outerRadiusRatio > 1.02,
            opacity:
              layer.regionType === 'atmosphere' && layer.outerRadiusRatio > 1.02
                ? 0.46
                : 1.0,
          });
          layerMats.push(baseMat);

          if (layer.innerRadiusRatio === 0) {
            // Solid innermost core sphere that protrudes clearly in the center of the open cutaway wedge
            const coreGeo = new THREE.SphereGeometry(outerR, cutSegs, cutSegs);
            const coreMesh = new THREE.Mesh(coreGeo, baseMat);
            coreMesh.userData = {
              interiorLayerId: layer.id,
              bodyId: body.id,
            };
            interiorGroup.add(coreMesh);
            layerMeshes.push(coreMesh);
            interactableMeshes.push(coreMesh);
          } else {
            // Concentric 3/4 spherical shell
            const shellGeo = new THREE.SphereGeometry(
              outerR,
              cutSegs,
              cutSegs,
              cutPhiStart,
              cutPhiLength
            );
            const shellMesh = new THREE.Mesh(shellGeo, baseMat);
            shellMesh.userData = {
              interiorLayerId: layer.id,
              bodyId: body.id,
            };
            interiorGroup.add(shellMesh);
            layerMeshes.push(shellMesh);
            interactableMeshes.push(shellMesh);

            // Exposed Cross-Section Planar Faces on both sides of the cutaway wedge facing the camera
            const faceGeo = new THREE.RingGeometry(
              innerR,
              outerR,
              cutSegs,
              1,
              -Math.PI / 2,
              Math.PI
            );
            const faceA = new THREE.Mesh(faceGeo, baseMat);
            faceA.rotation.y = cutPhiStart - Math.PI;
            faceA.userData = {
              interiorLayerId: layer.id,
              bodyId: body.id,
            };
            interiorGroup.add(faceA);
            layerMeshes.push(faceA);
            interactableMeshes.push(faceA);

            const faceB = new THREE.Mesh(faceGeo, baseMat);
            faceB.rotation.y = cutPhiStart + cutPhiLength;
            faceB.userData = {
              interiorLayerId: layer.id,
              bodyId: body.id,
            };
            interiorGroup.add(faceB);
            layerMeshes.push(faceB);
            interactableMeshes.push(faceB);
          }

          interiorLayers.push({
            layer,
            meshes: layerMeshes,
            materials: layerMats,
          });
        });
      }

      const reticleGeo = new THREE.RingGeometry(
        body.sceneRadius * 1.32,
        body.sceneRadius * 1.38,
        48
      );
      const reticleMat = new THREE.MeshBasicMaterial({
        color: body.accentHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
      reticleMesh.rotation.x = Math.PI / 2;
      rootGroup.add(reticleMesh);

      // Orbiting 3D Moons with Dedicated Textures, Halo Glow, Orbit Lines, and Touch-Friendly Hit Areas
      const moons: MoonSceneNode[] = [];
      body.moons3D.forEach((m, idx) => {
        const pivot = new THREE.Group();
        const tiltAngle = (idx - 0.5) * 0.08;
        pivot.rotation.z = tiltAngle;
        rootGroup.add(pivot);

        const moonTex = createMoonTexture(m.textureType, m.id);
        const mGeo = new THREE.SphereGeometry(
          m.radius,
          moonSegments,
          moonSegments
        );
        const mMat = new THREE.MeshStandardMaterial({
          map: moonTex.map,
          bumpMap: moonTex.bumpMap,
          bumpScale: 0.038,
          roughness: 0.8,
          metalness: 0.06,
        });
        const mMesh = new THREE.Mesh(mGeo, mMat);
        mMesh.userData = { moonId: m.id, bodyId: body.id };
        pivot.add(mMesh);

        // 3D Selection Rim-Halo Sphere around the moon
        const haloGeo = new THREE.SphereGeometry(m.radius * 1.26, 20, 20);
        const haloMat = new THREE.MeshBasicMaterial({
          color: m.color,
          transparent: true,
          opacity: 0.0,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        mMesh.add(haloMesh);

        // Enlarged invisible hit-sphere for easy pointer & touch selection
        const hitRadius = Math.max(0.62, m.radius * 2.75);
        const hitGeo = new THREE.SphereGeometry(hitRadius, 12, 12);
        const hitMat = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.0,
          depthWrite: false,
        });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.userData = { moonId: m.id, bodyId: body.id };
        mMesh.add(hitMesh);
        interactableMeshes.push(hitMesh);
        interactableMeshes.push(mMesh);

        // Moon reticle ring
        const mRetGeo = new THREE.RingGeometry(
          m.radius * 1.5,
          m.radius * 1.72,
          32
        );
        const mRetMat = new THREE.MeshBasicMaterial({
          color: m.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mRetMesh = new THREE.Mesh(mRetGeo, mRetMat);
        mMesh.add(mRetMesh);

        // Visible Moon Orbit LineLoop around parent planet
        const mOrbitSegments = 72;
        const mOrbitPts: THREE.Vector3[] = [];
        for (let s = 0; s < mOrbitSegments; s++) {
          const ma = (s / mOrbitSegments) * Math.PI * 2;
          mOrbitPts.push(
            new THREE.Vector3(
              Math.cos(ma) * m.distance,
              0,
              Math.sin(ma) * m.distance
            )
          );
        }
        const mOrbitGeo = new THREE.BufferGeometry().setFromPoints(mOrbitPts);
        const mOrbitMat = new THREE.LineBasicMaterial({
          color: m.color,
          transparent: true,
          opacity: 0.32,
        });
        const mOrbitLine = new THREE.LineLoop(mOrbitGeo, mOrbitMat);
        pivot.add(mOrbitLine);

        const moonNode: MoonSceneNode = {
          info: m,
          indexOnPlanet: idx,
          pivot,
          mesh: mMesh,
          hitMesh,
          haloMesh,
          reticleMesh: mRetMesh,
          orbitLine: mOrbitLine,
          phase: idx * 2.1 + 0.6,
        };
        moons.push(moonNode);
        moonNodes.set(m.id, moonNode);
      });

      // Planet Orbital Trajectory LineLoop
      let orbitLine: THREE.LineLoop | undefined;
      if (body.orbitRadius > 0) {
        const segments = 180;
        const points: THREE.Vector3[] = [];
        const inclinationSin = Math.sin(body.orderIndex * 0.45) * 0.025;
        for (let i = 0; i < segments; i++) {
          const a = (i / segments) * Math.PI * 2;
          const ox = Math.cos(a) * body.orbitRadius;
          const oz = Math.sin(a) * body.orbitRadius;
          const oy = Math.sin(a * 1.5) * body.orbitRadius * inclinationSin;
          points.push(new THREE.Vector3(ox, oy, oz));
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMat = new THREE.LineBasicMaterial({
          color: body.accentHex,
          transparent: true,
          opacity: 0.24,
        });
        orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
        scene.add(orbitLine);
      }

      planetNodes.set(body.id, {
        data: body,
        rootGroup,
        tiltGroup,
        surfaceMesh,
        cloudMesh,
        plasmaMesh,
        atmosphereMesh,
        ringMesh,
        reticleMesh,
        orbitLine,
        interiorGroup,
        interiorLayers,
        moons,
      });
    }

    // Raycaster & Pointer Interaction (Prioritizes Interior Layers -> Moons -> Planets)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(-999, -999);
    let hoveredBodyId: CelestialId | null = null;
    let hoveredMoonId: MoonId | null = null;
    let hoveredInteriorLayerId: string | null = null;

    const updatePointerNdc = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
    };

    const resolvePrioritizedHit = (hits: THREE.Intersection[]) => {
      const st = stateRef.current;
      // 1. If exploring interior of selected planet, prioritize interior layer hits on that planet
      if (st.isExploringInterior && st.selectedPlanetId) {
        const layerHit = hits.find(
          (h) =>
            h.object.userData?.interiorLayerId &&
            h.object.userData?.bodyId === st.selectedPlanetId
        );
        if (layerHit) {
          return {
            interiorLayerId: layerHit.object.userData.interiorLayerId as string,
            moonId: undefined,
            bodyId: layerHit.object.userData.bodyId as CelestialId,
          };
        }
      }

      // 2. Always prioritize Moon hits over Planet/Ring hits so moons in front of or near a planet are effortlessly selectable
      const moonHit = hits.find((h) => Boolean(h.object.userData?.moonId));
      if (moonHit) {
        return {
          interiorLayerId: undefined,
          moonId: moonHit.object.userData.moonId as MoonId,
          bodyId: moonHit.object.userData.bodyId as CelestialId,
        };
      }

      // 3. Otherwise check planet surface hits
      const bodyHit = hits.find(
        (h) =>
          Boolean(h.object.userData?.bodyId) &&
          !h.object.userData?.interiorLayerId
      );
      if (bodyHit) {
        return {
          interiorLayerId: undefined,
          moonId: undefined,
          bodyId: bodyHit.object.userData.bodyId as CelestialId,
        };
      }

      return null;
    };

    const handlePointerDown = (e: PointerEvent) => {
      inspectOffsetRef.current.isDragging = true;
      inspectOffsetRef.current.downX = e.clientX;
      inspectOffsetRef.current.downY = e.clientY;
      inspectOffsetRef.current.movedDistance = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerNdc(e.clientX, e.clientY);

      if (inspectOffsetRef.current.isDragging) {
        const dx = e.clientX - inspectOffsetRef.current.downX;
        const dy = e.clientY - inspectOffsetRef.current.downY;
        inspectOffsetRef.current.downX = e.clientX;
        inspectOffsetRef.current.downY = e.clientY;
        inspectOffsetRef.current.movedDistance += Math.hypot(dx, dy);

        inspectOffsetRef.current.azimuth = Math.max(
          -1.8,
          Math.min(1.8, inspectOffsetRef.current.azimuth - dx * 0.0045)
        );
        inspectOffsetRef.current.elevation = Math.max(
          -0.9,
          Math.min(0.9, inspectOffsetRef.current.elevation + dy * 0.0035)
        );
      }

      if (e.pointerType === 'touch') return;

      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactableMeshes, false);
      const resolved = resolvePrioritizedHit(hits);
      if (resolved) {
        hoveredInteriorLayerId = resolved.interiorLayerId ?? null;
        hoveredMoonId = resolved.moonId ?? null;
        hoveredBodyId = resolved.bodyId ?? null;
        renderer.domElement.style.cursor = 'pointer';
        return;
      }

      hoveredInteriorLayerId = null;
      hoveredMoonId = null;
      hoveredBodyId = null;
      renderer.domElement.style.cursor = inspectOffsetRef.current.isDragging
        ? 'grabbing'
        : 'grab';
    };

    const handlePointerUp = (e: PointerEvent) => {
      const wasClick = inspectOffsetRef.current.movedDistance < 9;
      inspectOffsetRef.current.isDragging = false;
      renderer.domElement.style.cursor =
        hoveredBodyId || hoveredMoonId || hoveredInteriorLayerId
          ? 'pointer'
          : 'grab';

      if (wasClick) {
        updatePointerNdc(e.clientX, e.clientY);
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(interactableMeshes, false);
        const resolved = resolvePrioritizedHit(hits);
        if (resolved) {
          if (resolved.interiorLayerId) {
            stateRef.current.onSelectInteriorLayer(resolved.interiorLayerId);
            return;
          }
          if (resolved.moonId) {
            stateRef.current.onSelectMoon(resolved.moonId);
            return;
          }
          if (resolved.bodyId) {
            stateRef.current.onSelectPlanet(resolved.bodyId, true);
          }
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Continuous Animation Loop with Software-WebGL Pacing
    let disposed = false;
    let rafId = 0;
    let timeoutId = 0;
    let simTimeSec = 18.0;
    let lastWallTime = performance.now();
    let lastReportedSection: ScrollSectionId = 'overview-start';
    let lastTelemetryPush = 0;

    const currentCamPos = new THREE.Vector3(0, 88, 165);
    const currentCamTarget = new THREE.Vector3(0, -4, 0);
    const desiredCamPos = new THREE.Vector3();
    const desiredCamTarget = new THREE.Vector3();
    const projectedVec = new THREE.Vector3();
    const worldPosHelper = new THREE.Vector3();

    const afterDraw = (cb: () => void) => {
      if (
        !isSoftwareGl ||
        typeof WebGL2RenderingContext === 'undefined' ||
        !(gl instanceof WebGL2RenderingContext)
      ) {
        rafId = requestAnimationFrame(cb);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        if (!sync) {
          timeoutId = window.setTimeout(cb, 80);
          return;
        }
        const status = gl.clientWaitSync(sync, 0, 0);
        if (
          status === gl.ALREADY_SIGNALED ||
          status === gl.CONDITION_SATISFIED
        ) {
          gl.deleteSync(sync);
          timeoutId = window.setTimeout(cb, 80);
        } else {
          rafId = requestAnimationFrame(poll);
        }
      };
      rafId = requestAnimationFrame(poll);
    };

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min(0.08, (now - lastWallTime) / 1000);
      lastWallTime = now;

      const st = stateRef.current;
      const isRtl = st.lang === 'fa';
      const motionFactor = prefersReducedMotion ? 0.25 : 1.0;

      if (!st.isPaused) {
        simTimeSec += dt * st.orbitSpeedMultiplier * motionFactor;
      }

      starGroup.visible = st.showStarfield;
      if (!st.isPaused) {
        starGroup.rotation.y += dt * 0.004 * motionFactor;
        asteroidBelt.rotation.y +=
          dt * 0.012 * st.orbitSpeedMultiplier * motionFactor;
      }

      if (sunCoronaSprite) {
        sunCoronaSprite.visible =
          st.highQualityGlow &&
          !(st.isExploringInterior && st.selectedPlanetId === 'sun');
        const pulse = 1 + Math.sin(now * 0.0022) * 0.045;
        sunCoronaSprite.scale.set(7.6 * 4.4 * pulse, 7.6 * 4.4 * pulse, 1);
      }

      const scrollState = computeScrollCameraState(
        st.scrollProgress,
        simTimeSec,
        isRtl,
        camera.aspect
      );

      if (scrollState.activeSection !== lastReportedSection) {
        lastReportedSection = scrollState.activeSection;
        st.onActiveSectionChange?.(scrollState.activeSection);
      }

      // Update Planets, 3D Cutaway Interiors & Moons
      planetNodes.forEach((node, id) => {
        const worldPos = getPlanetWorldPosition(id, simTimeSec);
        node.rootGroup.position.set(worldPos.x, worldPos.y, worldPos.z);

        const isCutawayActive =
          st.isExploringInterior && st.selectedPlanetId === id;

        node.surfaceMesh.visible = !isCutawayActive;
        if (node.cloudMesh) {
          node.cloudMesh.visible = !isCutawayActive;
        }
        if (node.plasmaMesh) {
          node.plasmaMesh.visible = !isCutawayActive;
        }
        node.interiorGroup.visible = isCutawayActive;

        if (isCutawayActive) {
          // Orient the 3D cutaway wedge toward the camera so internal concentric shells are clearly exposed
          node.interiorGroup.lookAt(camera.position);

          node.interiorLayers.forEach((entry) => {
            const isLayerSelected =
              st.selectedInteriorLayerId === entry.layer.id;
            const isLayerHovered = hoveredInteriorLayerId === entry.layer.id;
            const baseEmissive = entry.layer.emissiveIntensity ?? 0.25;
            const targetEmissive = isLayerSelected
              ? Math.min(1.3, baseEmissive + 0.55)
              : isLayerHovered
                ? Math.min(1.1, baseEmissive + 0.35)
                : baseEmissive;
            entry.materials.forEach((m) => {
              m.emissiveIntensity +=
                (targetEmissive - m.emissiveIntensity) * 0.2;
            });
            const targetScale = isLayerSelected ? 1.028 : 1.0;
            entry.meshes.forEach((mesh) => {
              mesh.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.2
              );
            });
          });
        } else if (!st.isPaused) {
          node.surfaceMesh.rotation.y +=
            node.data.rotationSpeed *
            dt *
            Math.max(0.5, st.orbitSpeedMultiplier) *
            motionFactor;
          if (node.cloudMesh) {
            node.cloudMesh.rotation.y +=
              node.data.rotationSpeed *
              1.18 *
              dt *
              Math.max(0.5, st.orbitSpeedMultiplier) *
              motionFactor;
          }
          if (node.plasmaMesh) {
            node.plasmaMesh.rotation.y -=
              node.data.rotationSpeed *
              0.65 *
              dt *
              Math.max(0.5, st.orbitSpeedMultiplier) *
              motionFactor;
          }
        }

        const isPlanetFocused =
          st.selectedPlanetId === id ||
          scrollState.dominantPlanetId === id ||
          (st.activeTab === 'compare' && st.comparePlanetIds.includes(id));

        node.moons.forEach((mNode) => {
          const mAngle = mNode.phase + simTimeSec * mNode.info.speed;
          mNode.mesh.position.set(
            Math.cos(mAngle) * mNode.info.distance,
            0,
            Math.sin(mAngle) * mNode.info.distance
          );
          if (!st.isPaused) {
            mNode.mesh.rotation.y += dt * 0.55;
          }

          const isMoonHovered = hoveredMoonId === mNode.info.id;
          const isMoonSelected = st.selectedMoonId === mNode.info.id;
          const isAnotherMoonSelected =
            st.selectedMoonId !== null && !isMoonSelected;

          mNode.orbitLine.visible = st.showOrbits && !isCutawayActive;
          const mLineMat = mNode.orbitLine.material as THREE.LineBasicMaterial;
          const targetMoonOrbitOp =
            isMoonHovered || isMoonSelected
              ? 0.9
              : isAnotherMoonSelected
                ? 0.06
                : isPlanetFocused
                  ? 0.45
                  : 0.14;
          mLineMat.opacity += (targetMoonOrbitOp - mLineMat.opacity) * 0.15;

          // Unmistakable 3D Selection Rim-Halo & Pulsing Reticle on Selected Moon
          const haloMat = mNode.haloMesh.material as THREE.MeshBasicMaterial;
          const targetHaloOp = isMoonSelected
            ? 0.44 + Math.sin(now * 0.006) * 0.12
            : isMoonHovered
              ? 0.32
              : 0.0;
          haloMat.opacity += (targetHaloOp - haloMat.opacity) * 0.2;

          const mRetMat = mNode.reticleMesh.material as THREE.MeshBasicMaterial;
          const targetMRetOp = isMoonHovered
            ? 0.92
            : isMoonSelected
              ? 0.88
              : isAnotherMoonSelected
                ? 0.08
                : isPlanetFocused
                  ? 0.28
                  : 0.0;
          mRetMat.opacity += (targetMRetOp - mRetMat.opacity) * 0.18;
          mNode.reticleMesh.lookAt(camera.position);
        });

        const isHovered = hoveredBodyId === id && !hoveredMoonId;

        if (node.orbitLine) {
          node.orbitLine.visible = st.showOrbits;
          const lineMat = node.orbitLine.material as THREE.LineBasicMaterial;
          const targetLineOpacity = isHovered
            ? 0.78
            : isPlanetFocused
              ? 0.55
              : 0.2;
          lineMat.opacity += (targetLineOpacity - lineMat.opacity) * 0.12;
        }

        const retMat = node.reticleMesh.material as THREE.MeshBasicMaterial;
        const targetRetOpacity =
          st.selectedMoonId || isCutawayActive
            ? 0.0
            : isHovered
              ? 0.65
              : isPlanetFocused
                ? 0.32
                : 0.0;
        retMat.opacity += (targetRetOpacity - retMat.opacity) * 0.15;
        node.reticleMesh.lookAt(camera.position);

        if (node.atmosphereMesh) {
          node.atmosphereMesh.visible = st.highQualityGlow && !isCutawayActive;
        }
      });

      const isMobilePortrait = camera.aspect < 0.95;

      // Compute Desired Camera Position & Target
      if (st.activeTab === 'compare') {
        desiredCamPos.set(
          0,
          isMobilePortrait ? 95 : 75,
          isMobilePortrait ? 175 : 138
        );
        desiredCamTarget.set(0, -8, 0);
      } else if (st.selectedMoonId) {
        // Moon Focus Camera Mode: Smoothly track the selected 3D moon in world space!
        const moonCam = getMoonCameraState(
          st.selectedMoonId,
          simTimeSec,
          isRtl,
          camera.aspect,
          st.isDossierOpen
        );
        desiredCamPos.set(
          moonCam.position.x,
          moonCam.position.y,
          moonCam.position.z
        );
        desiredCamTarget.set(
          moonCam.target.x,
          moonCam.target.y,
          moonCam.target.z
        );

        // Allow subtle user orbital inspection around the selected moon
        if (
          Math.abs(inspectOffsetRef.current.azimuth) > 0.001 ||
          Math.abs(inspectOffsetRef.current.elevation) > 0.001
        ) {
          const offsetX = desiredCamPos.x - desiredCamTarget.x;
          const offsetZ = desiredCamPos.z - desiredCamTarget.z;
          const radius = Math.hypot(offsetX, offsetZ);
          const baseAngle = Math.atan2(offsetZ, offsetX);
          const newAngle = baseAngle + inspectOffsetRef.current.azimuth;
          desiredCamPos.x = desiredCamTarget.x + Math.cos(newAngle) * radius;
          desiredCamPos.z = desiredCamTarget.z + Math.sin(newAngle) * radius;
          desiredCamPos.y += inspectOffsetRef.current.elevation * radius * 0.4;
        }
      } else if (
        (st.isDossierOpen || st.isExploringInterior) &&
        st.selectedPlanetId
      ) {
        const body = getCelestialBody(st.selectedPlanetId);
        const pPos = getPlanetWorldPosition(st.selectedPlanetId, simTimeSec);
        const dist =
          body.cameraDistance * (isMobilePortrait ? 1.56 : 1.48);
        const distFromSun = Math.max(0.001, Math.hypot(pPos.x, pPos.z));
        const rx = pPos.x / distFromSun;
        const rz = pPos.z / distFromSun;
        const tx = -rz;
        const tz = rx;

        const baseCamX =
          st.selectedPlanetId === 'sun'
            ? 0
            : pPos.x + (rx * -0.56 + tx * 0.83) * dist;
        const baseCamZ =
          st.selectedPlanetId === 'sun'
            ? dist
            : pPos.z + (rz * -0.56 + tz * 0.83) * dist;

        desiredCamPos.set(
          baseCamX,
          pPos.y + body.cameraElevation * (st.isExploringInterior ? 0.72 : 1.08),
          baseCamZ
        );

        if (isMobilePortrait) {
          desiredCamTarget.set(
            pPos.x,
            pPos.y - body.sceneRadius * 1.05,
            pPos.z
          );
        } else if (st.isDossierOpen) {
          const forwardX = pPos.x - baseCamX;
          const forwardZ = pPos.z - baseCamZ;
          const forwardLen = Math.max(0.001, Math.hypot(forwardX, forwardZ));
          const rightX = -forwardZ / forwardLen;
          const rightZ = forwardX / forwardLen;
          const drawerShift =
            (isRtl ? -1 : 1) * Math.abs(body.cameraSideOffset) * 0.24;
          desiredCamTarget.set(
            pPos.x + rightX * drawerShift,
            pPos.y,
            pPos.z + rightZ * drawerShift
          );
        } else {
          desiredCamTarget.set(pPos.x, pPos.y, pPos.z);
        }
      } else {
        desiredCamPos.set(
          scrollState.position.x,
          scrollState.position.y,
          scrollState.position.z
        );
        desiredCamTarget.set(
          scrollState.target.x,
          scrollState.target.y,
          scrollState.target.z
        );

        if (
          Math.abs(inspectOffsetRef.current.azimuth) > 0.001 ||
          Math.abs(inspectOffsetRef.current.elevation) > 0.001
        ) {
          const offsetX = desiredCamPos.x - desiredCamTarget.x;
          const offsetZ = desiredCamPos.z - desiredCamTarget.z;
          const radius = Math.hypot(offsetX, offsetZ);
          const baseAngle = Math.atan2(offsetZ, offsetX);
          const newAngle = baseAngle + inspectOffsetRef.current.azimuth;
          desiredCamPos.x = desiredCamTarget.x + Math.cos(newAngle) * radius;
          desiredCamPos.z = desiredCamTarget.z + Math.sin(newAngle) * radius;
          desiredCamPos.y += inspectOffsetRef.current.elevation * radius * 0.45;
        }
      }

      const dampFactor = isSoftwareGl ? 0.58 : 1 - Math.exp(-6.5 * dt);
      currentCamPos.lerp(desiredCamPos, dampFactor);
      currentCamTarget.lerp(desiredCamTarget, dampFactor);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentCamTarget);

      const targetFov = st.selectedMoonId ? 36 : scrollState.fov;
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov += (targetFov - camera.fov) * dampFactor;
        camera.updateProjectionMatrix();
      }

      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      // Project Selected Moon 3D position for the persistent floating 3D Moon Beacon Tag
      if (st.selectedMoonId) {
        const selMoonNode = moonNodes.get(st.selectedMoonId);
        if (selMoonNode) {
          selMoonNode.mesh.getWorldPosition(worldPosHelper);
          projectedVec.copy(worldPosHelper);
          projectedVec.y += selMoonNode.info.radius * 1.65;
          projectedVec.project(camera);
          const sx = (projectedVec.x * 0.5 + 0.5) * w;
          const sy = (-projectedVec.y * 0.5 + 0.5) * h;
          setSelectedMoonMarker({
            moonId: st.selectedMoonId,
            x: sx,
            y: sy,
            visible: projectedVec.z < 1,
          });
        }
      } else {
        setSelectedMoonMarker((prev) => (prev ? null : prev));
      }

      // Project hovered planet, moon, or interior layer to 2D screen coordinates
      if (
        (hoveredInteriorLayerId || hoveredMoonId || hoveredBodyId) &&
        st.showLabels
      ) {
        if (hoveredInteriorLayerId && hoveredBodyId) {
          const node = planetNodes.get(hoveredBodyId);
          const model = CELESTIAL_INTERIOR_MODELS[hoveredBodyId];
          const layerObj = model?.layers.find(
            (l) => l.id === hoveredInteriorLayerId
          );
          if (node && layerObj) {
            projectedVec.copy(node.rootGroup.position);
            projectedVec.y +=
              node.data.sceneRadius * layerObj.outerRadiusRatio * 0.85;
            projectedVec.project(camera);
            const sx = (projectedVec.x * 0.5 + 0.5) * w;
            const sy = (-projectedVec.y * 0.5 + 0.5) * h;
            if (projectedVec.z < 1) {
              setHoveredInfo({
                kind: 'interior-layer',
                planetId: hoveredBodyId,
                interiorLayer: layerObj,
                x: sx,
                y: sy,
              });
            }
          }
        } else if (hoveredMoonId && hoveredBodyId) {
          const mNode = moonNodes.get(hoveredMoonId);
          if (mNode) {
            mNode.mesh.getWorldPosition(worldPosHelper);
            projectedVec.copy(worldPosHelper);
            projectedVec.y += mNode.info.radius * 1.8;
            projectedVec.project(camera);
            const sx = (projectedVec.x * 0.5 + 0.5) * w;
            const sy = (-projectedVec.y * 0.5 + 0.5) * h;
            if (projectedVec.z < 1) {
              setHoveredInfo({
                kind: 'moon',
                planetId: hoveredBodyId,
                moonId: hoveredMoonId,
                x: sx,
                y: sy,
              });
            }
          }
        } else if (hoveredBodyId) {
          const node = planetNodes.get(hoveredBodyId);
          if (node) {
            projectedVec.copy(node.rootGroup.position);
            projectedVec.y += node.data.sceneRadius * 1.35;
            projectedVec.project(camera);
            const sx = (projectedVec.x * 0.5 + 0.5) * w;
            const sy = (-projectedVec.y * 0.5 + 0.5) * h;
            if (projectedVec.z < 1) {
              setHoveredInfo({
                kind: 'planet',
                planetId: hoveredBodyId,
                x: sx,
                y: sy,
              });
            }
          }
        }
      } else {
        setHoveredInfo((prev) => (prev ? null : prev));
      }

      if (now - lastTelemetryPush > 220) {
        lastTelemetryPush = now;
        const targetBodyId =
          st.selectedPlanetId ?? scrollState.dominantPlanetId ?? 'sun';
        const targetWorld = st.selectedMoonId
          ? getMoonWorldPosition(st.selectedMoonId, simTimeSec)
          : getPlanetWorldPosition(targetBodyId, simTimeSec);
        const dist = distanceVec3(
          {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
          },
          targetWorld
        );
        setHudTelemetry({
          activeSection: scrollState.activeSection,
          camDistance: Math.round(dist * 10) / 10,
        });
      }

      renderer.render(scene, camera);
      afterDraw(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      domElem.removeEventListener('pointerdown', handlePointerDown);
      domElem.removeEventListener('webglcontextlost', handleContextLost);
      domElem.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const hoveredBody = hoveredInfo
    ? getCelestialBody(hoveredInfo.planetId)
    : null;
  const hoveredMoon =
    hoveredInfo?.kind === 'moon' && hoveredInfo.moonId
      ? getMoonById(hoveredInfo.moonId)
      : null;

  const activeMoonObj = selectedMoonId ? getMoonById(selectedMoonId) : null;
  const activeMoonParent = activeMoonObj
    ? getCelestialBody(activeMoonObj.parentPlanetId)
    : null;

  const activeInteriorModel =
    isExploringInterior && selectedPlanetId
      ? CELESTIAL_INTERIOR_MODELS[selectedPlanetId]
      : null;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden select-none"
      data-testid="solar-system-canvas-wrapper"
      data-active-section={hudTelemetry.activeSection}
      data-focused-planet={selectedPlanetId ?? 'none'}
      data-focused-moon={selectedMoonId ?? 'none'}
      data-interior-mode={String(isExploringInterior)}
      data-selected-interior-layer={selectedInteriorLayerId ?? 'none'}
      data-hovered-planet={hoveredInfo?.planetId ?? 'none'}
      data-hovered-moon={hoveredInfo?.moonId ?? 'none'}
      data-camera-distance={hudTelemetry.camDistance}
      data-sim-paused={String(isPaused)}
    >
      {/* Persistent Three.js WebGL Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Fallback Banner if WebGL is Unavailable */}
      {webglError && (
        <div className="fixed inset-x-4 top-20 z-30 max-w-md mx-auto bg-[#171b26]/95 border border-[#f8c270]/50 rounded-xl p-4 text-xs text-[#e0e2f1] shadow-2xl">
          <div className="font-bold text-[#f8c270] mb-1">
            {lang === 'fa'
              ? 'حالت آموزشی بدون شتاب‌دهنده گرافیکی WebGL'
              : 'Educational Mode (WebGL Hardware Unavailable)'}
          </div>
          <p className="text-[#c2c6d4]">
            {lang === 'fa'
              ? 'مرورگر شما در حال حاضر از WebGL سه‌بعدی پشتیبانی نمی‌کند، اما تمام اطلاعات علمی سیارات، قمرها، جدول مقایسه و آزمون کیهانی در دسترس هستند.'
              : '3D WebGL rendering is paused or unsupported on this device, but all planetary dossiers, moon data, comparisons, and quizzes remain fully functional.'}
          </p>
        </div>
      )}

      {/* Subtle Radial Vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(11,14,24,0) 42%, rgba(7,10,18,0.68) 100%)',
        }}
      />

      {/* Persistent 3D Selected Moon Floating Beacon Tag (Tracks the selected moon in real time) */}
      {activeMoonObj &&
        activeMoonParent &&
        selectedMoonMarker &&
        selectedMoonMarker.visible && (
          <div
            data-testid={`moon-3d-beacon-${activeMoonObj.id}`}
            className="pointer-events-none fixed z-20 -translate-x-1/2 -translate-y-full pb-3 transition-transform duration-75"
            style={{
              left: `${Math.max(90, Math.min(window.innerWidth - 90, selectedMoonMarker.x))}px`,
              top: `${Math.max(76, Math.min(window.innerHeight - 60, selectedMoonMarker.y))}px`,
            }}
          >
            <div className="bg-[#0b0e18]/94 border-2 border-[#65d9ff] px-3 py-1.5 rounded-xl shadow-[0_0_25px_rgba(101,217,255,0.45)] flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: activeMoonObj.color }}
              />
              <div>
                <div className="text-xs font-black text-[#e0e2f1] flex items-center gap-1.5">
                  <span>{tText(activeMoonObj.name, lang)}</span>
                  <span className="font-mono-tech text-[10px] text-[#65d9ff]">
                    {tText(activeMoonObj.diameterString, lang)}
                  </span>
                </div>
                <div className="text-[10px] text-[#f8c270] font-bold">
                  {lang === 'fa'
                    ? `قمر در حال گردش به دور ${tText(activeMoonParent.name, lang)}`
                    : `Orbiting Moon of ${tText(activeMoonParent.name, lang)}`}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Floating 3D Cutaway Layer Quick-Selector Pins (Visible in open 3D viewport when Interior Mode is active) */}
      {activeInteriorModel && selectedPlanetId && (
        <div
          data-testid="viewport-interior-layer-bar"
          className="pointer-events-auto fixed bottom-4 left-3 right-3 md:left-[596px] md:right-64 md:bottom-6 z-30 max-w-xl bg-[#0b0e18]/94 border border-[#f8c270]/55 rounded-2xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-[#f8c270] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">layers</span>
              <span>
                {lang === 'fa'
                  ? 'برش سه‌بعدی فعال — روی لایه در مدل ۳بعدی یا دکمه‌های زیر کلیک کنید:'
                  : '3D Cutaway Active — Click a layer in 3D or select below:'}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeInteriorModel.layers.map((layer) => {
              const isSelected = selectedInteriorLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  data-testid={`viewport-layer-pin-${layer.id}`}
                  onClick={() => onSelectInteriorLayer(layer.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#f8c270] text-[#1f1300] border-[#f8c270] shadow-[0_0_15px_rgba(248,194,112,0.4)]'
                      : 'bg-[#171b26] text-[#e0e2f1] border-[#424752]/50 hover:border-[#f8c270]/60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/30"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span>{tText(layer.name, lang)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contextual 3D Raycast Hover Label (Planet, Moon, or Interior Cutaway Layer) */}
      {hoveredBody && hoveredInfo && showLabels && (
        <div
          className="pointer-events-none fixed z-30 -translate-x-1/2 -translate-y-full pb-3 transition-transform duration-75"
          style={{
            left: `${Math.max(80, Math.min(window.innerWidth - 80, hoveredInfo.x))}px`,
            top: `${Math.max(70, Math.min(window.innerHeight - 40, hoveredInfo.y))}px`,
          }}
        >
          <div className="bg-[#0b0e18]/92 border border-[#65d9ff]/45 px-3.5 py-2 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.75)] flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
              style={{
                backgroundColor:
                  hoveredInfo.kind === 'interior-layer' &&
                  hoveredInfo.interiorLayer
                    ? hoveredInfo.interiorLayer.color
                    : hoveredMoon
                      ? hoveredMoon.color
                      : hoveredBody.accentHex,
              }}
            />
            <div>
              <div className="text-xs font-bold text-[#e0e2f1] flex items-center gap-2">
                <span>
                  {hoveredInfo.kind === 'interior-layer' &&
                  hoveredInfo.interiorLayer
                    ? tText(hoveredInfo.interiorLayer.name, lang)
                    : hoveredMoon
                      ? tText(hoveredMoon.name, lang)
                      : tText(hoveredBody.name, lang)}
                </span>
                <span className="font-mono-tech text-[10px] text-[#65d9ff]">
                  {hoveredInfo.kind === 'interior-layer' &&
                  hoveredInfo.interiorLayer
                    ? tText(hoveredInfo.interiorLayer.depthOrThickness, lang)
                    : hoveredMoon
                      ? tText(hoveredMoon.diameterString, lang)
                      : hoveredBody.auString}
                </span>
              </div>
              <div className="text-[10px] text-[#c2c6d4] opacity-80">
                {hoveredInfo.kind === 'interior-layer'
                  ? lang === 'fa'
                    ? 'کلیک برای بررسی ترکیب و دمای این لایه درونی'
                    : 'Click to inspect layer composition & temperature'
                  : hoveredMoon
                    ? lang === 'fa'
                      ? `قمر ${tText(hoveredBody.name, lang)} • کلیک برای فوکوس دوربین`
                      : `Moon of ${tText(hoveredBody.name, lang)} • Click to focus camera`
                    : lang === 'fa'
                      ? 'کلیک برای بررسی پرونده علمی سیاره'
                      : 'Click to inspect planetary dossier'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
