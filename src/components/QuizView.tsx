import React, { useState } from 'react';
import {
  CelestialId,
  Language,
  QUIZ_QUESTIONS,
} from '../data/solarSystemData.ts';
import { getCelestialBody, tText } from '../utils/astronomyMath.ts';

export interface QuizViewProps {
  lang: Language;
  onInspectPlanetIn3D: (id: CelestialId) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  lang,
  onInspectPlanetIn3D,
}) => {
  const isFa = lang === 'fa';
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );
  const [showCertificate, setShowCertificate] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const chosenOptionIdx = selectedAnswers[currentIdx];
  const hasAnswered = chosenOptionIdx !== undefined;

  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalCorrect = QUIZ_QUESTIONS.reduce((acc, q, idx) => {
    const sel = selectedAnswers[idx];
    if (sel !== undefined && q.options[sel]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const xpPoints = totalCorrect * 250 + totalAnswered * 50;
  const targetBody = getCelestialBody(currentQ.targetPlanetId);

  const handleSelectOption = (optIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIndex }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowCertificate(false);
  };

  return (
    <div
      className="relative z-20 pt-20 sm:pt-24 lg:pt-28 pb-20 px-4 md:px-10 max-w-6xl mx-auto space-y-6 md:space-y-8"
      data-testid="quiz-view"
    >
      {/* Top Quiz Telemetry Header */}
      <header className="bg-[#0b0e18]/92 border border-[#424752]/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-[#65d9ff] text-xs font-mono-tech">
            <span className="w-2 h-2 rounded-full bg-[#65d9ff] animate-ping" />
            <span>COSMIC ASSESSMENT // {currentQ.code}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#e0e2f1] mt-1">
            {isFa
              ? 'آزمون کیهانی و سنجش دانش نجوم (پایه نهم)'
              : 'Grade 9 Cosmic Knowledge Assessment'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131620] px-4 py-2 rounded-xl border border-[#424752]/30 text-center">
            <span className="text-[10px] text-[#8c919e] block">
              {isFa ? 'امتیاز کیهانی (XP)' : 'Cosmic XP'}
            </span>
            <span className="text-sm font-mono-tech font-bold text-[#f8c270]">
              {xpPoints} XP
            </span>
          </div>
          <div className="bg-[#131620] px-4 py-2 rounded-xl border border-[#424752]/30 text-center">
            <span className="text-[10px] text-[#8c919e] block">
              {isFa ? 'پاسخ‌های صحیح' : 'Score'}
            </span>
            <span className="text-sm font-mono-tech font-bold text-[#65d9ff]">
              {totalCorrect} / {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetQuiz}
            className="px-3.5 py-2 rounded-xl bg-[#171b26] border border-[#424752]/35 text-xs font-bold text-[#c2c6d4] hover:text-[#65d9ff] cursor-pointer"
          >
            {isFa ? 'شروع مجدد' : 'Restart'}
          </button>
        </div>
      </header>

      {/* Question Stepper Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const ans = selectedAnswers[idx];
          const isCurrent = idx === currentIdx;
          const isRight = ans !== undefined && q.options[ans]?.isCorrect;
          return (
            <button
              key={q.id}
              type="button"
              data-testid={`quiz-step-${idx}`}
              onClick={() => setCurrentIdx(idx)}
              className={`px-4 py-2 rounded-xl font-mono-tech text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                isCurrent
                  ? 'bg-[#65d9ff] text-[#003546] border-[#65d9ff]'
                  : ans !== undefined
                    ? isRight
                      ? 'bg-[#65d9ff]/15 text-[#65d9ff] border-[#65d9ff]/40'
                      : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border-[#ffb4ab]/40'
                    : 'bg-[#0b0e18]/90 text-[#c2c6d4] border-[#424752]/30'
              }`}
            >
              Q0{idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card & 3D Target Planet Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0b0e18]/94 border border-[#424752]/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-md bg-[#65d9ff]/12 text-[#65d9ff] text-xs font-bold">
              {tText(currentQ.category, lang)}
            </span>
            <span className="text-xs font-mono-tech text-[#f8c270]">
              {tText(currentQ.topicTag, lang)}
            </span>
          </div>

          <h2 className="text-lg md:text-2xl font-black text-[#e0e2f1] leading-relaxed">
            {tText(currentQ.question, lang)}
          </h2>

          {/* 4 Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = chosenOptionIdx === oIdx;
              let cardStyle =
                'bg-[#131620] border-[#424752]/30 hover:border-[#65d9ff]/50 text-[#e0e2f1]';

              if (hasAnswered) {
                if (opt.isCorrect) {
                  cardStyle =
                    'bg-[#65d9ff]/18 border-[#65d9ff] text-[#e0e2f1] shadow-[0_0_20px_rgba(101,217,255,0.2)]';
                } else if (isSelected && !opt.isCorrect) {
                  cardStyle =
                    'bg-[#ffb4ab]/18 border-[#ffb4ab] text-[#ffb4ab]';
                } else {
                  cardStyle =
                    'bg-[#131620]/60 border-[#424752]/20 opacity-55';
                }
              }

              return (
                <button
                  key={opt.letter}
                  type="button"
                  data-testid={`quiz-option-${oIdx}`}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-4 rounded-xl border text-start transition-all flex flex-col justify-between gap-3 cursor-pointer ${cardStyle}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="w-7 h-7 rounded-lg bg-[#1f232e] border border-[#424752]/40 flex items-center justify-center font-mono-tech text-xs font-bold text-[#65d9ff]">
                      {opt.letter}
                    </span>
                    <span className="font-mono-tech text-[10px] text-[#8c919e]">
                      {opt.auBadge}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#e0e2f1]">
                      {tText(opt.title, lang)}
                    </div>
                    <div className="text-xs text-[#c2c6d4]/80 mt-0.5">
                      {tText(opt.subtitle, lang)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scientific Explanation Feedback */}
          {hasAnswered && (
            <div className="p-4 rounded-xl bg-[#171b26] border border-[#65d9ff]/35 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#65d9ff]">
                  {currentQ.options[chosenOptionIdx]?.isCorrect
                    ? isFa
                      ? '✓ پاسخ شما کاملاً صحیح است!'
                      : '✓ Correct Telemetry Match!'
                    : isFa
                      ? '✗ تحلیل علمی پاسخ صحیح:'
                      : '✗ Scientific Explanation:'}
                </span>
                <span className="text-[11px] font-mono-tech text-[#f8c270]">
                  {tText(currentQ.telemetryReadout, lang)}
                </span>
              </div>
              <p className="text-xs text-[#e0e2f1]/90 leading-relaxed">
                {tText(currentQ.explanation, lang)}
              </p>
            </div>
          )}

          {/* Prev / Next Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-[#424752]/25">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="px-4 py-2 rounded-xl bg-[#171b26] border border-[#424752]/30 text-xs font-bold text-[#c2c6d4] disabled:opacity-40 cursor-pointer"
            >
              {isFa ? '→ سوال قبلی' : '← Previous'}
            </button>

            {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
              <button
                type="button"
                data-testid="quiz-next-btn"
                onClick={() =>
                  setCurrentIdx((i) =>
                    Math.min(QUIZ_QUESTIONS.length - 1, i + 1)
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-[#65d9ff] text-[#003546] text-xs font-bold hover:bg-[#9ee4ff] cursor-pointer"
              >
                {isFa ? 'سوال بعدی ←' : 'Next Question →'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="px-5 py-2.5 rounded-xl bg-[#f8c270] text-[#281800] text-xs font-bold hover:bg-[#ffe09e] cursor-pointer"
              >
                {isFa ? 'مشاهده کارنامه نهایی' : 'View Final Report'}
              </button>
            )}
          </div>
        </div>

        {/* Side Telemetry & Direct 3D Planet Inspection Card */}
        <aside className="bg-[#0b0e18]/92 border border-[#424752]/30 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono-tech text-[#65d9ff] uppercase">
              TARGET CELESTIAL BODY
            </div>
            <div className="p-4 rounded-xl bg-[#131620] border border-[#424752]/25 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, #ffffff88, ${targetBody.accentHex} 60%, #050811 95%)`,
                }}
              />
              <div>
                <h3 className="text-base font-black text-[#e0e2f1]">
                  {tText(targetBody.name, lang)}
                </h3>
                <p className="text-xs font-mono-tech text-[#65d9ff]">
                  {targetBody.auString} • {tText(targetBody.diameterString, lang)}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#c2c6d4] leading-relaxed">
              {tText(targetBody.distinctiveFeature, lang)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onInspectPlanetIn3D(targetBody.id)}
            className="w-full py-3 rounded-xl bg-[#65d9ff]/15 border border-[#65d9ff]/40 text-xs font-bold text-[#65d9ff] hover:bg-[#65d9ff]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              3d_rotation
            </span>
            <span>
              {isFa
                ? `بررسی سه‌بعدی ${tText(targetBody.name, lang)}`
                : `Inspect ${tText(targetBody.name, lang)} in 3D`}
            </span>
          </button>
        </aside>
      </div>

      {/* Final Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#0b0e18] border border-[#65d9ff]/45 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-[#f8c270]">
              workspace_premium
            </span>
            <h3 className="text-xl font-black text-[#e0e2f1]">
              {isFa ? 'گواهی پایان آزمون کیهانی' : 'Cosmic Assessment Report'}
            </h3>
            <p className="text-sm text-[#c2c6d4]">
              {isFa
                ? `شما به ${totalCorrect} سوال از ${QUIZ_QUESTIONS.length} سوال پاسخ صحیح دادید و ${xpPoints} امتیاز کسب کردید.`
                : `You answered ${totalCorrect} of ${QUIZ_QUESTIONS.length} questions correctly and earned ${xpPoints} XP.`}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2 rounded-xl bg-[#65d9ff] text-[#003546] text-xs font-bold cursor-pointer"
              >
                {isFa ? 'بستن' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
