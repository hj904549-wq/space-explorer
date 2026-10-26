import {
  CELESTIAL_BODIES,
  CelestialBodyData,
  CelestialId,
  Language,
  MoonId,
  MoonInfo,
  SCROLL_SECTIONS,
  ScrollSectionId,
} from '../data/solarSystemData.ts';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CameraWaypointState {
  position: Vec3;
  target: Vec3;
  fov: number;
  activeSection: ScrollSectionId;
  activeIndex: number;
  sectionProgress: number; // 0..1 within the transition between index and index+1
  cardVisibility: number; // 0..1 synchronized reveal factor for the active section card
  dominantPlanetId: CelestialId | null;
}

const BODY_MAP = new Map<CelestialId, CelestialBodyData>(
  CELESTIAL_BODIES.map((b) => [b.id, b])
);

const MOON_MAP = new Map<MoonId, { moon: MoonInfo; indexOnPlanet: number }>();
CELESTIAL_BODIES.forEach((b) => {
  b.moons3D.forEach((m, idx) => {
    MOON_MAP.set(m.id, { moon: m, indexOnPlanet: idx });
  });
});

export function getCelestialBody(id: CelestialId): CelestialBodyData {
  const found = BODY_MAP.get(id);
  if (!found) {
    throw new Error(`Unknown celestial body id: ${id}`);
  }
  return found;
}

export function getMoonById(id: MoonId): MoonInfo {
  const found = MOON_MAP.get(id);
  if (!found) {
    throw new Error(`Unknown moon id: ${id}`);
  }
  return found.moon;
}

/**
 * Pure function that computes a celestial body's 3D world position at a given simulation time (in seconds).
 * Orbits lie primarily in the XZ plane with a subtle orbital inclination for 3D depth.
 */
export function getPlanetWorldPosition(
  id: CelestialId,
  simulationTimeSec: number
): Vec3 & { angle: number } {
  const body = getCelestialBody(id);
  if (id === 'sun' || body.orbitRadius === 0) {
    return { x: 0, y: 0, z: 0, angle: 0 };
  }

  const angle = body.initialAngle + simulationTimeSec * body.orbitSpeed;
  const inclinationSin = Math.sin(body.orderIndex * 0.45) * 0.025;
  const x = Math.cos(angle) * body.orbitRadius;
  const z = Math.sin(angle) * body.orbitRadius;
  const y = Math.sin(angle * 1.5) * body.orbitRadius * inclinationSin;

  return { x, y, z, angle };
}

/**
 * Pure function that computes a 3D moon's exact world position around its host planet at `simulationTimeSec`.
 */
export function getMoonWorldPosition(
  moonId: MoonId,
  simulationTimeSec: number
): Vec3 & { angle: number; parentPosition: Vec3 } {
  const entry = MOON_MAP.get(moonId);
  if (!entry) {
    throw new Error(`Unknown moon id: ${moonId}`);
  }
  const { moon, indexOnPlanet } = entry;
  const parentPos = getPlanetWorldPosition(
    moon.parentPlanetId,
    simulationTimeSec
  );
  const phase = indexOnPlanet * 2.1 + 0.6;
  const angle = phase + simulationTimeSec * moon.speed;
  const tilt = (indexOnPlanet - 0.5) * 0.08;

  // Apply the exact Z-axis tilt rotation used by `pivot.rotation.z = tilt` in Three.js
  const rawX = Math.cos(angle) * moon.distance;
  const rawZ = Math.sin(angle) * moon.distance;
  const localX = rawX * Math.cos(tilt);
  const localY = rawX * Math.sin(tilt);
  const localZ = rawZ;

  return {
    x: parentPos.x + localX,
    y: parentPos.y + localY,
    z: parentPos.z + localZ,
    angle,
    parentPosition: { x: parentPos.x, y: parentPos.y, z: parentPos.z },
  };
}

/**
 * Computes the continuous camera position and target for a focused 3D moon.
 * Positions the camera on the moon's outer radial-tangential side relative to its host planet so:
 * 1. The camera never collides with or gets occluded by the host planet.
 * 2. The selected moon is clearly framed in the open viewport area (accounting for desktop side drawer or mobile bottom sheet).
 * 3. The parent planet remains visible in the background context.
 */
