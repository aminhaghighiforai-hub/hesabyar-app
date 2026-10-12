import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  BookMarked, 
  HelpCircle,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { ACCOUNTING_TIPS, AccountingTip } from '../data/accountingTips';

interface AcademicTipBannerProps {
  projectName?: string;
  onOpenAdjustingModal?: () => void;
  intervalMinutes?: number; // default interval in minutes (e.g. 2 or 3)
}

export const AcademicTipBanner: React.FC<AcademicTipBannerProps> = ({
  projectName,
  onOpenAdjustingModal,
  intervalMinutes = 2 // changes automatically every 2 minutes or upon click
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return Math.floor(Math.random() * ACCOUNTING_TIPS.length);
  });
  const [isRotating, setIsRotating] = useState(false);
  const [fadeAnimation, setFadeAnimation] = useState(true);

  // Interval rotation every intervalMinutes
  useEffect(() => {
    const ms = intervalMinutes * 60 * 1000;
    const timer = setInterval(() => {
      handleNextTip();
    }, ms);

    return () => clearInterval(timer);
  }, [intervalMinutes, currentIndex]);

  const handleNextTip = () => {
    setFadeAnimation(false);
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ACCOUNTING_TIPS.length);
      setFadeAnimation(true);
      setTimeout(() => setIsRotating(false), 300);
    }, 150);
  };

  const handlePrevTip = () => {
    setFadeAnimation(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + ACCOUNTING_TIPS.length) % ACCOUNTING_TIPS.length);
      setFadeAnimation(true);
    }, 150);
  };

  const handleRandomTip = () => {
    setFadeAnimation(false);
    setIsRotating(true);
    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * ACCOUNTING_TIPS.length);
      if (nextIdx === currentIndex && ACCOUNTING_TIPS.length > 1) {
        nextIdx = (nextIdx + 1) % ACCOUNTING_TIPS.length;
      }
      setCurrentIndex(nextIdx);
      setFadeAnimation(true);
      setTimeout(() => setIsRotating(false), 300);
    }, 150);
  };

  const tip: AccountingTip = ACCOUNTING_TIPS[currentIndex] || ACCOUNTING_TIPS[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-3.5 sm:p-4 rounded-3xl border border-slate-700/60 shadow-lg relative overflow-hidden transition-all">
      {/* Subtle background ambient glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Bar inside Card */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${tip.categoryBg} shrink-0`}>
            {tip.categoryLabel}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
            <Clock className="w-2.5 h-2.5 text-slate-500" />
            <span>نکته روز ({currentIndex + 1} از {ACCOUNTING_TIPS.length})</span>
          </span>
        </div>

        {/* Action Controls: Random / Prev / Next */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleRandomTip}
            title="نکته بعدی رندم"
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60"
          >
            <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          <button
            onClick={handlePrevTip}
            title="نکته قبلی"
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNextTip}
            title="نکته بعدی"
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area with Fade animation */}
      <div 
        className={`transition-opacity duration-200 ${fadeAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} space-y-1.5`}
      >
        <div className="text-xs sm:text-sm font-extrabold text-white leading-snug flex items-center gap-1.5">
          <span className="text-emerald-400">❖</span>
          <span>{tip.title}</span>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed text-justify">
          {tip.description}
        </p>

        {/* Footer info: Source / Law reference + Quick shortcut */}
        <div className="pt-2 flex items-center justify-between gap-2 flex-wrap text-[10px]">
          {tip.sourceOrReference ? (
            <div className="text-slate-400 flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
              <BookMarked className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{tip.sourceOrReference}</span>
            </div>
          ) : (
            <div />
          )}

          {onOpenAdjustingModal && (
            <button
              onClick={onOpenAdjustingModal}
              className="bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all active:scale-95 flex items-center gap-1 shadow-xs ml-auto"
            >
              <span>ثبت‌های تعدیلی</span>
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
