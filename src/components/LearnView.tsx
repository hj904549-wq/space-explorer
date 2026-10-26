import React, { useState } from 'react';
import {
  CURRICULUM_MODULES,
  FLASHCARDS,
  Language,
} from '../data/solarSystemData.ts';
import { tText } from '../utils/astronomyMath.ts';

export interface LearnViewProps {
  lang: Language;
  onStartQuiz: () => void;
  onReturnTo3D: () => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  lang,
  onStartQuiz,
  onReturnTo3D,
}) => {
  const isFa = lang === 'fa';
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const checklistItems = [
    {
      fa: 'تفاوت سیارات درونی (سنگی) و بیرونی (گازی) و نقش کمربند سیارک‌ها را می‌دانم.',
      en: 'I can distinguish Terrestrial (rocky) from Jovian (gas/ice) planets across the asteroid belt.',
    },
    {
      fa: 'واکنش همجوشی هسته‌ای خورشید (تبدیل هیدروژن به هلیوم) را درک کرده‌ام.',
      en: 'I understand nuclear fusion in the Sun’s core (Hydrogen fusing into Helium).',
    },
    {
      fa: 'تفاوت حرکت وضعی (شبانه‌روز) و حرکت انتقالی (سال) سیارات را بلدم.',
      en: 'I can explain planetary axial rotation (day/night) vs. orbital revolution (year).',
    },
    {
      fa: 'تفاوت شهاب‌وار، شهاب و شهاب‌سنگ و جهت دم دنباله‌دارها را می‌شناسم.',
      en: 'I know the difference between meteoroids, meteors, and meteorites, and comet tail orientation.',
    },
    {
      fa: 'علت خروج پلوتو از فهرست سیارات اصلی و شرایط سه‌گانه IAU را می‌دانم.',
      en: 'I know the three 2006 IAU criteria for a planet and why Pluto is a dwarf planet.',
    },
    {
      fa: 'چهار عامل اصلی زیست‌پذیری زمین در کمربند حیات خورشید را به خاطر دارم.',
      en: 'I can list the four key habitability factors of Earth in the Goldilocks Zone.',
    },
  ];

  return (
    <div
      className="relative z-20 pt-20 sm:pt-24 lg:pt-28 pb-20 px-4 md:px-10 max-w-7xl mx-auto space-y-8 md:space-y-12"
      data-testid="learn-view"
    >
      {/* Hero Banner */}
      <section className="bg-[#0b0e18]/92 border border-[#424752]/30 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#65d9ff]/12 border border-[#65d9ff]/30 text-[#65d9ff] text-xs font-mono-tech">
            <span>GRADE 9 ASTRONOMY // CHAPTER 10</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#e0e2f1] leading-tight">
            {isFa
              ? 'درسنامه جامع علوم تجربی پایه نهم: نگاهی به فضا'
              : 'Grade 9 Astronomy Syllabus: A Look into Space'}
          </h1>
          <p className="text-sm md:text-base text-[#c2c6d4] leading-relaxed">
            {isFa
              ? 'مطالعه ساختاریافته ۸ سرفصل کلیدی نجوم پایه نهم شامل پیدایش منظومه شمسی، همجوشی هسته‌ای خورشید، قوانین کپلر، دسته‌بندی سیارات و آمادگی کامل برای آزمون.'
              : 'Master all 8 core astronomy modules covering solar nebula formation, nuclear fusion, Keplerian mechanics, planetary classification, and interactive flashcards.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            onClick={onReturnTo3D}
            className="px-5 py-3 rounded-xl bg-[#171b26] border border-[#65d9ff]/40 text-xs font-bold text-[#65d9ff] hover:bg-[#65d9ff]/15 transition-all cursor-pointer"
          >
            {isFa ? 'مشاهده در منظومه ۳بعدی' : 'Explore in 3D Scene'}
          </button>
          <button
            type="button"
            onClick={onStartQuiz}
            className="px-5 py-3 rounded-xl bg-[#65d9ff] text-[#003546] text-xs font-bold hover:bg-[#9ee4ff] transition-all cursor-pointer"
          >
            {isFa ? 'شروع آزمون کیهانی' : 'Take Cosmic Quiz'}
          </button>
        </div>
      </section>

      {/* 8 Curriculum Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CURRICULUM_MODULES.map((mod) => (
          <article
            key={mod.id}
            className="bg-[#0b0e18]/92 border border-[#424752]/30 rounded-2xl p-6 space-y-4 hover:border-[#65d9ff]/45 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#65d9ff]/12 border border-[#65d9ff]/30 flex items-center justify-center font-mono-tech font-bold text-sm text-[#65d9ff]">
                  {mod.number}
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#e0e2f1]">
                    {tText(mod.title, lang)}
                  </h2>
                  <p className="text-xs text-[#8c919e]">
                    {tText(mod.subtitle, lang)}
                  </p>
                </div>
              </div>
              <span className="font-mono-tech text-[11px] px-2.5 py-1 rounded bg-[#171b26] text-[#f8c270] border border-[#f8c270]/30 shrink-0">
                {mod.badge}
              </span>
            </div>

            <p className="text-xs md:text-sm text-[#e0e2f1]/90 leading-relaxed bg-[#131620] p-4 rounded-xl border border-[#424752]/20">
              {tText(mod.summary, lang)}
            </p>

            <div className="bg-[#f8c270]/10 border-s-2 border-[#f8c270] p-3 rounded-e-xl text-xs text-[#e0e2f1]/90">
              <strong className="text-[#f8c270] block mb-0.5">
                {isFa ? 'نکته امتحانی:' : 'Exam Key Point:'}
              </strong>
              {tText(mod.examTip, lang)}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {mod.metrics.map((m, i) => (
                <div
                  key={i}
                  className="bg-[#171b26] p-2.5 rounded-lg border border-[#424752]/20 text-center"
                >
                  <div className="text-[10px] text-[#8c919e] truncate">
                    {tText(m.label, lang)}
                  </div>
                  <div
                    className={`text-xs font-mono-tech font-bold mt-0.5 ${m.color}`}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Interactive Flashcards Section */}
      <section className="bg-[#0b0e18]/92 border border-[#424752]/30 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono-tech text-[#65d9ff] uppercase">
              ACTIVE RECALL // FLASHCARDS
            </span>
            <h2 className="text-2xl font-black text-[#e0e2f1]">
              {isFa
                ? 'فلش‌کارت‌های تعاملی مرور سریع (کلیک برای مشاهده پاسخ)'
                : 'Interactive Astronomy Flashcards (Click to Reveal)'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FLASHCARDS.map((card) => {
            const isFlipped = !!flippedIds[card.id];
            return (
              <button
                key={card.id}
                type="button"
                data-testid={`flashcard-${card.id}`}
                onClick={() => toggleFlip(card.id)}
                className={`p-5 rounded-xl border text-start transition-all min-h-[190px] flex flex-col justify-between cursor-pointer ${
                  isFlipped
                    ? 'bg-[#171b26] border-[#f8c270]/60'
                    : 'bg-[#131620] border-[#424752]/30 hover:border-[#65d9ff]/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[10px] text-[#65d9ff]">
                    {card.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1f232e] text-[#c2c6d4]">
                    {isFlipped
                      ? isFa
                        ? 'پاسخ علمی'
                        : 'Answer'
                      : isFa
                        ? 'پرسش'
                        : 'Question'}
                  </span>
                </div>

                <p className="text-xs md:text-sm font-bold text-[#e0e2f1] leading-relaxed my-3">
                  {isFlipped
                    ? tText(card.answer, lang)
                    : tText(card.question, lang)}
                </p>

                <div className="text-[11px] text-[#65d9ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    flip
                  </span>
                  <span>
                    {isFlipped
                      ? isFa
                        ? 'برگشت به سوال'
                        : 'Show Question'
                      : isFa
                        ? 'مشاهده پاسخ'
                        : 'Reveal Answer'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Self-Assessment Checklist */}
      <section className="bg-[#0b0e18]/92 border border-[#424752]/30 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#e0e2f1]">
              {isFa
                ? 'چک‌لیست خودارزیابی آمادگی آزمون'
                : 'Self-Assessment Mastery Checklist'}
            </h2>
            <p className="text-xs text-[#8c919e]">
              {isFa
                ? 'موارد مطالعه شده را علامت بزنید و سپس وارد آزمون کیهانی شوید.'
                : 'Track your mastery of Chapter 10 concepts before launching the quiz.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartQuiz}
            className="px-5 py-2.5 rounded-xl bg-[#f8c270] text-[#281800] font-bold text-xs hover:bg-[#ffdfa0] transition-all cursor-pointer"
          >
            {isFa ? 'ورود به آزمون نهایی ←' : 'Launch Final Quiz →'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklistItems.map((item, idx) => {
            const checked = !!checkedItems[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCheck(idx)}
                className={`p-3.5 rounded-xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                  checked
                    ? 'bg-[#65d9ff]/12 border-[#65d9ff]/45 text-[#e0e2f1]'
                    : 'bg-[#131620] border-[#424752]/25 text-[#c2c6d4]'
                }`}
              >
                <span className="material-symbols-outlined text-[#65d9ff]">
                  {checked ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span className="text-xs font-medium">{tText(item, lang)}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
