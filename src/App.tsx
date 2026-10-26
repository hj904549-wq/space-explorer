import React, { useEffect, useRef, useState } from 'react';
import {
  CELESTIAL_BODIES,
  CelestialId,
  Language,
  MoonId,
  SCROLL_SECTIONS,
  ScrollSectionId,
} from './data/solarSystemData.ts';
import { CELESTIAL_INTERIOR_MODELS } from './data/interiorAndSourcesData.ts';
import {
  getCelestialBody,
  getMoonById,
  tText,
} from './utils/astronomyMath.ts';
import { SolarSystemCanvas } from './components/SolarSystemCanvas.tsx';
import { ActiveTab, Header } from './components/Header.tsx';
import { SolarRail } from './components/SolarRail.tsx';
import { PlanetDossierDrawer } from './components/PlanetDossierDrawer.tsx';
import { CompareView } from './components/CompareView.tsx';
import { LearnView } from './components/LearnView.tsx';
import { QuizView } from './components/QuizView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] =
    useState<ScrollSectionId>('overview-start');

  // Interactive Planet, Moon & 3D Interior Cutaway state
  const [selectedPlanetId, setSelectedPlanetId] =
    useState<CelestialId | null>(null);
  const [selectedMoonId, setSelectedMoonId] = useState<MoonId | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isExploringInterior, setIsExploringInterior] =
    useState<boolean>(false);
  const [selectedInteriorLayerId, setSelectedInteriorLayerId] = useState<
    string | null
  >(null);
  const [recenterSignal, setRecenterSignal] = useState<number>(0);

  // 3D Simulation controls
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showStarfield, setShowStarfield] = useState<boolean>(true);
  const [highQualityGlow, setHighQualityGlow] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Compare View state (defaults to Earth, Mars, Jupiter as in Stitch design)
  const [comparePlanetIds, setComparePlanetIds] = useState<CelestialId[]>([
    'earth',
    'mars',
    'jupiter',
  ]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Sync document dir="rtl" / "ltr" and lang attribute without losing scroll or 3D state
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  // Continuous Scroll Progress Listener in Explore Mode
  useEffect(() => {
    if (activeTab !== 'explore') return;

    const updateScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 10) {
        setScrollProgress(0);
        return;
      }
      const raw = window.scrollY / docHeight;
      setScrollProgress(Math.max(0, Math.min(1, raw)));
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [activeTab]);

  const handleJumpToSection = (sectionId: ScrollSectionId, index?: number) => {
    setSelectedMoonId(null);
    setIsExploringInterior(false);
    setIsDossierOpen(false);
    if (sectionId !== 'overview-start' && sectionId !== 'overview-end') {
      setSelectedPlanetId(sectionId);
    } else {
      setSelectedPlanetId(null);
    }

    const targetIndex =
      index !== undefined ? index : SCROLL_SECTIONS.indexOf(sectionId);
    const targetProgress =
      targetIndex / Math.max(1, SCROLL_SECTIONS.length - 1);
    setActiveSection(sectionId);
    setScrollProgress(targetProgress);

    const scrollToTarget = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const targetY = targetProgress * docHeight;
      window.scrollTo({ top: targetY, behavior: 'auto' });
    };

    if (activeTab !== 'explore') {
      setActiveTab('explore');
      setTimeout(scrollToTarget, 50);
      return;
    }

    scrollToTarget();
  };

  const handleSelectPlanet = (
    id: CelestialId,
    openDossier: boolean = true,
    enterInterior: boolean = false
  ) => {
    setSelectedPlanetId(id);
    setSelectedMoonId(null);
    if (enterInterior) {
      setIsExploringInterior(true);
      const firstLayer = CELESTIAL_INTERIOR_MODELS[id]?.layers[0]?.id ?? null;
      setSelectedInteriorLayerId(firstLayer);
      setIsDossierOpen(true);
    } else {
      setIsExploringInterior(false);
      if (openDossier) {
        setIsDossierOpen(true);
      }
    }

    if (activeTab === 'explore') {
      const idx = SCROLL_SECTIONS.indexOf(id);
      if (idx >= 0) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const targetY =
          (idx / Math.max(1, SCROLL_SECTIONS.length - 1)) * docHeight;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const handleSelectMoon = (moonId: MoonId | null) => {
    setIsExploringInterior(false);
    if (!moonId) {
      setSelectedMoonId(null);
      return;
    }
    const moon = getMoonById(moonId);
    setSelectedPlanetId(moon.parentPlanetId);
    setSelectedMoonId(moonId);
    setIsDossierOpen(true);
    if (activeTab === 'explore') {
      const idx = SCROLL_SECTIONS.indexOf(moon.parentPlanetId);
      if (idx >= 0) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const targetY =
          (idx / Math.max(1, SCROLL_SECTIONS.length - 1)) * docHeight;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const handleToggleInteriorMode = (enable?: boolean) => {
    const targetPlanet =
      selectedPlanetId ??
      (activeSection !== 'overview-start' && activeSection !== 'overview-end'
        ? activeSection
        : 'earth');
    const nextState = enable !== undefined ? enable : !isExploringInterior;
    setSelectedPlanetId(targetPlanet);
    setSelectedMoonId(null);
    setIsExploringInterior(nextState);
    if (nextState) {
      const model = CELESTIAL_INTERIOR_MODELS[targetPlanet];
      if (
        !selectedInteriorLayerId ||
        !model.layers.some((l) => l.id === selectedInteriorLayerId)
      ) {
        setSelectedInteriorLayerId(model.layers[0]?.id ?? null);
      }
      setIsDossierOpen(true);
    }
  };

  const handleSelectInteriorLayer = (layerId: string) => {
    setSelectedInteriorLayerId(layerId);
    if (!isExploringInterior) {
      setIsExploringInterior(true);
    }
    if (!isDossierOpen) {
      setIsDossierOpen(true);
    }
  };

  const handleOpenInCompare = (id: CelestialId) => {
    if (id !== 'sun' && !comparePlanetIds.includes(id)) {
      const next =
        comparePlanetIds.length >= 4
          ? [...comparePlanetIds.slice(1), id]
          : [...comparePlanetIds, id];
      setComparePlanetIds(next);
    }
    setIsDossierOpen(false);
    setIsExploringInterior(false);
    setSelectedMoonId(null);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCycleSpeed = () => {
    const speeds = [0.5, 1, 2, 4];
    const nextIdx = (speeds.indexOf(orbitSpeedMultiplier) + 1) % speeds.length;
    setOrbitSpeedMultiplier(speeds[nextIdx]);
  };

  const isFa = lang === 'fa';
  const focusedMoon = selectedMoonId ? getMoonById(selectedMoonId) : null;
  const focusedMoonParent = focusedMoon
    ? getCelestialBody(focusedMoon.parentPlanetId)
    : null;

  return (
    <div className="min-h-screen bg-[#070a12] text-[#e0e2f1] relative overflow-x-hidden selection:bg-[#65d9ff] selection:text-[#003546]">
      {/* Persistent Three.js 3D Solar System Canvas */}
      <SolarSystemCanvas
        lang={lang}
        scrollProgress={scrollProgress}
        selectedPlanetId={selectedPlanetId}
        selectedMoonId={selectedMoonId}
        isDossierOpen={isDossierOpen}
        isExploringInterior={isExploringInterior}
        selectedInteriorLayerId={selectedInteriorLayerId}
        recenterSignal={recenterSignal}
        isPaused={isPaused}
        orbitSpeedMultiplier={orbitSpeedMultiplier}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showStarfield={showStarfield}
        highQualityGlow={highQualityGlow}
        activeTab={activeTab}
        comparePlanetIds={comparePlanetIds}
        onSelectPlanet={handleSelectPlanet}
        onSelectMoon={(mId) => handleSelectMoon(mId)}
        onSelectInteriorLayer={handleSelectInteriorLayer}
        onActiveSectionChange={setActiveSection}
      />

      {/* Top Stitch Observatory Header with Responsive Mobile/Tablet Hamburger Menu */}
      <Header
        lang={lang}
        activeTab={activeTab}
        activeSection={activeSection}
        isPaused={isPaused}
        orbitSpeedMultiplier={orbitSpeedMultiplier}
        showOrbits={showOrbits}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsDossierOpen(false);
          setIsExploringInterior(false);
          setSelectedMoonId(null);
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }}
        onJumpToSection={handleJumpToSection}
        onToggleLang={() => setLang((l) => (l === 'fa' ? 'en' : 'fa'))}
        onTogglePause={() => setIsPaused((p) => !p)}
        onCycleSpeed={handleCycleSpeed}
        onToggleOrbits={() => setShowOrbits((o) => !o)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Floating Moon Camera Lock Pill (when a 3D moon is focused and Dossier is closed) */}
      {focusedMoon && focusedMoonParent && !isDossierOpen && (
        <div className="fixed top-20 sm:top-24 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-[#0b0e18]/94 border border-[#65d9ff]/50 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: focusedMoon.color }}
            />
            <span className="font-bold text-[#e0e2f1]">
              {tText(focusedMoon.name, lang)}
            </span>
            <button
              type="button"
              onClick={() => setIsDossierOpen(true)}
              className="text-[#65d9ff] underline cursor-pointer font-bold"
            >
              {isFa ? 'مشاهده پرونده قمر' : 'Moon Dossier'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedMoonId(null)}
              className="px-2.5 py-1 rounded-full bg-[#171b26] text-[#f8c270] font-bold cursor-pointer"
            >
              {isFa
                ? `بازگشت به ${tText(focusedMoonParent.name, lang)}`
                : `Back to ${tText(focusedMoonParent.name, lang)}`}
            </button>
          </div>
        </div>
      )}

      {/* Orbital Station Teleport Rail (Visible on Desktop lg >= 1024px in 3D Explore Journey) */}
      {activeTab === 'explore' && (
        <SolarRail
          lang={lang}
          activeSection={activeSection}
          onJumpToSection={handleJumpToSection}
        />
      )}

      {/* VIEW 1: 3D Cinematic Scroll Journey (Explore) */}
      {activeTab === 'explore' && (
        <main
          className={`relative z-10 pointer-events-none transition-opacity duration-300 ${
            isDossierOpen ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* SECTION 0: Wide Establishing Shot of the Solar System */}
          <section
            id="section-overview-start"
            data-testid="section-overview-start"
            ref={(el) => {
              sectionRefs.current['overview-start'] = el;
            }}
            className="min-h-[100dvh] w-full flex flex-col justify-between pt-20 sm:pt-26 pb-5 sm:pb-10 px-3 sm:px-6 md:px-12 lg:ps-64"
          >
            {/* Top Floating Hero Intro Panel (Compact on Mobile so 3D Solar System is prominent) */}
            <div className="pointer-events-auto max-w-xl bg-[#0b0e18]/88 border border-[#424752]/35 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.75)] space-y-2.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#65d9ff]/12 border border-[#65d9ff]/30">
                <span className="w-2 h-2 rounded-full bg-[#65d9ff] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono-tech uppercase tracking-widest text-[#65d9ff]">
                  {isFa
                    ? 'شبیه‌ساز تعاملی منظومه شمسی • پایه نهم'
                    : 'INTERACTIVE 3D SOLAR SYSTEM • GRADE 9'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-[#e0e2f1] leading-[1.18]">
                {isFa ? (
                  <>
                    سفر سینمایی در{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#65d9ff] via-[#b2c5ff] to-[#f8c270]">
                      منظومه شمسی
                    </span>
                  </>
                ) : (
                  <>
                    Cinematic Journey Across the{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65d9ff] via-[#b2c5ff] to-[#f8c270]">
                      Solar System
                    </span>
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-[#c2c6d4] leading-relaxed">
                {isFa
                  ? 'با اسکرول به پایین، دوربین سه‌بعدی در فضای واقعی به سمت خورشید، هر هشت سیاره و قمرهای اصلی پرواز می‌کند. روی هر سیاره، قمر یا دکمه «ساختار داخلی ۳بعدی» کلیک کنید تا درون اجرام را کاوش کنید.'
                  : 'Scroll down to fly the 3D camera smoothly from the Sun across all eight planets and their moons. Click any planet, orbiting moon, or "Explore Interior 3D" to inspect internal cutaway layers.'}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  data-testid="start-journey-btn"
                  onClick={() => handleJumpToSection('sun', 1)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#65d9ff] text-[#003546] font-bold text-xs sm:text-sm hover:bg-[#9ee4ff] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_24px_rgba(101,217,255,0.3)]"
                >
                  <span>
                    {isFa ? 'آغاز پرواز از خورشید' : 'Begin Solar Flight'}
                  </span>
                  <span className="material-symbols-outlined text-base">
                    south
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPlanet('earth', false, false)}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#171b26] border border-[#65d9ff]/35 text-xs sm:text-sm font-bold text-[#e0e2f1] hover:border-[#65d9ff] transition-all cursor-pointer"
                >
                  {isFa ? 'پرواز به زمین و ماه' : 'Fly to Earth & Moon'}
                </button>
              </div>
            </div>

            {/* Bottom Quick Planet Bar & Scroll Prompt */}
            <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 bg-[#0b0e18]/88 border border-[#424752]/30 rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 max-w-4xl">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 max-w-full">
                {CELESTIAL_BODIES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    data-testid={`quick-jump-${b.id}`}
                    onClick={() =>
                      handleJumpToSection(
                        b.id,
                        SCROLL_SECTIONS.indexOf(b.id)
                      )
                    }
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#131620] hover:bg-[#65d9ff]/20 border border-[#424752]/30 hover:border-[#65d9ff]/50 text-xs font-bold text-[#e0e2f1] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: b.accentHex }}
                    />
                    <span>{tText(b.name, lang)}</span>
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex text-[11px] font-mono-tech text-[#65d9ff] items-center gap-1.5">
                <span className="material-symbols-outlined text-sm animate-bounce">
                  keyboard_double_arrow_down
                </span>
                <span>
                  {isFa ? 'اسکرول برای پرواز دوربین' : 'SCROLL TO FLY'}
                </span>
              </div>
            </div>
          </section>

          {/* SECTIONS 1..9: The Sun + All 8 Planets in Orbital Order (Synchronized Sticky Card + Camera Framing) */}
          {CELESTIAL_BODIES.map((body) => {
            const alignEnd = body.layoutAlignment === 'left';
            const isSectionActive = activeSection === body.id;
            return (
              <section
                key={body.id}
                id={`section-${body.id}`}
                data-testid={`section-${body.id}`}
                data-section-active={String(isSectionActive)}
                ref={(el) => {
                  sectionRefs.current[body.id] = el;
                }}
                className={`min-h-[100dvh] w-full flex items-end lg:items-center pt-20 pb-5 sm:pb-8 lg:py-24 px-3 sm:px-6 md:px-12 lg:ps-64 ${
                  alignEnd ? 'justify-end' : 'justify-start'
                }`}
              >
                <article
                  data-testid={`planet-card-${body.id}`}
                  className={`sticky bottom-4 lg:top-24 w-full max-w-lg bg-[#0b0e18]/92 border rounded-2xl p-3.5 sm:p-6 md:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.85)] space-y-2.5 sm:space-y-4 transition-all duration-300 ${
                    isSectionActive
                      ? 'pointer-events-auto opacity-100 translate-y-0 scale-100 border-[#65d9ff]/55'
                      : 'pointer-events-auto opacity-80 lg:opacity-75 translate-y-1 scale-[0.98] border-[#424752]/35 hover:opacity-100'
                  }`}
                >
                  {/* Top Station Badge & AU Distance */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#424752]/25 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: body.accentHex }}
                      />
                      <span className="font-mono-tech text-[11px] sm:text-xs text-[#65d9ff] uppercase tracking-wider">
                        {body.stationCode} // {body.auString}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#171b26] border border-[#f8c270]/35 text-[10px] sm:text-[11px] font-bold text-[#f8c270]">
                      {tText(body.badge, lang)}
                    </span>
                  </div>

                  {/* Planet Name & Concise Scientific Headline */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-[#e0e2f1]">
                        {tText(body.name, lang)}
                      </h2>
                      <span className="font-mono-tech text-[11px] text-[#8c919e] uppercase">
                        {body.englishName}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-[#65d9ff] mt-0.5">
                      {tText(body.headline, lang)}
                    </p>
                  </div>

                  {/* Scientific Description */}
                  <p className="text-xs sm:text-sm text-[#c2c6d4] leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {tText(body.description, lang)}
                  </p>

                  {/* 4 Key Measurements Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {body.keyMeasurements.map((m, mIdx) => {
                      const accentColor =
                        m.accent === 'primary'
                          ? 'text-[#65d9ff]'
                          : m.accent === 'secondary'
                            ? 'text-[#b2c5ff]'
                            : m.accent === 'tertiary'
                              ? 'text-[#f8c270]'
                              : 'text-[#e0e2f1]';
                      return (
                        <div
                          key={mIdx}
                          className="bg-[#131620] p-2.5 sm:p-3 rounded-xl border border-[#424752]/25"
                        >
                          <span className="text-[10px] text-[#8c919e] block mb-0.5 truncate">
                            {tText(m.label, lang)}
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-bold ltr-num block truncate ${accentColor}`}
                          >
                            {tText(m.value, lang)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Related 3D Moons Quick-Focus Controls (Earth–Moon & Planetary Satellites) */}
                  {body.moons3D.length > 0 && (
                    <div className="bg-[#131620] border border-[#65d9ff]/25 rounded-xl p-2.5 sm:p-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#b2c5ff] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-[#65d9ff]">
                            satellite_alt
                          </span>
                          <span>
                            {isFa
                              ? 'کاوش اقمار در مدار سه‌بعدی:'
                              : 'Explore 3D Orbiting Moons:'}
                          </span>
                        </span>
                        <span className="font-mono-tech text-[10px] text-[#8c919e]">
                          {body.moons3D.length} 3D
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {body.moons3D.map((moon) => (
                          <button
                            key={moon.id}
                            type="button"
                            data-testid={`section-moon-btn-${moon.id}`}
                            onClick={() => handleSelectMoon(moon.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#65d9ff]/20 border border-[#424752]/40 hover:border-[#65d9ff] text-xs font-bold text-[#e0e2f1] flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: moon.color }}
                            />
                            <span>{tText(moon.name, lang)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interesting Astronomical Fact Callout */}
                  <div
                    className={`${
                      body.moons3D.length > 0 ? 'hidden sm:block' : 'block'
                    } bg-[#171b26] border-s-2 border-[#f8c270] p-3 rounded-e-xl text-xs text-[#e0e2f1]/90 leading-relaxed`}
                  >
                    <span className="text-[#f8c270] font-bold block mb-0.5">
                      {isFa ? 'آیا می‌دانستید؟' : 'Did You Know?'}
                    </span>
                    {tText(body.funFact, lang)}
                  </div>

                  {/* Action Buttons: Scientific Dossier + 3D Interior Cutaway + Compare */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      data-testid={`open-dossier-${body.id}`}
                      onClick={() => handleSelectPlanet(body.id, true, false)}
                      className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#65d9ff] text-[#003546] font-bold text-xs sm:text-sm hover:bg-[#9ee4ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        travel_explore
                      </span>
                      <span>
                        {isFa ? 'پرونده کامل علمی' : 'Scientific Dossier'}
                      </span>
                    </button>

                    <button
                      type="button"
                      data-testid={`explore-interior-btn-${body.id}`}
                      onClick={() => handleSelectPlanet(body.id, true, true)}
                      className="py-2.5 px-3 rounded-xl bg-[#171b26] border border-[#f8c270]/50 text-xs sm:text-sm font-bold text-[#f8c270] hover:bg-[#f8c270] hover:text-[#1f1300] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        layers
                      </span>
                      <span>
                        {isFa ? 'ساختار داخلی ۳بعدی' : 'Explore Interior'}
                      </span>
                    </button>

                    {body.id !== 'sun' && (
                      <button
                        type="button"
                        onClick={() => handleOpenInCompare(body.id)}
                        className="py-2.5 px-3 rounded-xl bg-[#171b26] border border-[#424752]/40 text-xs font-bold text-[#c2c6d4] hover:text-[#65d9ff] hover:border-[#65d9ff]/40 transition-all cursor-pointer"
                        title={
                          isFa ? 'مقایسه با سایر سیارات' : 'Compare Planet'
                        }
                      >
                        <span className="material-symbols-outlined text-base">
                          compare_arrows
                        </span>
                      </button>
                    )}
                  </div>
                </article>
              </section>
            );
          })}

          {/* SECTION 10: Final Wide Solar System Overview & Next Steps */}
          <section
            id="section-overview-end"
            data-testid="section-overview-end"
            ref={(el) => {
              sectionRefs.current['overview-end'] = el;
            }}
            className="min-h-[100dvh] w-full flex flex-col justify-end pb-10 sm:pb-16 pt-24 px-3 sm:px-6 md:px-12 lg:ps-64"
          >
            <div className="pointer-events-auto max-w-3xl bg-[#0b0e18]/90 border border-[#65d9ff]/35 rounded-2xl p-5 sm:p-8 md:p-10 shadow-2xl space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 text-[#65d9ff] font-mono-tech text-xs">
                <span className="material-symbols-outlined text-base">
                  auto_awesome
                </span>
                <span>HELIOSPHERE OUTER HORIZON // 30+ AU</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-[#e0e2f1]">
                {isFa
                  ? 'پایان گشت مداری؛ آغاز تحلیل و سنجش علمی'
                  : 'Complete Solar System Overview'}
              </h2>

              <p className="text-xs sm:text-sm text-[#c2c6d4] leading-relaxed">
                {isFa
                  ? 'اکنون که هر هشت سیاره، قمرها، ساختار درونی و خورشید را در فضای سه‌بعدی بررسی کردید، می‌توانید سیارات را در ماتریس تله‌متری مقایسه کنید، درسنامه فصل ۱۰ علوم نهم را مرور نمایید یا دانش خود را در آزمون کیهانی بسنجید.'
                  : 'Having journeyed from the Sun’s thermonuclear core to Neptune’s supersonic ice winds, continue your exploration with side-by-side planetary comparison, Grade 9 syllabus modules, or the Cosmic Quiz.'}
              </p>

              <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('compare');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#65d9ff] text-[#003546] font-bold text-xs sm:text-sm hover:bg-[#9ee4ff] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    compare_arrows
                  </span>
                  <span>
                    {isFa ? 'ماتریس مقایسه سیارات' : 'Open Compare Matrix'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('learn');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#171b26] border border-[#b2c5ff]/40 text-[#b2c5ff] font-bold text-xs sm:text-sm hover:bg-[#b2c5ff]/15 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    menu_book
                  </span>
                  <span>
                    {isFa ? 'درسنامه علوم پایه نهم' : 'Grade 9 Syllabus'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('quiz');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#171b26] border border-[#f8c270]/40 text-[#f8c270] font-bold text-xs sm:text-sm hover:bg-[#f8c270]/15 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    quiz
                  </span>
                  <span>{isFa ? 'آزمون کیهانی' : 'Take Cosmic Quiz'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleJumpToSection('overview-start', 0)}
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#131620] border border-[#424752]/40 text-[#c2c6d4] text-xs font-bold hover:text-white transition-all cursor-pointer"
                >
                  {isFa ? '↑ بازگشت به ابتدای سفر' : '↑ Back to Top'}
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: Planetary Comparative Matrix */}
      {activeTab === 'compare' && (
        <CompareView
          lang={lang}
          selectedIds={comparePlanetIds}
          onChangeSelectedIds={setComparePlanetIds}
          onInspectIn3D={(id) => {
            setActiveTab('explore');
            setTimeout(() => {
              handleSelectPlanet(id, true, false);
            }, 80);
          }}
        />
      )}

      {/* VIEW 3: Grade 9 Chapter 10 Astronomy Syllabus */}
      {activeTab === 'learn' && (
        <LearnView
          lang={lang}
          onStartQuiz={() => {
            setActiveTab('quiz');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReturnTo3D={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW 4: Cosmic Quiz Assessment */}
      {activeTab === 'quiz' && (
        <QuizView
          lang={lang}
          onInspectPlanetIn3D={(id) => {
            setActiveTab('explore');
            setTimeout(() => {
              handleSelectPlanet(id, true, false);
            }, 80);
          }}
        />
      )}

      {/* Slide-out Scientific Planet, Moon & 3D Interior Cutaway Dossier Drawer */}
      <PlanetDossierDrawer
        lang={lang}
        planetId={selectedPlanetId}
        selectedMoonId={selectedMoonId}
        isOpen={isDossierOpen}
        isExploringInterior={isExploringInterior}
        selectedInteriorLayerId={selectedInteriorLayerId}
        onClose={() => {
          setIsDossierOpen(false);
          setIsExploringInterior(false);
          setSelectedMoonId(null);
        }}
        onSelectPlanet={(id) => handleSelectPlanet(id, true, isExploringInterior)}
        onSelectMoon={handleSelectMoon}
        onToggleInteriorMode={handleToggleInteriorMode}
        onSelectInteriorLayer={handleSelectInteriorLayer}
        onRecenterCamera={() => setRecenterSignal((s) => s + 1)}
        onReturnToOverview={() => handleJumpToSection('overview-start', 0)}
        onOpenInCompare={handleOpenInCompare}
      />

      {/* Observatory Settings Modal */}
      <SettingsModal
        lang={lang}
        isOpen={isSettingsOpen}
        isPaused={isPaused}
        orbitSpeedMultiplier={orbitSpeedMultiplier}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showStarfield={showStarfield}
        highQualityGlow={highQualityGlow}
        onClose={() => setIsSettingsOpen(false)}
        onToggleLang={() => setLang((l) => (l === 'fa' ? 'en' : 'fa'))}
        onTogglePause={() => setIsPaused((p) => !p)}
        onChangeSpeed={(spd) => setOrbitSpeedMultiplier(spd)}
        onToggleOrbits={() => setShowOrbits((o) => !o)}
        onToggleLabels={() => setShowLabels((lb) => !lb)}
        onToggleStarfield={() => setShowStarfield((sf) => !sf)}
        onToggleGlow={() => setHighQualityGlow((gl) => !gl)}
      />
    </div>
  );
}