export function getMoonCameraState(
  moonId: MoonId,
  simulationTimeSec: number,
  isRtl: boolean = true,
  viewportAspect: number = 1.6,
  isDossierOpen: boolean = true
): { position: Vec3; target: Vec3; fov: number } {
  const isMobilePortrait = viewportAspect < 0.95;
  const moonInfo = getMoonById(moonId);
  const mWorld = getMoonWorldPosition(moonId, simulationTimeSec);

  const dirFromPlanetX = mWorld.x - mWorld.parentPosition.x;
  const dirFromPlanetZ = mWorld.z - mWorld.parentPosition.z;
  const dirLen = Math.max(0.001, Math.hypot(dirFromPlanetX, dirFromPlanetZ));
  const ux = dirFromPlanetX / dirLen;
  const uz = dirFromPlanetZ / dirLen;
  const tx = -uz;
  const tz = ux;

  // Frame the entire moon sphere with breathing room, keeping its selection halo and parent planet context visible
  const moonCamDist = Math.max(
    2.45,
    moonInfo.radius * (isMobilePortrait ? 9.5 : 8.2)
  );
  const baseCamX = mWorld.x + (ux * 0.68 + tx * 0.73) * moonCamDist;
  const baseCamY = mWorld.y + moonInfo.radius * 1.45;
  const baseCamZ = mWorld.z + (uz * 0.68 + tz * 0.73) * moonCamDist;

  if (isMobilePortrait) {
    return {
      position: { x: baseCamX, y: baseCamY, z: baseCamZ },
      target: {
        x: mWorld.x,
        y: mWorld.y - moonCamDist * 0.22,
        z: mWorld.z,
      },
      fov: 42,
    };
  }

  if (!isDossierOpen) {
    return {
      position: { x: baseCamX, y: baseCamY, z: baseCamZ },
      target: { x: mWorld.x, y: mWorld.y, z: mWorld.z },
      fov: 38,
    };
  }

  // When Dossier Drawer is open on desktop (left side in RTL, right side in LTR), shift lookAt gently toward the drawer
  // so the 3D moon sits squarely in the open stage between the Dossier Drawer and the right-hand SolarRail
  const forwardX = mWorld.x - baseCamX;
  const forwardZ = mWorld.z - baseCamZ;
  const forwardLen = Math.max(0.001, Math.hypot(forwardX, forwardZ));
  const rightX = -forwardZ / forwardLen;
  const rightZ = forwardX / forwardLen;
  const shift = (isRtl ? -1 : 1) * moonCamDist * 0.12;

  return {
    position: { x: baseCamX, y: baseCamY, z: baseCamZ },
    target: {
      x: mWorld.x + rightX * shift,
      y: mWorld.y - moonInfo.radius * 0.05,
      z: mWorld.z + rightZ * shift,
    },
    fov: 38,
  };
}

/**
 * Smoothstep easing function for cinematic camera transitions between sections.
 */
export function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Linear interpolation between two 3D vectors.
 */
export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

/**
 * Computes Euclidean distance between two 3D points.
 */
