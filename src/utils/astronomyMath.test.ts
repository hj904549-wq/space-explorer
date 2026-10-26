import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeScrollCameraState,
  distanceVec3,
  getCelestialBody,
  getMoonById,
  getMoonCameraState,
  getMoonWorldPosition,
  getPlanetWorldPosition,
  getWaypointForSection,
  toggleComparePlanetSelection,
  toPersianDigits,
} from './astronomyMath.ts';
import { CELESTIAL_BODIES, SCROLL_SECTIONS } from '../data/solarSystemData.ts';
import {
  CELESTIAL_INTERIOR_MODELS,
  MOON_EXTENDED_SCIENCE,
  PLANET_EXTENDED_SCIENCE,
} from '../data/interiorAndSourcesData.ts';

test('getPlanetWorldPosition keeps Sun at origin and places planets at expected orbital radii', () => {
  const sunPos = getPlanetWorldPosition('sun', 100);
  assert.equal(sunPos.x, 0);
  assert.equal(sunPos.y, 0);
  assert.equal(sunPos.z, 0);

  const earthT0 = getPlanetWorldPosition('earth', 0);
  const earthPlanarDist = Math.hypot(earthT0.x, earthT0.z);
  assert.ok(
    Math.abs(earthPlanarDist - 34) < 0.01,
    `Expected Earth planar orbit radius ~34, got ${earthPlanarDist}`
  );

  const earthT10 = getPlanetWorldPosition('earth', 10);
  assert.notEqual(
    earthT0.angle,
    earthT10.angle,
    'Earth orbital angle should advance with simulation time'
  );
});

test('getMoonWorldPosition and getMoonCameraState track all 12 moons without colliding with host planet', () => {
  const requiredMoonIds = [
    'moon',
    'phobos',
    'deimos',
    'io',
    'europa',
    'ganymede',
    'callisto',
    'titan',
    'enceladus',
    'titania',
    'oberon',
    'triton',
  ] as const;

  for (const mId of requiredMoonIds) {
    const moonInfo = getMoonById(mId);
    const parentBody = getCelestialBody(moonInfo.parentPlanetId);
    const mPos = getMoonWorldPosition(mId, 18);
    const distToParent = distanceVec3(mPos, mPos.parentPosition);
    assert.ok(
      Math.abs(distToParent - moonInfo.distance) < 0.25,
      `Moon ${mId} should orbit at ~${moonInfo.distance} from ${moonInfo.parentPlanetId}, got ${distToParent}`
    );

    const camState = getMoonCameraState(mId, 18, true, 1.6, true);
    const camToMoon = distanceVec3(camState.position, mPos);
    const camToParent = distanceVec3(camState.position, mPos.parentPosition);
    assert.ok(
      camToMoon < 6.0,
      `Moon camera for ${mId} should frame the moon closely, got distance ${camToMoon}`
    );
    assert.ok(
      camToParent > parentBody.sceneRadius * 1.25,
      `Moon camera for ${mId} must never collide with parent planet ${parentBody.id}`
    );
  }
});

test('computeScrollCameraState synchronizes activeSection at start of transition (rawLocalT >= 0.25) and frames planets closely', () => {
  assert.equal(SCROLL_SECTIONS.length, 11);

  const startState = computeScrollCameraState(0, 0, true);
  assert.equal(startState.activeSection, 'overview-start');
  assert.equal(startState.dominantPlanetId, null);
  assert.ok(startState.position.z > 120, 'Overview camera should start wide');

  // Early transition into Earth (between Venus index 3 and Earth index 4 at localT = 0.30)
  const earlyEarthTransition = 3.3 / 10;
  const earlyEarthState = computeScrollCameraState(earlyEarthTransition, 25, true);
  assert.equal(
    earlyEarthState.activeSection,
    'earth',
    'Card/section should switch to Earth as soon as camera transition passes 0.25'
  );

  const earthScroll = 4 / 10;
  const earthState = computeScrollCameraState(earthScroll, 25, true);
  assert.equal(earthState.activeSection, 'earth');
  assert.equal(earthState.dominantPlanetId, 'earth');

  const earthWorldPos = getPlanetWorldPosition('earth', 25);
  const camToEarthAtEarthSection = distanceVec3(
    earthState.position,
    earthWorldPos
  );
  const camToEarthAtOverview = distanceVec3(
    startState.position,
    earthWorldPos
  );

  assert.ok(
    camToEarthAtEarthSection < 12,
    `Camera should be close to Earth at Earth section, got ${camToEarthAtEarthSection}`
  );
  assert.ok(
    camToEarthAtEarthSection < camToEarthAtOverview * 0.1,
    'Camera at Earth section must be >10x closer to Earth than at wide overview'
  );
});

