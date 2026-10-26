import React from 'react';
import {
  CELESTIAL_BODIES,
  Language,
  SCROLL_SECTIONS,
  ScrollSectionId,
} from '../data/solarSystemData.ts';
import { tText } from '../utils/astronomyMath.ts';

export interface SolarRailProps {
  lang: Language;
  activeSection: ScrollSectionId;
  onJumpToSection: (sectionId: ScrollSectionId, index: number) => void;
}

export const SolarRail: React.FC<SolarRailProps> = ({
  lang,
  activeSection,
  onJumpToSection,
}) => {
  const isFa = lang === 'fa';

  const getStationMeta = (secId: ScrollSectionId) => {
    if (secId === 'overview-start') {
      return {
        label: isFa ? 'نمای کلی منظومه' : 'System Overview',
        sub: '0.0–30 AU',
        color: '#65d9ff',
        isStar: false,
      };
    }
    if (secId === 'overview-end') {
      return {
        label: isFa ? 'افق پایانی منظومه' : 'Outer Horizon',
        sub: 'Heliosphere',
        color: '#b2c5ff',
        isStar: false,
      };
    }
    const body = CELESTIAL_BODIES.find((b) => b.id === secId)!;
    return {
      label: tText(body.name, lang),
      sub: body.auString,
      color: body.accentHex,
      isStar: body.id === 'sun',
    };
  };

  return (
    <aside
      aria-label={isFa ? 'ایستگاه‌های مداری' : 'Orbital Stations'}
      className={`fixed top-24 bottom-8 z-40 hidden lg:flex flex-col justify-between w-52 bg-[#0b0e18]/88 border border-[#424752]/30 rounded-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] ${
        isFa ? 'right-5' : 'left-5'
      }`}
    >
      <div className="px-2 pb-2 border-b border-[#424752]/25 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#65d9ff] block">
            ORBITAL TELEPORT
          </span>
          <h2 className="text-xs font-bold text-[#e0e2f1]">
            {isFa ? 'ایستگاه‌های مداری' : 'Solar Stations'}
          </h2>
        </div>
        <span className="material-symbols-outlined text-[#65d9ff] text-base">
          explore
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2 overflow-y-auto space-y-0.5">
        {SCROLL_SECTIONS.map((secId, idx) => {
          const meta = getStationMeta(secId);
          const isActive = activeSection === secId;
          return (
            <button
              key={secId}
              type="button"
              data-testid={`rail-station-${secId}`}
              onClick={() => onJumpToSection(secId, idx)}
              className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-start transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#65d9ff]/15 border border-[#65d9ff]/40 text-[#e0e2f1]'
                  : 'hover:bg-[#171b26] border border-transparent text-[#c2c6d4]/70 hover:text-[#e0e2f1]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`rounded-full shrink-0 transition-transform ${
                    meta.isStar ? 'w-3 h-3' : 'w-2 h-2'
                  } ${isActive ? 'scale-125 ring-4 ring-[#65d9ff]/20' : 'opacity-75 group-hover:opacity-100'}`}
                  style={{ backgroundColor: meta.color }}
                />
                <span className="text-xs font-bold truncate">{meta.label}</span>
              </div>
              <span
                className={`text-[10px] font-mono-tech shrink-0 ${
                  isActive ? 'text-[#65d9ff] font-bold' : 'text-[#8c919e]'
                }`}
              >
                {meta.sub}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-[#424752]/25 px-2 flex items-center justify-between text-[10px] text-[#8c919e]">
        <span>{isFa ? 'اسکرول یا کلیک کنید' : 'Scroll or click'}</span>
        <span className="font-mono-tech text-[#65d9ff]">
          {SCROLL_SECTIONS.indexOf(activeSection) + 1}/{SCROLL_SECTIONS.length}
        </span>
      </div>
    </aside>
  );
};