export function distanceVec3(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Computes the ideal camera position and lookAt target for any single scroll section at time `simulationTimeSec`.
 * Tailors the viewing angle per celestial body (e.g., Saturn ring elevation, Earth day/night terminator, Jupiter Galilean moon plane)
 * and guarantees the planet sits in the unobstructed stage opposite the info card and away from the SolarRail.
 */
export function getWaypointForSection(
  sectionId: ScrollSectionId,
  simulationTimeSec: number,
  isRtl: boolean = true,
  viewportAspect: number = 1.6
): { position: Vec3; target: Vec3; fov: number } {
  const isMobilePortrait = viewportAspect < 0.95;

  if (sectionId === 'overview-start') {
    return {
      position: {
        x: isMobilePortrait ? 0 : -18,
        y: isMobilePortrait ? 105 : 82,
        z: isMobilePortrait ? 195 : 158,
      },
      target: {
        x: isMobilePortrait ? 0 : 8,
        y: isMobilePortrait ? -12 : -4,
        z: 0,
      },
      fov: isMobilePortrait ? 52 : 45,
    };
  }

  if (sectionId === 'overview-end') {
    return {
      position: {
        x: isMobilePortrait ? -55 : -85,
        y: isMobilePortrait ? 125 : 108,
        z: isMobilePortrait ? 210 : 180,
      },
      target: { x: 0, y: isMobilePortrait ? -10 : 0, z: 0 },
      fov: isMobilePortrait ? 52 : 48,
    };
  }

  const body = getCelestialBody(sectionId);
  const pos = getPlanetWorldPosition(sectionId, simulationTimeSec);

  // In RTL: layoutAlignment 'right' (justify-start) places the card on the RIGHT (next to SolarRail),
  // so the planet should sit on the LEFT half of the screen (target shifted right -> +0.68).
  // layoutAlignment 'left' (justify-end) places the card on the LEFT, while SolarRail is on the far RIGHT,
  // so the planet should sit in the open CENTER-RIGHT stage (target shifted slightly left -> -0.28).
  const cardIsOnRight = isRtl
    ? body.layoutAlignment === 'right'
    : body.layoutAlignment === 'left';
  const targetShiftFactor = cardIsOnRight ? 0.68 : -0.28;

  if (sectionId === 'sun') {
    if (isMobilePortrait) {
      const sunCamDist = body.cameraDistance * 1.52;
      return {
        position: {
          x: 0,
          y: body.cameraElevation * 0.78,
          z: sunCamDist,
        },
        target: {
          x: 0,
          y: -sunCamDist * 0.22,
          z: 0,
        },
        fov: 46,
      };
    }

    const shiftMag = Math.abs(body.cameraSideOffset) * targetShiftFactor;
    return {
      position: {
        x: shiftMag * 0.2,
        y: body.cameraElevation * 1.05,
        z: body.cameraDistance * 1.25,
      },
      target: {
        x: shiftMag,
        y: -0.2,
        z: 0,
      },
      fov: 42,
    };
  }

  // Unit radial vector from Sun (origin) to the planet
  const distFromSun = Math.max(0.001, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
  const rx = pos.x / distFromSun;
  const rz = pos.z / distFromSun;

  // Tangent vector in the orbital plane
  const tx = -rz;
  const tz = rx;

  // Planet-specific camera angle adjustments for maximum scientific & visual drama
  let outwardFactor = -0.56;
  let tangentFactor = 0.83;
  let elevationMultiplier = isMobilePortrait ? 0.78 : 1.15;
  let distanceMultiplier = isMobilePortrait ? 1.58 : 1.42;

  if (sectionId === 'earth') {
    // Crisp day/night terminator + sunlit ocean specular glint + visible lunar orbit
    outwardFactor = -0.62;
    tangentFactor = 0.78;
    elevationMultiplier = isMobilePortrait ? 0.75 : 1.08;
    distanceMultiplier = isMobilePortrait ? 1.55 : 1.38;
  } else if (sectionId === 'jupiter') {
    // Slightly wider & elevated framing so Jupiter + all 4 orbiting Galilean moons are in clear view
    outwardFactor = -0.52;
    tangentFactor = 0.85;
    elevationMultiplier = isMobilePortrait ? 0.85 : 1.22;
    distanceMultiplier = isMobilePortrait ? 1.6 : 1.45;
  } else if (sectionId === 'saturn') {
    // High ring-plane tilt to showcase the A/B/C rings and Cassini Division
    outwardFactor = -0.5;
    tangentFactor = 0.86;
    elevationMultiplier = isMobilePortrait ? 0.95 : 1.38;
    distanceMultiplier = isMobilePortrait ? 1.62 : 1.46;
  } else if (sectionId === 'uranus') {
    outwardFactor = -0.48;
    tangentFactor = 0.88;
    elevationMultiplier = isMobilePortrait ? 0.88 : 1.25;
  }

  const camDist = body.cameraDistance * distanceMultiplier;
  const camX = pos.x + (rx * outwardFactor + tx * tangentFactor) * camDist;
  const camY = pos.y + body.cameraElevation * elevationMultiplier;
  const camZ = pos.z + (rz * outwardFactor + tz * tangentFactor) * camDist;

  if (isMobilePortrait) {
    // On mobile portrait, center horizontally and shift target downward so planet sits in the upper viewport above the card
    return {
      position: { x: camX, y: camY, z: camZ },
      target: {
        x: pos.x,
        y: pos.y - camDist * 0.22,
        z: pos.z,
      },
      fov: 43,
    };
  }

  const forwardX = pos.x - camX;
  const forwardZ = pos.z - camZ;
  const forwardLen = Math.max(0.001, Math.hypot(forwardX, forwardZ));
  const rightX = -forwardZ / forwardLen;
  const rightZ = forwardX / forwardLen;

  const shiftMagnitude = Math.abs(body.cameraSideOffset) * targetShiftFactor;

  return {
    position: { x: camX, y: camY, z: camZ },
    target: {
      x: pos.x + rightX * shiftMagnitude,
      y: pos.y - body.sceneRadius * 0.05,
      z: pos.z + rightZ * shiftMagnitude,
    },
    fov: 39,
  };
}

/**
 * Pure function mapping normalized page scroll progress `[0, 1]` to a continuous 3D camera state
 * across all 11 `SCROLL_SECTIONS`.
 * Synchronizes `activeSection` and `cardVisibility` with the start of each camera transition (`rawLocalT >= 0.25`)
 * so the incoming planet's card and camera move together without stale-card lag.
 */
export function computeScrollCameraState(
  scrollProgress: number,
  simulationTimeSec: number,
  isRtl: boolean = true,
  viewportAspect: number = 1.6
): CameraWaypointState {
  const clamped = Math.max(
    0,
    Math.min(1, Number.isFinite(scrollProgress) ? scrollProgress : 0)
  );
  const totalIntervals = SCROLL_SECTIONS.length - 1;
  const scaled = clamped * totalIntervals;
  const indexA = Math.min(totalIntervals - 1, Math.floor(scaled));
  const indexB = Math.min(totalIntervals, indexA + 1);
  const rawLocalT = scaled - indexA;
  const easedT = smoothstep(rawLocalT);

  const sectionA = SCROLL_SECTIONS[indexA];
  const sectionB = SCROLL_SECTIONS[indexB];

  const waypointA = getWaypointForSection(
    sectionA,
    simulationTimeSec,
    isRtl,
    viewportAspect
  );
  const waypointB = getWaypointForSection(
    sectionB,
    simulationTimeSec,
    isRtl,
    viewportAspect
  );

  const transitionArcHeight =
    sectionA !== sectionB ? Math.sin(rawLocalT * Math.PI) * 8.2 : 0;

  const position = lerpVec3(waypointA.position, waypointB.position, easedT);
  position.y += transitionArcHeight;

  const target = lerpVec3(waypointA.target, waypointB.target, easedT);
  const fov = waypointA.fov + (waypointB.fov - waypointA.fov) * easedT;

  // Switch activeSection as soon as the camera begins its main flight toward sectionB (rawLocalT >= 0.25)
  const activeIndex = rawLocalT < 0.25 ? indexA : indexB;
  const activeSection = SCROLL_SECTIONS[activeIndex];

  // Compute card visibility factor (1.0 when settled on a section, smoothly cross-fading during transition)
  const cardVisibility =
    rawLocalT < 0.25
      ? 1 - (rawLocalT / 0.25) * 0.35
      : Math.min(1, 0.65 + ((rawLocalT - 0.25) / 0.45) * 0.35);

  const dominantPlanetId: CelestialId | null =
    activeSection === 'overview-start' || activeSection === 'overview-end'
      ? null
      : activeSection;

  return {
    position,
    target,
    fov,
    activeSection,
    activeIndex,
    sectionProgress: rawLocalT,
    cardVisibility,
    dominantPlanetId,
  };
}

/**
 * Validates and toggles planet selection in the Comparative Matrix view (CompareView).
 * Enforces minimum 2 and maximum 4 planets selected at any time.
 */
export function toggleComparePlanetSelection(
  currentIds: CelestialId[],
  candidateId: CelestialId
): {
  nextIds: CelestialId[];
  status: 'added' | 'removed' | 'min-limit' | 'max-limit';
} {
  const exists = currentIds.includes(candidateId);
  if (exists) {
    if (currentIds.length <= 2) {
      return { nextIds: currentIds, status: 'min-limit' };
    }
    return {
      nextIds: currentIds.filter((id) => id !== candidateId),
      status: 'removed',
    };
  }

  if (currentIds.length >= 4) {
    return { nextIds: currentIds, status: 'max-limit' };
  }

  return {
    nextIds: [...currentIds, candidateId],
    status: 'added',
  };
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/**
 * Normalizes rare Unicode subscript/superscript digits into universally supported glyphs
 * so headless Linux & Persian fonts never render a missing-glyph box.
 */
export function sanitizeTypography(text: string): string {
  return text
    .replace(/₀/g, '0')
    .replace(/₁/g, '1')
    .replace(/₂/g, '2')
    .replace(/₃/g, '3')
    .replace(/₄/g, '4')
    .replace(/¹/g, '1')
    .replace(/⁴/g, '4');
}

export function tText(
  item: { fa: string; en: string },
  lang: Language
): string {
  return sanitizeTypography(item[lang]);
}
