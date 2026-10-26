import React from 'react';
import { Language } from '../data/solarSystemData.ts';

export interface SettingsModalProps {
  lang: Language;
  isOpen: boolean;
  isPaused: boolean;
  orbitSpeedMultiplier: number;
  showOrbits: boolean;
  showLabels: boolean;
  showStarfield: boolean;
  highQualityGlow: boolean;
  onClose: () => void;
  onToggleLang: () => void;
  onTogglePause: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onToggleStarfield: () => void;
  onToggleGlow: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  lang,
  isOpen,
  isPaused,
  orbitSpeedMultiplier,
  showOrbits,
  showLabels,
  showStarfield,
  highQualityGlow,
  onClose,
  onToggleLang,
  onTogglePause,
  onChangeSpeed,
  onToggleOrbits,
  onToggleLabels,
  onToggleStarfield,
  onToggleGlow,
}) => {
  if (!isOpen) return null;

  const isFa = lang === 'fa';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      data-testid="settings-modal"
    >
      <div className="bg-[#0b0e18] border border-[#65d9ff]/40 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between border-b border-[#424752]/30 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#65d9ff]">
              tune
            </span>
            <h2 className="text-lg font-black text-[#e0e2f1]">
              {isFa
                ? 'تنظیمات موتور سه‌بعدی و رصدخانه'
                : '3D Observatory & Simulation Settings'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#c2c6d4] hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm">
          {/* Language Switcher */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25">
            <div>
              <div className="font-bold text-[#e0e2f1]">
                {isFa ? 'زبان رابط کاربری و جهت صفحه' : 'Interface Language'}
              </div>
              <div className="text-xs text-[#8c919e]">
                {isFa ? 'فارسی (راست‌به‌چپ)' : 'English (Left-to-Right)'}
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleLang}
              className="px-4 py-2 rounded-lg bg-[#65d9ff]/15 border border-[#65d9ff]/40 text-[#65d9ff] font-bold cursor-pointer"
            >
              {isFa ? 'Switch to English' : 'تغییر به فارسی'}
            </button>
          </div>

          {/* Orbital Speed */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25">
            <div>
              <div className="font-bold text-[#e0e2f1]">
                {isFa ? 'سرعت شبیه‌سازی مداری' : 'Orbital Simulation Speed'}
              </div>
              <div className="text-xs text-[#8c919e]">
                {isFa
                  ? 'تنظیم سرعت چرخش وضعی و انتقالی سیارات'
                  : 'Adjust planetary orbital and axial rotation rate'}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeSpeed(spd)}
                  className={`px-2.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold cursor-pointer ${
                    orbitSpeedMultiplier === spd
                      ? 'bg-[#65d9ff] text-[#003546]'
                      : 'bg-[#1f232e] text-[#c2c6d4]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onTogglePause}
              className="p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25 flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold text-[#e0e2f1]">
                {isFa ? 'حرکت مداری زنده' : 'Orbital Animation'}
              </span>
              <span className="font-mono-tech text-xs text-[#65d9ff]">
                {isPaused ? 'PAUSED' : 'ACTIVE'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleOrbits}
              className="p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25 flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold text-[#e0e2f1]">
                {isFa ? 'خطوط مدار سیارات' : 'Orbital Trajectories'}
              </span>
              <span className="font-mono-tech text-xs text-[#65d9ff]">
                {showOrbits ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleLabels}
              className="p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25 flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold text-[#e0e2f1]">
                {isFa ? 'برچسب‌های هوشمند ۳بعدی' : '3D Hover Telemetry'}
              </span>
              <span className="font-mono-tech text-xs text-[#65d9ff]">
                {showLabels ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleStarfield}
              className="p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25 flex items-center justify-between cursor-pointer"
            >
              <span className="font-bold text-[#e0e2f1]">
                {isFa ? 'ستارگان پس‌زمینه کهکشان' : 'Deep Space Starfield'}
              </span>
              <span className="font-mono-tech text-xs text-[#65d9ff]">
                {showStarfield ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleGlow}
              className="p-3.5 rounded-xl bg-[#131620] border border-[#424752]/25 flex items-center justify-between cursor-pointer sm:col-span-2"
            >
              <span className="font-bold text-[#e0e2f1]">
                {isFa
                  ? 'درخشش تاج خورشیدی و هاله اتمسفری سیارات'
                  : 'Solar Corona & Atmospheric Rim Shaders'}
              </span>
              <span className="font-mono-tech text-xs text-[#65d9ff]">
                {highQualityGlow ? 'HIGH' : 'STANDARD'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#65d9ff] text-[#003546] text-xs font-bold hover:bg-[#9ee4ff] cursor-pointer"
          >
            {isFa ? 'ذخیره و بازگشت' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