test('getWaypointForSection adapts framing for desktop vs mobile portrait aspect ratios', () => {
  const desktopEarth = getWaypointForSection('earth', 0, true, 1.6);
  const mobileEarth = getWaypointForSection('earth', 0, true, 0.5);
  assert.notDeepEqual(desktopEarth.target, mobileEarth.target);
  assert.ok(
    mobileEarth.target.y < desktopEarth.target.y,
    'Mobile portrait target shifts downward so 3D planet sits in upper viewport above card'
  );
});

test('CELESTIAL_INTERIOR_MODELS and NASA/JPL extended science cover all 9 celestial bodies and 12 moons', () => {
  for (const body of CELESTIAL_BODIES) {
    const model = CELESTIAL_INTERIOR_MODELS[body.id];
    assert.ok(model, `Missing interior model for ${body.id}`);
    assert.ok(
      model.layers.length >= 3,
      `Expected >=3 interior layers for ${body.id}`
    );

    const ext = PLANET_EXTENDED_SCIENCE[body.id];
    assert.ok(ext, `Missing extended science for ${body.id}`);
    assert.ok(ext.sources.length >= 2, `Expected NASA/JPL sources for ${body.id}`);

    for (const m of body.moons3D) {
      const mExt = MOON_EXTENDED_SCIENCE[m.id];
      assert.ok(mExt, `Missing extended moon science for ${m.id}`);
      assert.ok(mExt.sources.length >= 1, `Expected source link for moon ${m.id}`);
    }
  }

  // Earth must have 4 layers (Crust, Mantle, Outer Core, Inner Core)
  assert.equal(CELESTIAL_INTERIOR_MODELS.earth.layers.length, 4);
  // Sun must have 6 solar regions (Core, Radiative, Convective, Photosphere, Chromosphere, Corona)
  assert.equal(CELESTIAL_INTERIOR_MODELS.sun.layers.length, 6);
});

test('toggleComparePlanetSelection enforces 2-to-4 planet bounds', () => {
  const initial: ('earth' | 'mars' | 'jupiter' | 'saturn' | 'venus')[] = [
    'earth',
    'mars',
  ];

  const removeAttempt = toggleComparePlanetSelection(initial, 'earth');
  assert.equal(removeAttempt.status, 'min-limit');
  assert.equal(removeAttempt.nextIds.length, 2);

  const add3 = toggleComparePlanetSelection(initial, 'jupiter');
  assert.equal(add3.status, 'added');
  assert.equal(add3.nextIds.length, 3);

  const add4 = toggleComparePlanetSelection(add3.nextIds, 'saturn');
  assert.equal(add4.status, 'added');
  assert.equal(add4.nextIds.length, 4);

  const add5Attempt = toggleComparePlanetSelection(add4.nextIds, 'venus');
  assert.equal(add5Attempt.status, 'max-limit');
  assert.equal(add5Attempt.nextIds.length, 4);
});

test('toPersianDigits converts ASCII numbers cleanly', () => {
  assert.equal(toPersianDigits('2026 - 14.5%'), '۲۰۲۶ - ۱۴.۵%');
});
