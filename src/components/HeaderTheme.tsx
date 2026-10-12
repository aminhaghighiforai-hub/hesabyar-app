import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  FileText, 
  SlidersHorizontal, 
  Scale,
  FolderKanban
} from 'lucide-react';
import { CompanyProject } from '../types/accounting';
import { formatCurrency } from '../utils/accountingCalculations';

interface HeaderThemeProps {
  project: CompanyProject;
  totalAssets: number;
  netIncome: number;
  isBalanced: boolean;
  onOpenProjectModal: () => void;
  onOpenNewEntryModal: () => void;
  onOpenInvoiceModal: () => void;
  onOpenAdjustingModal: () => void;
  onOpenTrialBalanceTab: () => void;
  onOpenCalculatorModal: () => void;
  onOpenHelpModal: () => void;
}

export const HeaderTheme: React.FC<HeaderThemeProps> = ({
  project,
  totalAssets,
  netIncome,
  isBalanced,
  onOpenProjectModal,
  onOpenNewEntryModal,
  onOpenInvoiceModal,
  onOpenAdjustingModal,
  onOpenTrialBalanceTab,
  onOpenCalculatorModal,
  onOpenHelpModal
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50/70 text-slate-800 rounded-b-[36px] border-b border-slate-200/80 shadow-md shadow-slate-900/5 pt-2 pb-6 px-4 sm:px-6 transition-all duration-300">
      {/* Top Android Status Bar Simulation */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span className="font-semibold tracking-wider font-mono">09:41</span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>۵G</span>
          <span className="text-[10px]">●●●●</span>
          <span>۱۰۰٪</span>
        </div>
      </div>

      {/* Top App Header Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Project Switcher / Student Identity */}
        <button
          onClick={onOpenProjectModal}
          className="flex items-center gap-2.5 bg-white hover:bg-slate-100/70 active:scale-95 transition-all px-3 py-1.5 rounded-2xl border border-slate-200/80 text-right max-w-[65%] shadow-xs"
          title="تغییر یا مدیریت پروژه‌ها"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            {project.type === 'merchandising' ? 'ب' : project.type === 'service' ? 'خ' : 'ت'}
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-slate-800 truncate leading-tight">
              {project.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
              <span>{project.type === 'merchandising' ? 'شرکت بازرگانی' : project.type === 'service' ? 'شرکت خدماتی' : 'بازرگانی و خدماتی (تلفیقی)'}</span>
              <span>·</span>
              <span>دوره {project.fiscalYear}</span>
            </div>
          </div>
          <FolderKanban className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        </button>

        {/* Right Action Icons: Calculator & Cycle Help */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenCalculatorModal}
            className="w-9 h-9 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 flex items-center justify-center border border-slate-200/80 transition-all shadow-md hover:shadow-lg shrink-0 p-0.5 overflow-hidden"
            title="ماشین‌حساب حسابداری"
            aria-label="ماشین‌حساب حسابداری"
          >
            {/* Dark Minimalist Calculator App Icon matching uploaded image */}
            <svg
              className="w-full h-full drop-shadow-xs"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                {/* Main Dark Gray Container Squircle Gradient */}
                <linearGradient id="apple-calc-body" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#55585b" />
                  <stop offset="100%" stopColor="#434548" />
                </linearGradient>

                {/* Dark Key Buttons Gradient */}
                <linearGradient id="apple-calc-dark-key" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#303134" />
                  <stop offset="100%" stopColor="#252628" />
                </linearGradient>

                {/* Vibrant Orange Equals (=) Key Gradient */}
                <linearGradient id="apple-calc-orange-key" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff9f0a" />
                  <stop offset="100%" stopColor="#f57c00" />
                </linearGradient>
              </defs>

              {/* Main Outer Squircle Body */}
              <rect
                x="8"
                y="8"
                width="84"
                height="84"
                rx="25"
                fill="url(#apple-calc-body)"
              />

              {/* Inner 4-Key Grid */}
              {/* 1. Top-Left: Plus (+) Button */}
              <rect
                x="17"
                y="17"
                width="31"
                height="31"
                rx="11"
                fill="url(#apple-calc-dark-key)"
              />
              {/* Plus (+) Symbol */}
              <rect x="23.5" y="30.5" width="18" height="4" rx="2" fill="#ffffff" />
              <rect x="30.5" y="23.5" width="4" height="18" rx="2" fill="#ffffff" />

              {/* 2. Top-Right: Division (÷) Button */}
              <rect
                x="52"
                y="17"
                width="31"
                height="31"
                rx="11"
                fill="url(#apple-calc-dark-key)"
              />
              {/* Division (÷) Symbol */}
              <circle cx="67.5" cy="26" r="2.4" fill="#ffffff" />
              <rect x="58.5" y="30.5" width="18" height="4" rx="2" fill="#ffffff" />
              <circle cx="67.5" cy="39" r="2.4" fill="#ffffff" />

              {/* 3. Bottom-Left: Multiply (×) Button */}
              <rect
                x="17"
                y="52"
                width="31"
                height="31"
                rx="11"
                fill="url(#apple-calc-dark-key)"
              />
              {/* Multiply (×) Symbol */}
              <g transform="translate(32.5, 67.5) rotate(45) translate(-32.5, -67.5)">
                <rect x="24.5" y="65.5" width="16" height="4" rx="2" fill="#ffffff" />
                <rect x="30.5" y="59.5" width="4" height="16" rx="2" fill="#ffffff" />
              </g>

              {/* 4. Bottom-Right: Vibrant Orange Equals (=) Button */}
              <rect
                x="52"
                y="52"
                width="31"
                height="31"
                rx="11"
                fill="url(#apple-calc-orange-key)"
              />
              {/* Equals (=) Symbol */}
              <rect x="59.5" y="63" width="16" height="4" rx="2" fill="#ffffff" />
              <rect x="59.5" y="70" width="16" height="4" rx="2" fill="#ffffff" />
            </svg>
          </button>
          <button
            onClick={onOpenHelpModal}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 active:scale-95 flex items-center justify-center text-slate-700 border border-slate-200/80 transition-all shadow-md hover:shadow-lg shrink-0"
            title="راهنمای چرخه حسابداری کلاسی"
            aria-label="راهنمای چرخه حسابداری"
          >
            <svg
              className="w-[22px] h-[22px] text-slate-700 drop-shadow-xs shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9.09 9.5a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17.5" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Total Net Balance & Asset Overview Card (Theme from uploaded photo) */}
      <div className="text-center my-3">
        <div className="text-xs text-slate-500 font-semibold tracking-wide mb-1">
          ارزش کل دارایی‌های مؤسسه
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-xs font-mono">
          {formatCurrency(totalAssets, project.currency)}
        </div>

        {/* Financial health indicator chips */}
        <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
          <div className="bg-white px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 border border-slate-200/80 shadow-xs max-w-[48%] min-w-0">
            <span className="shrink-0 text-slate-400">سود/زیان:</span>
            <span className={`font-bold font-mono truncate ${netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(netIncome, project.currency)}
            </span>
          </div>
          <div className="bg-white px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 border border-slate-200/80 shadow-xs shrink-0">
            <span className="shrink-0 text-slate-400">تراز:</span>
            <span className={`font-bold ${isBalanced ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isBalanced ? '✓ متعادل' : '⚠ نامتعادل'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Cards (Clean fintech style matching reference photo) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 mt-5 pt-1">
        <button
          onClick={onOpenNewEntryModal}
          className="group flex flex-col items-center justify-center bg-white hover:bg-slate-50/90 active:scale-95 transition-all px-1 py-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm min-h-[76px] sm:min-h-[82px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 stroke-[2.2]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center leading-tight">
            سند جدید
          </span>
        </button>

        <button
          onClick={onOpenInvoiceModal}
          className="group flex flex-col items-center justify-center bg-white hover:bg-slate-50/90 active:scale-95 transition-all px-1 py-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm min-h-[76px] sm:min-h-[82px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 stroke-[2.2]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center leading-tight px-0.5">
            فاکتور خرید/فروش
          </span>
        </button>

        <button
          onClick={onOpenAdjustingModal}
          className="group flex flex-col items-center justify-center bg-white hover:bg-slate-50/90 active:scale-95 transition-all px-1 py-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm min-h-[76px] sm:min-h-[82px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 stroke-[2.2]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center leading-tight px-0.5">
            ثبت‌های اصلاحی
          </span>
        </button>

        <button
          onClick={onOpenTrialBalanceTab}
          className="group flex flex-col items-center justify-center bg-white hover:bg-slate-50/90 active:scale-95 transition-all px-1 py-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm min-h-[76px] sm:min-h-[82px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 stroke-[2.2]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center leading-tight">
            تراز آزمایشی
          </span>
        </button>
      </div>
    </div>
  );
};
