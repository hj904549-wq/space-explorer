import React, { useState } from 'react';
import {
  CELESTIAL_BODIES,
  CelestialId,
  Language,
  MoonId,
} from '../data/solarSystemData.ts';
import {
  CELESTIAL_INTERIOR_MODELS,
  MOON_EXTENDED_SCIENCE,
  PLANET_EXTENDED_SCIENCE,
} from '../data/interiorAndSourcesData.ts';
import {
  getCelestialBody,
  getMoonById,
  tText,
} from '../utils/astronomyMath.ts';

export interface PlanetDossierDrawerProps {
  lang: Language;
  planetId: CelestialId | null;
  selectedMoonId: MoonId | null;
  isOpen: boolean;
  isExploringInterior: boolean;
  selectedInteriorLayerId: string | null;
  onClose: () => void;
  onSelectPlanet: (id: CelestialId) => void;
  onSelectMoon: (moonId: MoonId | null) => void;
  onToggleInteriorMode: (enable?: boolean) => void;
  onSelectInteriorLayer: (layerId: string) => void;
  onRecenterCamera: () => void;
  onReturnToOverview: () => void;
  onOpenInCompare: (id: CelestialId) => void;
}

export const PlanetDossierDrawer: React.FC<PlanetDossierDrawerProps> = ({
  lang,
  planetId,
  selectedMoonId,
  isOpen,
  isExploringInterior,
  selectedInteriorLayerId,
  onClose,
  onSelectPlanet,
  onSelectMoon,
  onToggleInteriorMode,
  onSelectInteriorLayer,
  onRecenterCamera,
  onReturnToOverview,
  onOpenInCompare,
}) => {
  const [moonSearch, setMoonSearch] = useState('');
  const [showRefMoons, setShowRefMoons] = useState(true);

  if (!isOpen || !planetId) return null;

  const isFa = lang === 'fa';
  const body = getCelestialBody(planetId);
  const planetScience = PLANET_EXTENDED_SCIENCE[planetId];
  const interiorModel = CELESTIAL_INTERIOR_MODELS[planetId];
  const activeInteriorLayer =
    interiorModel.layers.find((l) => l.id === selectedInteriorLayerId) ??
    interiorModel.layers[0];

  const activeMoon = selectedMoonId ? getMoonById(selectedMoonId) : null;
  const activeMoonScience = selectedMoonId
    ? MOON_EXTENDED_SCIENCE[selectedMoonId]
    : null;

  const currentIndex = CELESTIAL_BODIES.findIndex((b) => b.id === planetId);
  const prevBody =
    CELESTIAL_BODIES[
      (currentIndex - 1 + CELESTIAL_BODIES.length) % CELESTIAL_BODIES.length
    ];
  const nextBody =
    CELESTIAL_BODIES[(currentIndex + 1) % CELESTIAL_BODIES.length];

  const filteredRefMoons = (body.referenceMoons ?? []).filter((rm) => {
    if (!moonSearch.trim()) return true;
    const q = moonSearch.toLowerCase();
    return (
      rm.name.fa.toLowerCase().includes(q) ||
      rm.name.en.toLowerCase().includes(q) ||
      rm.orbitNote.fa.toLowerCase().includes(q) ||
      rm.orbitNote.en.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end md:flex-row md:justify-end"
      data-testid="planet-dossier-drawer"
    >
      {/* Backdrop click catcher on mobile (leaves top 38% visible for 3D planet/moon) */}
      <div
        className="pointer-events-auto fixed inset-0 bg-black/25 md:bg-transparent"
        onClick={onClose}
      />

      {/* Responsive Dossier Panel: Bottom Sheet on Mobile (<768px) so 3D object stays visible on top, Side Drawer on Desktop */}
      <aside className="pointer-events-auto relative z-10 w-full md:max-w-xl max-h-[62dvh] md:max-h-none md:h-full md:pt-20 pb-5 px-4 sm:px-6 overflow-y-auto bg-[#0b0e18]/96 border-t md:border-t-0 md:border-s border-[#65d9ff]/40 rounded-t-3xl md:rounded-none shadow-[0_-16px_50px_rgba(0,0,0,0.9)] md:shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between">
        <div className="space-y-5">
          {/* Mobile Pull Handle */}
          <div className="md:hidden pt-2.5 flex justify-center">
            <span className="w-12 h-1.5 rounded-full bg-[#424752]/60" />
          </div>

          {/* Top Dossier Header */}
          <div className="flex items-start justify-between gap-3 pt-2 md:pt-4 border-b border-[#424752]/30 pb-3.5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: activeMoon
                      ? activeMoon.color
                      : body.accentHex,
                  }}
                />
                <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#65d9ff]">
                  {activeMoon
                    ? `SATELLITE // ${activeMoon.englishName.toUpperCase()}`
                    : isExploringInterior
                      ? `3D INTERIOR // ${body.englishName.toUpperCase()}`
                      : `${body.stationCode} // ${body.auString}`}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1f232e] text-[#f8c270] border border-[#f8c270]/30">
                  {activeMoon
                    ? isFa
                      ? `قمر طبیعی ${tText(body.name, lang)}`
                      : `Moon of ${tText(body.name, lang)}`
                    : tText(body.categoryLabel, lang)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#e0e2f1] truncate">
                {activeMoon
                  ? tText(activeMoon.name, lang)
                  : tText(body.name, lang)}
              </h2>
              <p className="text-xs text-[#c2c6d4] mt-0.5 truncate">
                {activeMoon
                  ? tText(activeMoon.surfaceType, lang)
                  : isExploringInterior
                    ? tText(interiorModel.modelTitle, lang)
                    : tText(body.subtitle, lang)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                data-testid="recenter-camera-btn"
                onClick={onRecenterCamera}
                className="p-2 rounded-xl bg-[#171b26] border border-[#424752]/40 text-[#65d9ff] hover:border-[#65d9ff] transition-all cursor-pointer"
                title={isFa ? 'بازنشانی زاویه دوربین ۳بعدی' : 'Recenter 3D Camera'}
              >
                <span className="material-symbols-outlined text-lg">
                  center_focus_strong
                </span>
              </button>
              <button
                type="button"
                data-testid="close-dossier-btn"
                onClick={onClose}
                className="p-2 rounded-xl bg-[#171b26] border border-[#424752]/40 text-[#c2c6d4] hover:text-[#e0e2f1] hover:border-[#65d9ff] transition-all cursor-pointer"
                title={isFa ? 'بستن پرونده علمی' : 'Close Dossier'}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* Primary Mode Switch Bar: Exterior / 3D Interior Cutaway / Moon Focus */}
          <div className="flex flex-wrap items-center gap-2 bg-[#131620] p-2 rounded-2xl border border-[#424752]/35">
            <button
              type="button"
              data-testid="dossier-mode-exterior-btn"
              onClick={() => {
                onSelectMoon(null);
                if (isExploringInterior) onToggleInteriorMode(false);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !activeMoon && !isExploringInterior
                  ? 'bg-[#65d9ff] text-[#003546] shadow-[0_0_16px_rgba(101,217,255,0.28)]'
                  : 'bg-[#0b0e18] text-[#c2c6d4] hover:text-[#e0e2f1]'
              }`}
            >
              <span className="material-symbols-outlined text-base">public</span>
              <span>
                {isFa ? 'نمای بیرونی و پرونده' : 'Exterior & Telemetry'}
              </span>
            </button>

            <button
              type="button"
              data-testid="toggle-interior-mode-btn"
              onClick={() => onToggleInteriorMode(!isExploringInterior)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isExploringInterior
                  ? 'bg-[#f8c270] text-[#221500] shadow-[0_0_18px_rgba(248,194,112,0.35)]'
                  : 'bg-[#0b0e18] text-[#f8c270] border border-[#f8c270]/35 hover:bg-[#f8c270]/15'
              }`}
            >
              <span className="material-symbols-outlined text-base">layers</span>
              <span>
                {isExploringInterior
                  ? isFa
                    ? 'برش ۳بعدی فعال (خروج)'
                    : 'Exit 3D Cutaway'
                  : isFa
                    ? 'ساختار داخلی ۳بعدی'
                    : 'Explore Interior 3D'}
              </span>
            </button>
          </div>

          {/* =====================================================================
              MODE A: INTERACTIVE 3D INTERIOR CUTAWAY EXPLORER (Phase 5)
             ===================================================================== */}
          {isExploringInterior && (
            <div
              data-testid={`interior-explorer-panel-${body.id}`}
              className="bg-[#131620] border-2 border-[#f8c270]/55 rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_0_35px_rgba(248,194,112,0.14)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#424752]/35 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#f8c270]">
                    <span className="material-symbols-outlined text-base">
                      pie_chart
                    </span>
                    <span>{tText(interiorModel.modelTitle, lang)}</span>
                  </div>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-[#1f232e] text-[#b2c5ff] border border-[#b2c5ff]/30">
                    {interiorModel.isModelInferred
                      ? isFa
                        ? 'مدل علمی استنتاج‌شده از داده‌های گرانشی فضاپیماها'
                        : 'Scientifically Inferred Interior Model (Gravity/Magnetic Data)'
                      : isFa
                        ? 'مدل استاندارد لرزه‌شناسی / اخترفیزیک خورشیدی'
                        : 'Direct Seismic / Helioseismic Standard Model'}
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="exit-interior-mode-btn"
                  onClick={() => onToggleInteriorMode(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#171b26] border border-[#f8c270]/45 text-[#f8c270] text-xs font-bold hover:bg-[#f8c270] hover:text-[#1f1300] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    visibility
                  </span>
                  <span>
                    {isFa ? 'بازگشت به سطح سیاره' : 'Return to Exterior'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-[#c2c6d4] leading-relaxed">
                {tText(interiorModel.scientificSummary, lang)}
              </p>

              {/* Layer Selector Buttons (Synchronized with 3D Cutaway Shells) */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#65d9ff] flex items-center justify-between">
                  <span>
                    {isFa
                      ? 'انتخاب لایه در مدل سه‌بعدی (از بیرون به مرکز یا بالعکس):'
                      : 'Select Layer to Highlight in 3D Cutaway:'}
                  </span>
                  <span className="font-mono-tech text-[10px] text-[#8c919e]">
                    {interiorModel.layers.length}{' '}
                    {isFa ? 'لایه' : 'REGIONS'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interiorModel.layers.map((layer) => {
                    const isSelected = activeInteriorLayer.id === layer.id;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        data-testid={`interior-layer-btn-${layer.id}`}
                        onClick={() => onSelectInteriorLayer(layer.id)}
                        className={`p-2.5 rounded-xl border text-start transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#f8c270]/20 border-[#f8c270] text-[#e0e2f1] shadow-[0_0_16px_rgba(248,194,112,0.28)]'
                            : 'bg-[#0b0e18] border-[#424752]/40 text-[#c2c6d4] hover:border-[#f8c270]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/25"
                            style={{ backgroundColor: layer.color }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#e0e2f1] truncate">
                              {tText(layer.name, lang)}
                            </div>
                            <div className="text-[10px] text-[#8c919e] truncate">
                              {tText(layer.depthOrThickness, lang)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-[#171b26] text-[#f8c270] shrink-0">
                          {layer.regionType === 'atmosphere'
                            ? isFa
                              ? 'جو'
                              : 'ATMO'
                            : isFa
                              ? 'درونی'
                              : 'CORE'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Layer Detailed Telemetry Card */}
              <div
                data-testid={`selected-layer-detail-${activeInteriorLayer.id}`}
                className="bg-[#0b0e18] border border-[#f8c270]/40 rounded-xl p-3.5 sm:p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#424752]/25 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: activeInteriorLayer.color }}
                    />
                    <h4 className="text-sm font-black text-[#e0e2f1]">
                      {tText(activeInteriorLayer.name, lang)}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#f8c270]/15 text-[#f8c270]">
                    {tText(activeInteriorLayer.depthOrThickness, lang)}
                  </span>
                </div>

                <p className="text-xs text-[#e0e2f1]/90 leading-relaxed">
                  {tText(activeInteriorLayer.description, lang)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#131620] p-2.5 rounded-lg border border-[#424752]/25">
                    <span className="text-[10px] text-[#8c919e] block mb-0.5">
                      {isFa ? 'ترکیب غالب شیمیایی/فیزیکی' : 'Dominant Composition'}
                    </span>
                    <span className="font-bold text-[#65d9ff]">
                      {tText(activeInteriorLayer.composition, lang)}
                    </span>
                  </div>
                  <div className="bg-[#131620] p-2.5 rounded-lg border border-[#424752]/25">
                    <span className="text-[10px] text-[#8c919e] block mb-0.5">
                      {isFa ? 'محدوده دما (تخمینی)' : 'Estimated Temperature'}
                    </span>
                    <span className="font-bold text-[#f8c270] ltr-num">
                      {tText(activeInteriorLayer.temperatureRange, lang)}
                    </span>
                  </div>
                  <div className="bg-[#131620] p-2.5 rounded-lg border border-[#424752]/25">
                    <span className="text-[10px] text-[#8c919e] block mb-0.5">
                      {isFa ? 'حالت فیزیکی ماده' : 'Physical State'}
                    </span>
                    <span className="font-bold text-[#e0e2f1]">
                      {tText(activeInteriorLayer.physicalState, lang)}
                    </span>
                  </div>
                  <div className="bg-[#131620] p-2.5 rounded-lg border border-[#424752]/25">
                    <span className="text-[10px] text-[#8c919e] block mb-0.5">
                      {isFa ? 'نقش علمی و دینامیکی' : 'Scientific Role'}
                    </span>
                    <span className="font-bold text-[#b2c5ff]">
                      {tText(activeInteriorLayer.scientificRole, lang)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scientific Scale & Exaggeration Disclosure Note */}
              <div className="bg-[#171b26] border-s-2 border-[#65d9ff] p-3 rounded-e-xl text-[11px] text-[#c2c6d4] leading-relaxed">
                {tText(interiorModel.exaggerationNote, lang)}
              </div>
            </div>
          )}

          {/* =====================================================================
              MODE B: ACTIVE 3D MOON FOCUS & SYNCHRONIZED DOSSIER PANEL (Phase 3)
             ===================================================================== */}
          {activeMoon && (
            <div
              data-testid={`moon-dossier-panel-${activeMoon.id}`}
              className="bg-[#131620] border-2 border-[#65d9ff]/55 rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_0_35px_rgba(101,217,255,0.16)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#424752]/30 pb-3">
                <div className="flex items-center gap-2 text-[#65d9ff] text-xs font-bold">
                  <span className="material-symbols-outlined text-base">
                    satellite_alt
                  </span>
                  <span>
                    {isFa
                      ? `قفل دوربین ۳بعدی روی قمر ${tText(activeMoon.name, lang)}`
                      : `3D Camera Tracking ${tText(activeMoon.name, lang)}`}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    data-testid="return-to-planet-btn"
                    onClick={() => onSelectMoon(null)}
                    className="px-3 py-1.5 rounded-lg bg-[#65d9ff] text-[#003546] text-xs font-bold hover:bg-[#9ee4ff] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      undo
                    </span>
                    <span>
                      {isFa
                        ? `بازگشت به ${tText(body.name, lang)}`
                        : `Return to ${tText(body.name, lang)}`}
                    </span>
                  </button>
                  <button
                    type="button"
                    data-testid="moon-return-overview-btn"
                    onClick={onReturnToOverview}
                    className="px-2.5 py-1.5 rounded-lg bg-[#171b26] border border-[#424752]/50 text-[#c2c6d4] hover:text-[#e0e2f1] text-xs font-bold transition-all cursor-pointer"
                  >
                    {isFa ? 'نمای کلی منظومه' : 'System Overview'}
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#e0e2f1]/90 leading-relaxed">
                {tText(activeMoon.description, lang)}
              </p>

              {/* Comprehensive NASA/JPL Moon Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                  <span className="text-[10px] text-[#8c919e] block mb-0.5">
                    {isFa ? 'قطر میانگین قمر' : 'Mean Diameter'}
                  </span>
                  <span className="text-xs font-bold text-[#65d9ff] ltr-num">
                    {tText(activeMoon.diameterString, lang)}
                  </span>
                </div>
                <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                  <span className="text-[10px] text-[#8c919e] block mb-0.5">
                    {isFa ? 'دوره تناوب مداری' : 'Orbital Period'}
                  </span>
                  <span className="text-xs font-bold text-[#e0e2f1]">
                    {tText(activeMoon.orbitalPeriodString, lang)}
                  </span>
                </div>
                <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                  <span className="text-[10px] text-[#8c919e] block mb-0.5">
                    {isFa ? 'نیم‌قطر بزرگ مدار' : 'Semi-Major Axis'}
                  </span>
                  <span className="text-xs font-bold text-[#f8c270] ltr-num">
                    {activeMoonScience
                      ? tText(activeMoonScience.semiMajorAxisString, lang)
                      : tText(activeMoon.distanceFromPlanetKm, lang)}
                  </span>
                </div>
                {activeMoonScience && (
                  <>
                    <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                      <span className="text-[10px] text-[#8c919e] block mb-0.5">
                        {isFa ? 'جرم قمر' : 'Mass'}
                      </span>
                      <span className="text-xs font-bold text-[#e0e2f1] ltr-num">
                        {tText(activeMoonScience.massString, lang)}
                      </span>
                    </div>
                    <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                      <span className="text-[10px] text-[#8c919e] block mb-0.5">
                        {isFa ? 'چگالی میانگین' : 'Mean Density'}
                      </span>
                      <span className="text-xs font-bold text-[#b2c5ff] ltr-num">
                        {tText(activeMoonScience.densityString, lang)}
                      </span>
                    </div>
                    <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                      <span className="text-[10px] text-[#8c919e] block mb-0.5">
                        {isFa ? 'شتاب گرانش سطحی' : 'Surface Gravity'}
                      </span>
                      <span className="text-xs font-bold text-[#65d9ff] ltr-num">
                        {tText(activeMoonScience.gravityString, lang)}
                      </span>
                    </div>
                    <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30">
                      <span className="text-[10px] text-[#8c919e] block mb-0.5">
                        {isFa ? 'خروج از مرکز و میل مدار' : 'Eccentricity & Inclination'}
                      </span>
                      <span className="text-[11px] font-bold text-[#e0e2f1] ltr-num">
                        e = {activeMoonScience.eccentricity} •{' '}
                        {tText(activeMoonScience.inclinationString, lang)}
                      </span>
                    </div>
                    <div className="bg-[#0b0e18] p-2.5 rounded-xl border border-[#424752]/30 col-span-2">
                      <span className="text-[10px] text-[#8c919e] block mb-0.5">
                        {isFa ? 'وضعیت چرخش وضعی و قفل کشندی' : 'Rotation & Tidal Lock'}
                      </span>
                      <span className="text-xs font-bold text-[#f8c270]">
                        {tText(activeMoonScience.rotationSyncString, lang)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {activeMoonScience && (
                <div className="bg-[#0b0e18] p-3.5 rounded-xl border border-[#424752]/30 space-y-2 text-xs">
                  <div>
                    <strong className="text-[#65d9ff] block mb-0.5">
                      {isFa
                        ? 'ویژگی‌های زمین‌شناسی و ساختار درونی قمر:'
                        : 'Surface & Interior Geology:'}
                    </strong>
                    <p className="text-[#e0e2f1]/90 leading-relaxed">
                      {tText(activeMoonScience.geologicalFeatures, lang)}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#424752]/25 text-[11px] text-[#8c919e]">
                    {tText(activeMoonScience.certaintyNote, lang)}
                  </div>
                </div>
              )}

              <div className="bg-[#f8c270]/10 border-s-2 border-[#f8c270] p-3 rounded-e-xl text-xs text-[#e0e2f1]/90">
                <strong className="text-[#f8c270] block mb-0.5">
                  {isFa ? 'نکته شگفت‌انگیز قمر:' : 'Moon Fact:'}
                </strong>
                {tText(activeMoon.funFact, lang)}
              </div>

              {/* Verified NASA/JPL Sources for Selected Moon */}
              {activeMoonScience && activeMoonScience.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono-tech text-[#8c919e]">
                    {isFa ? 'منابع رسمی داده:' : 'Authoritative Sources:'}
                  </span>
                  {activeMoonScience.sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#0b0e18] border border-[#65d9ff]/35 text-[#65d9ff] hover:bg-[#65d9ff]/15 transition-all"
                    >
                      {src.organization}: {src.title} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interactive 3D Planetary Moons Explorer Section */}
          {body.moons3D.length > 0 && (
            <div className="space-y-3 bg-[#131620]/90 p-4 rounded-2xl border border-[#424752]/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#65d9ff] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    orbit
                  </span>
                  <span>
                    {isFa
                      ? `اقمار تعاملی در صحنه سه‌بعدی (${body.moons3D.length} قمر اصلی)`
                      : `Interactive 3D Moons (${body.moons3D.length} Rendered)`}
                  </span>
                </h3>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#65d9ff]/12 text-[#65d9ff] border border-[#65d9ff]/30">
                  {isFa ? 'کلیک برای تعقیب مداری قمر' : 'CLICK TO TRACK IN 3D'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {body.moons3D.map((m) => {
                  const isSelected = selectedMoonId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-testid={`focus-moon-${m.id}`}
                      onClick={() => onSelectMoon(isSelected ? null : m.id)}
                      className={`p-3 rounded-xl border text-start transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#65d9ff]/20 border-[#65d9ff] text-[#e0e2f1] shadow-[0_0_16px_rgba(101,217,255,0.25)]'
                          : 'bg-[#0b0e18] border-[#424752]/35 text-[#c2c6d4] hover:border-[#65d9ff]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: m.color }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#e0e2f1] truncate">
                            {tText(m.name, lang)}
                          </div>
                          <div className="text-[10px] text-[#8c919e] truncate ltr-num">
                            {tText(m.diameterString, lang)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#171b26] text-[#65d9ff] shrink-0">
                        {isSelected
                          ? isFa
                            ? 'فعال'
                            : 'FOCUSED'
                          : '3D'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Reference Moons Catalog (Expandable & Searchable for Giant Planets) */}
              {body.referenceMoons && body.referenceMoons.length > 0 && (
                <div className="pt-2 border-t border-[#424752]/25 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRefMoons((s) => !s)}
                      className="text-xs font-bold text-[#b2c5ff] hover:text-[#65d9ff] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {showRefMoons ? 'expand_less' : 'expand_more'}
                      </span>
                      <span>
                        {isFa
                          ? `فهرست مرجع سایر اقمار مهم (${body.referenceMoons.length} قمر منتخب از ${body.moonsCount})`
                          : `Reference Moon Catalog (${body.referenceMoons.length} of ${body.moonsCount} Moons)`}
                      </span>
                    </button>
                    <span className="text-[10px] text-[#8c919e]">
                      {isFa
                        ? 'مرجع آموزشی (بدون بارگذاری هندسی اضافی)'
                        : 'Educational Reference List'}
                    </span>
                  </div>

                  {showRefMoons && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={moonSearch}
                        onChange={(e) => setMoonSearch(e.target.value)}
                        placeholder={
                          isFa
                            ? 'جستجو در نام یا ویژگی قمر...'
                            : 'Search moons by name or feature...'
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0b0e18] border border-[#424752]/40 text-xs text-[#e0e2f1] placeholder-[#8c919e] focus:outline-none focus:border-[#65d9ff]"
                      />
                      <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
                        {filteredRefMoons.map((rm, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-[#0b0e18]/80 border border-[#424752]/20 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-[#e0e2f1]">
                                {tText(rm.name, lang)}
                              </span>
                              <span className="text-[11px] text-[#8c919e] block truncate">
                                {tText(rm.orbitNote, lang)}
                              </span>
                            </div>
                            <span className="font-mono-tech text-[10px] text-[#b2c5ff] shrink-0">
                              {rm.diameterKm}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scientific Visual Scale Explanation Note */}
              <p className="text-[10px] text-[#8c919e] leading-relaxed pt-1">
                {isFa
                  ? '* توضیح علمی مقیاس: برای وضوح بصری و امکان انتخاب تعاملی در صحنه سه‌بعدی، فواصل مداری و ابعاد ظاهری اقمار با مقیاس فشرده مدل‌سازی شده‌اند، اما اعداد جدول فوق مقادیر دقیق اخترشناسی هستند.'
                  : '* Visual Scale Note: Orbital distances and moon radii in the 3D scene are visually scaled for interactive legibility, while all numerical telemetry reflects exact astronomical measurements.'}
              </p>
            </div>
          )}

          {/* Scientific Overview & Fun Fact */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-[#65d9ff] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                description
              </span>
              <span>
                {isFa
                  ? `تحلیل علمی ${tText(body.name, lang)}`
                  : `${tText(body.name, lang)} Scientific Analysis`}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-[#e0e2f1]/90 leading-relaxed bg-[#131620] p-3.5 sm:p-4 rounded-xl border border-[#424752]/25">
              {tText(body.description, lang)}
            </p>

            <div className="bg-[#f8c270]/10 border-s-2 border-[#f8c270] p-3.5 rounded-e-xl">
              <div className="text-xs font-bold text-[#f8c270] mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">
                  auto_awesome
                </span>
                <span>
                  {isFa
                    ? 'نکته کلیدی و شگفتی نجومی'
                    : 'Astronomical Highlight'}
                </span>
              </div>
              <p className="text-xs text-[#e0e2f1]/90 leading-relaxed">
                {tText(body.funFact, lang)}
              </p>
            </div>
          </div>

          {/* Comprehensive 12-Metric NASA/JPL Telemetry Grid (Phase 6) */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#65d9ff] mb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                analytics
              </span>
              <span>
                {isFa
                  ? 'پارامترهای فیزیکی و مداری (تله‌متری NASA / JPL)'
                  : 'Orbital & Physical Telemetry (NASA / JPL)'}
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'قطر میانگین / استوایی' : 'Mean Diameter'}
                </span>
                <span className="text-xs font-bold text-[#e0e2f1] ltr-num">
                  {tText(body.diameterString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'فاصله میانگین از خورشید' : 'Semi-Major Axis'}
                </span>
                <span className="text-xs font-bold text-[#65d9ff] ltr-num">
                  {tText(body.distanceKmString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'جرم (Mass)' : 'Mass'}
                </span>
                <span className="text-xs font-bold text-[#e0e2f1] ltr-num">
                  {tText(planetScience.massString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'چگالی میانگین' : 'Mean Density'}
                </span>
                <span className="text-xs font-bold text-[#b2c5ff] ltr-num">
                  {tText(planetScience.densityString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'دوره گردش مداری (سال)' : 'Orbital Period'}
                </span>
                <span className="text-xs font-bold text-[#e0e2f1]">
                  {tText(body.orbitalYearsString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'چرخش وضعی (شبانه‌روز)' : 'Sidereal Rotation'}
                </span>
                <span className="text-xs font-bold text-[#b2c5ff]">
                  {tText(body.rotationPeriodString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'دمای سطح / تراز مرجع' : 'Temperature'}
                </span>
                <span className="text-xs font-bold text-[#f8c270] ltr-num">
                  {tText(body.tempString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'شتاب گرانش' : 'Surface / 1-bar Gravity'}
                </span>
                <span className="text-xs font-bold text-[#e0e2f1] ltr-num">
                  {tText(body.gravityString, lang)}
                </span>
              </div>
              <div className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25">
                <span className="text-[10px] text-[#8c919e] block mb-0.5">
                  {isFa ? 'انحراف محور و میل مدار' : 'Axial Tilt & Inclination'}
                </span>
                <span className="text-[11px] font-bold text-[#65d9ff] ltr-num">
                  {body.axialTiltDeg}° • {tText(planetScience.inclinationString, lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Atmospheric Composition Breakdown */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#65d9ff] mb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">air</span>
              <span>
                {isFa ? 'ترکیب شیمیایی اتمسفر' : 'Atmospheric Composition'}
              </span>
            </h3>
            <div className="bg-[#131620] p-3.5 sm:p-4 rounded-xl border border-[#424752]/25 space-y-2.5">
              {body.atmosphereGases.map((gas) => (
                <div key={gas.symbol} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#e0e2f1]">
                      {tText(gas.name, lang)}{' '}
                      <span className="font-mono-tech text-[#65d9ff]">
                        ({gas.symbol.replace(/₂/g, '2').replace(/₄/g, '4')})
                      </span>
                    </span>
                    <span className="font-mono-tech text-[#c2c6d4]">
                      {gas.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#070a12] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(4, gas.percentage)}%`,
                        backgroundColor: gas.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Structure Layers Summary & Space Missions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-[#131620] p-3.5 sm:p-4 rounded-xl border border-[#424752]/25 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#b2c5ff] mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    layers
                  </span>
                  <span>{isFa ? 'لایه‌های درونی' : 'Internal Structure'}</span>
                </h4>
                <div className="space-y-2">
                  {interiorModel.layers.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => {
                        if (!isExploringInterior) onToggleInteriorMode(true);
                        onSelectInteriorLayer(layer.id);
                      }}
                      className="w-full flex items-center justify-between text-xs border-b border-[#424752]/20 pb-1.5 last:border-0 last:pb-0 hover:text-[#f8c270] transition-colors cursor-pointer text-start"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-[#e0e2f1] font-medium truncate">
                          {tText(layer.name, lang)}
                        </span>
                      </div>
                      <span className="font-mono-tech text-[10px] text-[#f8c270] shrink-0">
                        3D →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#131620] p-3.5 sm:p-4 rounded-xl border border-[#424752]/25">
              <h4 className="text-xs font-bold text-[#f8c270] mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  satellite_alt
                </span>
                <span>
                  {isFa ? 'ماموریت‌های اکتشافی' : 'Key Space Missions'}
                </span>
              </h4>
              <div className="space-y-2">
                {body.missions.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs border-b border-[#424752]/20 pb-1.5 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="text-[#e0e2f1] font-bold truncate">
                        {tText(m.name, lang)}
                      </div>
                      <div className="text-[10px] text-[#8c919e]">
                        {m.agency}
                      </div>
                    </div>
                    <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-[#1f232e] text-[#65d9ff] shrink-0">
                      {m.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Authoritative NASA / JPL Scientific References & Definitions */}
          <div className="bg-[#131620] p-3.5 rounded-xl border border-[#424752]/25 space-y-2 text-[11px] text-[#8c919e]">
            <div>
              <strong className="text-[#c2c6d4]">
                {isFa ? 'یادداشت علمی و استاندارد اندازه‌گیری: ' : 'Measurement Standard: '}
              </strong>
              {tText(planetScience.uncertaintyNote, lang)}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-mono-tech text-[10px] text-[#65d9ff]">
                {isFa ? 'منابع مرجع:' : 'References:'}
              </span>
              {planetScience.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-[#0b0e18] border border-[#424752]/40 text-[#b2c5ff] hover:border-[#65d9ff] hover:text-[#65d9ff] transition-all"
                >
                  {src.organization} — {src.title} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions: Compare & Prev/Next Planet */}
        <div className="pt-4 mt-5 border-t border-[#424752]/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectPlanet(prevBody.id)}
              className="px-3 py-2 rounded-lg bg-[#171b26] border border-[#424752]/35 text-xs font-bold text-[#c2c6d4] hover:text-[#65d9ff] hover:border-[#65d9ff]/40 transition-all cursor-pointer"
            >
              {isFa
                ? `→ ${tText(prevBody.name, lang)}`
                : `← ${tText(prevBody.name, lang)}`}
            </button>
            <button
              type="button"
              onClick={() => onSelectPlanet(nextBody.id)}
              className="px-3 py-2 rounded-lg bg-[#171b26] border border-[#424752]/35 text-xs font-bold text-[#c2c6d4] hover:text-[#65d9ff] hover:border-[#65d9ff]/40 transition-all cursor-pointer"
            >
              {isFa
                ? `${tText(nextBody.name, lang)} ←`
                : `${tText(nextBody.name, lang)} →`}
            </button>
          </div>

          {body.id !== 'sun' && (
            <button
              type="button"
              onClick={() => onOpenInCompare(body.id)}
              className="px-4 py-2 rounded-lg bg-[#65d9ff] text-[#003546] font-bold text-xs hover:bg-[#9ee4ff] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                compare_arrows
              </span>
              <span>
                {isFa ? 'افزودن به جدول مقایسه' : 'Compare This Planet'}
              </span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
