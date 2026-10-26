import React, { useEffect, useRef, useState } from 'react';
import {
  CELESTIAL_BODIES,
  Language,
  SCROLL_SECTIONS,
  ScrollSectionId,
} from '../data/solarSystemData.ts';
import { tText } from '../utils/astronomyMath.ts';

export type ActiveTab = 'explore' | 'compare' | 'learn' | 'quiz';

export interface HeaderProps {
  lang: Language;
  activeTab: ActiveTab;
  activeSection: ScrollSectionId;
  isPaused: boolean;
  orbitSpeedMultiplier: number;
  showOrbits: boolean;
  onTabChange: (tab: ActiveTab) => void;
  onJumpToSection: (sectionId: ScrollSectionId, index: number) => void;
  onToggleLang: () => void;
  onTogglePause: () => void;
  onCycleSpeed: () => void;
  onToggleOrbits: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  activeTab,
  activeSection,
  isPaused,
  orbitSpeedMultiplier,
  showOrbits,
  onTabChange,
  onJumpToSection,
  onToggleLang,
  onTogglePause,
  onCycleSpeed,
  onToggleOrbits,
  onOpenSettings,
}) => {
  const isFa = lang === 'fa';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const navItems: Array<{
    id: ActiveTab;
    labelFa: string;
    labelEn: string;
    descFa: string;
    descEn: string;
    icon: string;
  }> = [
    {
      id: 'explore',
      labelFa: 'کاوش سه‌بعدی سیارات',
      labelEn: '3D Solar Journey',
      descFa: 'پرواز تعاملی در منظومه شمسی و قمرها',
      descEn: 'Interactive 3D Solar System & moons flight',
      icon: 'public',
    },
    {
      id: 'compare',
      labelFa: 'بررسی و مقایسه',
      labelEn: 'Compare Matrix',
      descFa: 'مقایسه همزمان ۲ تا ۴ سیاره و ابعاد',
      descEn: 'Side-by-side telemetry for 2–4 planets',
      icon: 'compare_arrows',
    },
    {
      id: 'learn',
      labelFa: 'آموزش پایه ۹',
      labelEn: 'Grade 9 Syllabus',
      descFa: 'درسنامه فصل ۱۰ علوم تجربی و فلش‌کارت',
      descEn: 'Chapter 10 astronomy modules & flashcards',
      icon: 'menu_book',
    },
    {
      id: 'quiz',
      labelFa: 'آزمون کیهانی',
      labelEn: 'Cosmic Quiz',
      descFa: 'سنجش تعاملی دانش نجومی و کارنامه',
      descEn: 'Interactive astronomy assessment & XP',
      icon: 'quiz',
    },
  ];

  // Close mobile menu on Escape key and when resizing to desktop breakpoint (>= 1024px)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  const getStationLabel = (secId: ScrollSectionId) => {
    if (secId === 'overview-start') {
      return {
        label: isFa ? 'نمای کلی منظومه' : 'System Overview',
        sub: '0–30 AU',
        color: '#65d9ff',
      };
    }
    if (secId === 'overview-end') {
      return {
        label: isFa ? 'افق پایانی منظومه' : 'Outer Horizon',
        sub: 'Heliosphere',
        color: '#b2c5ff',
      };
    }
    const body = CELESTIAL_BODIES.find((b) => b.id === secId)!;
    return {
      label: tText(body.name, lang),
      sub: body.auString,
      color: body.accentHex,
    };
  };

  const handleMobileNavSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const handleMobileStationSelect = (secId: ScrollSectionId, idx: number) => {
    onJumpToSection(secId, idx);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-16 sm:h-20 bg-[#070a12]/94 border-b border-[#424752]/30 shadow-[0_12px_36px_rgba(0,0,0,0.65)] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              onTabChange('explore');
              setIsMobileMenuOpen(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#65d9ff]/12 border border-[#65d9ff]/35 flex items-center justify-center text-[#65d9ff] hover:bg-[#65d9ff]/20 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#65d9ff]"
            title={
              isFa ? 'بازگشت به نمای کلی منظومه' : 'Return to Solar System'
            }
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">
              orbit
            </span>
          </button>
          <div className="min-w-0">
            <div className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-[#e0e2f1] flex items-center gap-2 truncate">
              <span className="truncate">
                {isFa ? 'کاوشگر فضا' : 'Space Explorer'}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-[#65d9ff]/12 text-[#65d9ff] border border-[#65d9ff]/25 shrink-0">
                WEBGL 3D
              </span>
            </div>
            <p className="text-[10px] text-[#c2c6d4]/75 hidden md:block truncate">
              {isFa
                ? 'رصدخانه تعاملی منظومه شمسی • علوم تجربی پایه نهم'
                : 'Interactive 3D Solar System Observatory • Grade 9 Astronomy'}
            </p>
          </div>
        </div>

        {/* Desktop Main Navigation Tabs (Visible on lg >= 1024px) */}
        <nav
          aria-label={isFa ? 'ناوبری اصلی دسکتاپ' : 'Desktop Main Navigation'}
          className="hidden lg:flex items-center gap-1.5 bg-[#131620] p-1 rounded-xl border border-[#424752]/25"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 py-2 rounded-lg text-xs xl:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff] ${
                  active
                    ? 'bg-[#65d9ff]/15 text-[#65d9ff] border border-[#65d9ff]/40 shadow-[0_0_16px_rgba(101,217,255,0.2)]'
                    : 'text-[#c2c6d4]/75 hover:text-[#e0e2f1] hover:bg-[#1f232e]/60 border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                <span>{isFa ? item.labelFa : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right/Left Controls + Mobile/Tablet Hamburger Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Pause / Resume Orbital Motion */}
          <button
            type="button"
            data-testid="toggle-pause-btn"
            onClick={onTogglePause}
            className={`px-2.5 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff] ${
              isPaused
                ? 'bg-[#f8c270]/15 border-[#f8c270]/45 text-[#f8c270]'
                : 'bg-[#171b26] border-[#424752]/30 text-[#c2c6d4] hover:border-[#65d9ff]/40 hover:text-[#65d9ff]'
            }`}
            title={
              isFa
                ? isPaused
                  ? 'ادامه حرکت مداری'
                  : 'توقف حرکت مداری'
                : isPaused
                  ? 'Resume Orbits'
                  : 'Pause Orbits'
            }
          >
            <span className="material-symbols-outlined text-base">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            <span className="hidden xl:inline">
              {isFa
                ? isPaused
                  ? 'ادامه'
                  : 'توقف'
                : isPaused
                  ? 'Play'
                  : 'Pause'}
            </span>
          </button>

          {/* Orbital Speed Multiplier (Desktop & Tablet) */}
          <button
            type="button"
            data-testid="cycle-speed-btn"
            onClick={onCycleSpeed}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 min-h-[38px] rounded-lg bg-[#171b26] border border-[#424752]/30 text-xs font-mono-tech text-[#b2c5ff] hover:border-[#b2c5ff]/45 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff]"
            title={
              isFa ? 'تغییر سرعت شبیه‌سازی مداری' : 'Cycle simulation speed'
            }
          >
            <span className="material-symbols-outlined text-sm">speed</span>
            <span>{orbitSpeedMultiplier}x</span>
          </button>

          {/* Toggle Orbital Lines (Desktop) */}
          <button
            type="button"
            data-testid="toggle-orbits-btn"
            onClick={onToggleOrbits}
            className={`hidden lg:flex p-2 min-h-[38px] items-center justify-center rounded-lg border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff] ${
              showOrbits
                ? 'bg-[#65d9ff]/15 border-[#65d9ff]/40 text-[#65d9ff]'
                : 'bg-[#171b26] border-[#424752]/30 text-[#c2c6d4]/60'
            }`}
            title={
              isFa ? 'نمایش یا پنهان کردن خطوط مدار' : 'Toggle Orbit Lines'
            }
          >
            <span className="material-symbols-outlined text-lg">
              track_changes
            </span>
          </button>

          {/* Bilingual FA / EN Switcher */}
          <button
            type="button"
            data-testid="lang-toggle-btn"
            onClick={onToggleLang}
            className="px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg bg-[#1f232e] border border-[#65d9ff]/35 text-xs font-mono-tech font-bold text-[#e0e2f1] hover:bg-[#65d9ff]/20 hover:border-[#65d9ff] transition-all flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff]"
            title={
              isFa ? 'Switch to English (LTR)' : 'تغییر زبان به فارسی (RTL)'
            }
          >
            <span className="material-symbols-outlined text-sm text-[#65d9ff]">
              language
            </span>
            <span>{isFa ? 'EN' : 'فا'}</span>
          </button>

          {/* Settings Button (Desktop) */}
          <button
            type="button"
            data-testid="open-settings-btn"
            onClick={onOpenSettings}
            className="hidden sm:flex p-2 min-h-[38px] items-center justify-center rounded-lg bg-[#171b26] border border-[#424752]/30 text-[#c2c6d4] hover:text-[#65d9ff] hover:border-[#65d9ff]/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff]"
            title={isFa ? 'تنظیمات رصدخانه' : 'Observatory Settings'}
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>

          {/* Mobile & Tablet Hamburger Menu Button (< 1024px) */}
          <button
            ref={toggleBtnRef}
            type="button"
            data-testid="mobile-menu-toggle"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              isFa
                ? isMobileMenuOpen
                  ? 'بستن منوی ناوبری'
                  : 'باز کردن منوی ناوبری'
                : isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
            }
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`lg:hidden w-10 h-10 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff] ${
              isMobileMenuOpen
                ? 'bg-[#65d9ff]/20 border-[#65d9ff] text-[#65d9ff]'
                : 'bg-[#171b26] border-[#424752]/40 text-[#e0e2f1] hover:border-[#65d9ff]/50'
            }`}
          >
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-200 ${
                isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-opacity duration-200 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-200 ${
                isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Slide-Down Navigation Drawer (< 1024px) */}
      {isMobileMenuOpen && (
        <div
          data-testid="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 lg:hidden flex flex-col bg-black/55"
        >
          {/* Slide-down Navigation Panel */}
          <div
            id="mobile-navigation-drawer"
            ref={menuPanelRef}
            data-testid="mobile-navigation-drawer"
            role="dialog"
            aria-modal="false"
            onClick={(e) => e.stopPropagation()}
            aria-label={
              isFa ? 'منوی ناوبری و ایستگاه‌های مداری' : 'Navigation & Orbital Stations Menu'
            }
            className="relative z-10 mt-16 sm:mt-20 mx-3 sm:mx-6 max-h-[75dvh] overflow-y-auto bg-[#0b0e18]/96 border border-[#65d9ff]/35 rounded-2xl p-4 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.9)] space-y-5"
          >
            {/* Panel Header with Explicit Close Button */}
            <div className="flex items-center justify-between border-b border-[#424752]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#65d9ff] animate-pulse" />
                <span className="text-xs font-mono-tech uppercase tracking-wider text-[#65d9ff]">
                  {isFa ? 'مرکز فرماندهی ناوبری' : 'NAVIGATION COMMAND'}
                </span>
              </div>
              <button
                type="button"
                data-testid="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-[#171b26] border border-[#424752]/40 text-xs font-bold text-[#c2c6d4] hover:text-white flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff]"
              >
                <span className="material-symbols-outlined text-base">
                  close
                </span>
                <span>{isFa ? 'بستن' : 'Close'}</span>
              </button>
            </div>

            {/* Primary Views (4 Destinations) */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#8c919e] px-1">
                {isFa ? 'بخش‌های اصلی برنامه' : 'Primary Destinations'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-testid={`mobile-nav-${item.id}`}
                      onClick={() => handleMobileNavSelect(item.id)}
                      className={`w-full p-3 rounded-xl border text-start flex items-center gap-3 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff] ${
                        active
                          ? 'bg-[#65d9ff]/18 border-[#65d9ff] text-[#e0e2f1]'
                          : 'bg-[#131620] border-[#424752]/25 text-[#c2c6d4] hover:border-[#65d9ff]/40'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-[#65d9ff] text-[#003546]'
                            : 'bg-[#1f232e] text-[#65d9ff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {item.icon}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-[#e0e2f1] truncate">
                          {isFa ? item.labelFa : item.labelEn}
                        </div>
                        <div className="text-[11px] text-[#8c919e] truncate">
                          {isFa ? item.descFa : item.descEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orbital Stations Teleport Grid (Replaces Desktop SolarRail on Mobile/Tablet) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-[#8c919e]">
                  {isFa
                    ? 'پرش مستقیم به ایستگاه‌های مداری (۱۱ ایستگاه)'
                    : 'Orbital Station Teleport (11 Waypoints)'}
                </span>
                <span className="text-[10px] font-mono-tech text-[#65d9ff]">
                  {SCROLL_SECTIONS.indexOf(activeSection) + 1}/
                  {SCROLL_SECTIONS.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SCROLL_SECTIONS.map((secId, idx) => {
                  const meta = getStationLabel(secId);
                  const isActive =
                    activeTab === 'explore' && activeSection === secId;
                  return (
                    <button
                      key={secId}
                      type="button"
                      data-testid={`mobile-station-${secId}`}
                      onClick={() => handleMobileStationSelect(secId, idx)}
                      className={`px-3 py-2.5 rounded-xl border text-start flex items-center justify-between gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#65d9ff] ${
                        isActive
                          ? 'bg-[#65d9ff]/18 border-[#65d9ff] text-[#e0e2f1]'
                          : 'bg-[#131620] border-[#424752]/25 text-[#c2c6d4] hover:border-[#65d9ff]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="text-xs font-bold truncate">
                          {meta.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-[#8c919e] shrink-0">
                        {meta.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Simulation Controls Strip */}
            <div className="pt-3 border-t border-[#424752]/30 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCycleSpeed}
                  className="px-3 py-2 rounded-lg bg-[#171b26] border border-[#424752]/35 text-xs font-mono-tech text-[#b2c5ff] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    speed
                  </span>
                  <span>
                    {isFa ? 'سرعت:' : 'Speed:'} {orbitSpeedMultiplier}x
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onToggleOrbits}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    showOrbits
                      ? 'bg-[#65d9ff]/15 border-[#65d9ff]/45 text-[#65d9ff]'
                      : 'bg-[#171b26] border-[#424752]/35 text-[#8c919e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    track_changes
                  </span>
                  <span>{isFa ? 'خطوط مدار' : 'Orbits'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="px-3.5 py-2 rounded-lg bg-[#1f232e] border border-[#65d9ff]/35 text-xs font-bold text-[#e0e2f1] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#65d9ff]">
                  settings
                </span>
                <span>{isFa ? 'تنظیمات پیشرفته' : 'Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
