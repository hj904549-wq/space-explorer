import React, { useState } from 'react';
import {
  CELESTIAL_BODIES,
  CelestialId,
  Language,
} from '../data/solarSystemData.ts';
import {
  getCelestialBody,
  toggleComparePlanetSelection,
  tText,
} from '../utils/astronomyMath.ts';

export interface CompareViewProps {
  lang: Language;
  selectedIds: CelestialId[];
  onChangeSelectedIds: (next: CelestialId[]) => void;
  onInspectIn3D: (id: CelestialId) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  lang,
  selectedIds,
  onChangeSelectedIds,
  onInspectIn3D,
}) => {
  const isFa = lang === 'fa';
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const planetsOnly = CELESTIAL_BODIES.filter((b) => b.id !== 'sun');
  const comparedBodies = selectedIds.map((id) => getCelestialBody(id));

  const handleTogglePlanet = (id: CelestialId) => {
    const res = toggleComparePlanetSelection(selectedIds, id);
    if (res.status === 'min-limit') {
      setFeedbackMsg(
        isFa
          ? 'حداقل ۲ سیاره باید برای مقایسه همزمان انتخاب شده باشند.'
          : 'At least 2 planets must remain selected for comparison.'
      );
      return;
    }
    if (res.status === 'max-limit') {
      setFeedbackMsg(
        isFa
          ? 'حداکثر ۴ سیاره را می‌توانید همزمان در جدول مقایسه قرار دهید.'
          : 'Maximum of 4 planets can be compared simultaneously.'
      );
      return;
    }
    setFeedbackMsg(null);
    onChangeSelectedIds(res.nextIds);
  };

  return (
    <div
      className="relative z-20 pt-20 sm:pt-24 lg:pt-28 pb-20 px-4 md:px-10 max-w-7xl mx-auto space-y-8 md:space-y-10"
      data-testid="compare-view"
    >
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#0b0e18]/90 border border-[#424752]/30 p-6 md:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#65d9ff]">
            <span className="w-2 h-2 rounded-full bg-[#65d9ff] animate-pulse" />
            <span className="text-xs font-mono-tech uppercase tracking-widest">
              OBSERVATORY TELEMETRY // MATRIX V4.2
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#e0e2f1]">
            {isFa
              ? 'ماتریس مقایسه‌ای سیارات'
              : 'Planetary Comparative Matrix'}
          </h1>
          <p className="text-sm text-[#c2c6d4] max-w-2xl leading-relaxed">
            {isFa
              ? 'تحلیل مستقیم و هم‌تراز پارامترهای فیزیکی، مداری و ترکیبات اتمسفری سیارات منظومه شمسی بر اساس داده‌های مرجع علوم پایه نهم.'
              : 'Side-by-side physical, orbital, and atmospheric telemetry comparison across the eight planets of our Solar System.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeSelectedIds(['earth', 'mars', 'jupiter'])}
            className="px-4 py-2 rounded-xl bg-[#171b26] border border-[#424752]/40 text-xs font-bold text-[#c2c6d4] hover:text-[#65d9ff] transition-all cursor-pointer"
          >
            {isFa ? 'بازنشانی پیش‌فرض' : 'Reset Default'}
          </button>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 rounded-xl bg-[#65d9ff] text-[#003546] text-xs font-bold hover:bg-[#9ee4ff] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              summarize
            </span>
            <span>{isFa ? 'خروجی گزارش علمی' : 'Export Telemetry'}</span>
          </button>
        </div>
      </header>

      {/* Planet Selector Strip (2 to 4 Planets) */}
      <section className="bg-[#0b0e18]/92 border border-[#424752]/30 p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#c2c6d4] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#65d9ff]">
              tune
            </span>
            <span>
              {isFa
                ? 'انتخاب سیارات جهت مقایسه (حداقل ۲ و حداکثر ۴ سیاره):'
                : 'Select Planets to Compare (Min 2, Max 4):'}
            </span>
          </span>
          <span className="text-xs font-mono-tech text-[#65d9ff]">
            {selectedIds.length} / 4 SELECTED
          </span>
        </div>

        {feedbackMsg && (
          <div className="bg-[#f8c270]/15 border border-[#f8c270]/45 text-[#f8c270] text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="text-xs underline cursor-pointer"
            >
              {isFa ? 'بستن' : 'Dismiss'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {planetsOnly.map((p) => {
            const active = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                data-testid={`compare-select-${p.id}`}
                onClick={() => handleTogglePlanet(p.id)}
                className={`p-3 rounded-xl border text-start transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#65d9ff]/15 border-[#65d9ff] shadow-[0_0_20px_rgba(101,217,255,0.2)]'
                    : 'bg-[#131620] border-[#424752]/25 opacity-65 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: p.accentHex }}
                  />
                  <span className="material-symbols-outlined text-base text-[#65d9ff]">
                    {active ? 'check_circle' : 'add_circle_outline'}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#e0e2f1]">
                    {tText(p.name, lang)}
                  </div>
                  <div className="text-[10px] font-mono-tech text-[#8c919e]">
                    {p.auString}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Relative Visual Scale Stage */}
      <section className="bg-[#0b0e18]/92 border border-[#424752]/30 p-6 md:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono-tech text-[#65d9ff] uppercase">
              EQUATORIAL DIAMETER RATIO
            </span>
            <h2 className="text-lg font-bold text-[#e0e2f1]">
              {isFa
                ? 'مقایسه بصری مقیاس و ابعاد سیارات انتخاب‌شده'
                : 'Relative Planetary Scale Comparison'}
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-[#8c919e]">
            EARTH = 1.00x
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end py-6 min-h-[220px]">
          {comparedBodies.map((body) => {
            // Map relativeScaleEarth (0.38 to 10.97) to visual circle diameter (32px to 148px)
            const pxSize = Math.max(
              32,
              Math.min(148, Math.round(Math.pow(body.relativeScaleEarth, 0.58) * 44))
            );
            return (
              <div
                key={body.id}
                className="flex flex-col items-center justify-end gap-4 p-4 rounded-xl bg-[#131620]/90 border border-[#424752]/20"
              >
                <div className="h-40 flex items-center justify-center">
                  <div
                    onClick={() => onInspectIn3D(body.id)}
                    title={
                      isFa ? 'مشاهده در نمای سه‌بعدی' : 'Inspect in 3D Scene'
                    }
                    className="rounded-full cursor-pointer transition-transform hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                    style={{
                      width: `${pxSize}px`,
                      height: `${pxSize}px`,
                      background: `radial-gradient(circle at 32% 30%, #ffffff55, ${body.accentHex} 55%, #050811 95%)`,
                      boxShadow: `0 0 28px ${body.accentHex}33`,
                    }}
                  />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-base font-black text-[#e0e2f1]">
                    {tText(body.name, lang)}
                  </div>
                  <div className="text-xs font-mono-tech text-[#65d9ff]">
                    {body.relativeScaleEarth}x {isFa ? 'زمین' : 'Earth'}
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectIn3D(body.id)}
                    className="mt-1 text-[11px] text-[#b2c5ff] hover:text-[#65d9ff] underline cursor-pointer"
                  >
                    {isFa ? 'پرش دوربین ۳بعدی به سیاره' : 'Focus 3D Camera'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8-Row Telemetry Matrix Table */}
      <section className="bg-[#0b0e18]/94 border border-[#424752]/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-[#171b26] border-b border-[#424752]/35">
                <th className="p-4 md:p-5 text-xs font-mono-tech uppercase text-[#65d9ff] w-1/4">
                  {isFa ? 'شاخص فیزیکی / مداری' : 'Telemetry Parameter'}
                </th>
                {comparedBodies.map((b) => (
                  <th
                    key={b.id}
                    className="p-4 md:p-5 text-sm font-black text-[#e0e2f1]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: b.accentHex }}
                      />
                      <span>{tText(b.name, lang)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424752]/20 text-xs md:text-sm">
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'رده سیاره‌ای' : 'Planetary Class'}
                </td>
                {comparedBodies.map((b) => (
                  <td key={b.id} className="p-4 text-[#65d9ff] font-bold">
                    {tText(b.categoryLabel, lang)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'قطر استوایی (کیلومتر)' : 'Equatorial Diameter'}
                </td>
                {comparedBodies.map((b) => (
                  <td
                    key={b.id}
                    className="p-4 font-mono-tech text-[#e0e2f1] ltr-num"
                  >
                    {tText(b.diameterString, lang)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'فاصله میانگین از خورشید' : 'Distance from Sun'}
                </td>
                {comparedBodies.map((b) => (
                  <td key={b.id} className="p-4">
                    <div className="font-bold text-[#e0e2f1]">
                      {tText(b.distanceKmString, lang)}
                    </div>
                    <div className="text-[11px] font-mono-tech text-[#65d9ff]">
                      {b.auString}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'دوره گردش انتقالی (سال)' : 'Orbital Period (Year)'}
                </td>
                {comparedBodies.map((b) => (
                  <td key={b.id} className="p-4">
                    <div className="font-bold text-[#e0e2f1]">
                      {tText(b.orbitalPeriodString, lang)}
                    </div>
                    <div className="text-[11px] text-[#8c919e]">
                      {tText(b.orbitalYearsString, lang)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'دوره چرخش وضعی (شبانه‌روز)' : 'Rotation Period (Day)'}
                </td>
                {comparedBodies.map((b) => (
                  <td key={b.id} className="p-4 font-bold text-[#b2c5ff]">
                    {tText(b.rotationPeriodString, lang)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'دمای میانگین سطح/ابر' : 'Mean Temperature'}
                </td>
                {comparedBodies.map((b) => (
                  <td key={b.id} className="p-4">
                    <div className="font-mono-tech font-bold text-[#f8c270] ltr-num">
                      {tText(b.tempString, lang)}
                    </div>
                    <div className="text-[11px] text-[#8c919e]">
                      {tText(b.tempContext, lang)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'شتاب گرانش سطحی' : 'Surface Gravity'}
                </td>
                {comparedBodies.map((b) => (
                  <td
                    key={b.id}
                    className="p-4 font-mono-tech text-[#e0e2f1] ltr-num"
                  >
                    {tText(b.gravityString, lang)}{' '}
                    <span className="text-[#8c919e]">({b.gravityG}g)</span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#171b26]/60">
                <td className="p-4 font-bold text-[#c2c6d4]">
                  {isFa ? 'تعداد اقمار طبیعی' : 'Confirmed Moons'}
                </td>
                {comparedBodies.map((b) => (
                  <td key={b.id} className="p-4 text-[#e0e2f1]">
                    {tText(b.moonsSummary, lang)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Atmospheric Breakdown Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {comparedBodies.map((b) => (
          <div
            key={b.id}
            className="bg-[#0b0e18]/92 border border-[#424752]/30 p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#424752]/25 pb-3">
              <h3 className="text-sm font-black text-[#e0e2f1]">
                {isFa ? `اتمسفر ${tText(b.name, lang)}` : `${tText(b.name, lang)} Atmosphere`}
              </h3>
              <span className="text-[10px] font-mono-tech text-[#65d9ff]">
                {tText(b.pressureKpaString, lang)}
              </span>
            </div>
            <div className="space-y-2.5">
              {b.atmosphereGases.map((g) => (
                <div key={g.symbol} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c2c6d4]">{tText(g.name, lang)}</span>
                    <span className="font-mono-tech text-[#e0e2f1]">
                      {g.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#171b26] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(5, g.percentage)}%`,
                        backgroundColor: g.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Telemetry Report Modal (No window.alert!) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0b0e18] border border-[#65d9ff]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#424752]/30 pb-3">
              <h3 className="text-base font-bold text-[#e0e2f1]">
                {isFa
                  ? 'گزارش تله‌متری مقایسه‌ای سیارات'
                  : 'Planetary Comparative Telemetry Report'}
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-[#c2c6d4] hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <pre className="bg-[#131620] p-4 rounded-xl text-[11px] font-mono-tech text-[#65d9ff] overflow-x-auto max-h-64">
              {JSON.stringify(
                comparedBodies.map((b) => ({
                  planet: b.englishName,
                  au: b.auNumeric,
                  diameterKm: b.diameterKm,
                  gravityG: b.gravityG,
                  meanTempC: b.meanTempC,
                  moons: b.moonsCount,
                })),
                null,
                2
              )}
            </pre>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg bg-[#65d9ff] text-[#003546] text-xs font-bold cursor-pointer"
              >
                {isFa ? 'تایید و بستن' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
