import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  BookOpen,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  Building,
  CheckCircle,
  Sparkles,
  Zap,
  Globe,
  Plus
} from 'lucide-react';
import { AcademicTipBanner } from '../AcademicTipBanner';
import { CompanyProject, JournalEntry } from '../../types/accounting';
import { 
  formatCurrency, 
  calculateIncomeStatement, 
  calculateLedger,
  calculateBalanceSheet
} from '../../utils/accountingCalculations';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../../data/defaultChartOfAccounts';

interface DashboardTabProps {
  project: CompanyProject;
  entries: JournalEntry[];
  onOpenNewEntry: () => void;
  onOpenInvoiceModal: () => void;
  onOpenAdjustingModal: () => void;
  onOpenClosingModal: () => void;
  onSelectTab: (tab: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  project,
  entries,
  onOpenNewEntry,
  onOpenInvoiceModal,
  onOpenAdjustingModal,
  onOpenClosingModal,
  onSelectTab
}) => {
  const incomeStatement = calculateIncomeStatement(entries, project, 0, DEFAULT_CHART_OF_ACCOUNTS);
  const balanceSheet = calculateBalanceSheet(entries, project, DEFAULT_CHART_OF_ACCOUNTS);
  const recentEntries = [...entries].sort((a, b) => b.entryNumber - a.entryNumber).slice(0, 4);

  // Data for the Bar Chart inspired directly by the uploaded image (Jan Feb Mar Apr Jun Jul bars)
  const chartData = [
    { label: 'فرو', income: 45, expense: 20 },
    { label: 'اردی', income: 70, expense: 35 },
    { label: 'خرد', income: 55, expense: 48 },
    { label: 'تیر', income: 25, expense: 15 },
    { label: 'مرد', income: 65, expense: 30 },
    { label: 'شهر', income: 80, expense: 50 },
  ];

  return (
    <div className="space-y-4 pb-20 px-3 sm:px-4 pt-3">

      {/* Income & Expense Two Cards (Styled like modern fintech UI) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Income Card */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] text-emerald-700 font-bold truncate">ورودی دوره</span>
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">مجموع درآمدها</div>
            <div className="text-xs sm:text-sm md:text-base font-extrabold font-mono text-slate-900 mt-0.5 tracking-tight truncate">
              {formatCurrency(incomeStatement.netSalesOrRevenue, project.currency)}
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/80 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] text-rose-700 font-bold truncate">خروجی دوره</span>
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">مجموع هزینه‌ها</div>
            <div className="text-xs sm:text-sm md:text-base font-extrabold font-mono text-slate-900 mt-0.5 tracking-tight truncate">
              {formatCurrency(incomeStatement.totalOperatingExpenses, project.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Statistical Overview Bar Chart Card (Exact replicate of the uploaded reference photo) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">تحلیل گردش مالی دوره (Statistic)</h3>
            <span className="text-[10px] text-slate-400">مقایسه درآمد و هزینه بر اساس دفاتر</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <div className="flex items-center gap-1 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 inline-block"></span>
              درآمد
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
              هزینه
            </div>
          </div>
        </div>

        {/* Minimalist Bar Chart Representation */}
        <div className="h-32 flex items-end justify-between gap-2 pt-4 px-1 border-b border-slate-100">
          {chartData.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-24">
                {/* Income bar (Dark Slate/Black) */}
                <div 
                  style={{ height: `${bar.income}%` }}
                  className="w-2.5 sm:w-3.5 bg-slate-900 rounded-t-sm transition-all duration-500 hover:opacity-80"
                  title={`درآمد: ${bar.income}٪`}
                />
                {/* Expense bar (Emerald Green) */}
                <div 
                  style={{ height: `${bar.expense}%` }}
                  className="w-2.5 sm:w-3.5 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-sm transition-all duration-500 hover:opacity-80"
                  title={`هزینه: ${bar.expense}٪`}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1">{bar.label}</span>
            </div>
          ))}
        </div>

        {/* Accounting Equation Mini-Bar */}
        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
          <span className="font-bold">معادله ترازنامه:</span>
          <span className="font-mono text-slate-900 font-extrabold text-[10px] sm:text-xs">
            دارایی‌ها ({formatCurrency(balanceSheet.totalAssets, project.currency)}) = بدهی‌ها + سرمایه ({formatCurrency(balanceSheet.totalLiabilitiesAndEquity, project.currency)})
          </span>
          <span className={balanceSheet.isBalanced ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
            {balanceSheet.isBalanced ? '✓ برابر' : '⚠ اختلاف'}
          </span>
        </div>
      </div>

      {/* Accounting Quick Actions Grid (Payment List style from reference image) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">امکانات و ابزارهای کلاسی</h3>
          <span className="text-[11px] text-emerald-700 font-medium">سرفصل‌های آموزشی</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            onClick={() => onSelectTab('journal')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/80 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">دفتر روزنامه</span>
          </button>

          <button
            onClick={() => onSelectTab('ledger')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100/80 flex items-center justify-center mb-1 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">حساب‌های T</span>
          </button>

          <button
            onClick={() => onSelectTab('reports')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/80 flex items-center justify-center mb-1 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">تراز آزمایشی</span>
          </button>

          <button
            onClick={onOpenClosingModal}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 flex items-center justify-center mb-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">بستن حساب‌ها</span>
          </button>
        </div>
      </div>

      {/* Academic Tip Banner with Auto-Rotating Random Accounting, Tax & Payroll Tips */}
      <AcademicTipBanner
        projectName={project.name}
        onOpenAdjustingModal={onOpenAdjustingModal}
        intervalMinutes={2}
      />

      {/* Recent Journal Transactions List */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">آخرین اسناد صادر شده در دفتر روزنامه</h3>
          <button
            onClick={() => onSelectTab('journal')}
            className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 hover:underline"
          >
            مشاهده همه ({entries.length})
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        <div className="space-y-2">
          {recentEntries.map(entry => {
            const totalEntryAmt = entry.items.reduce((s, it) => s + (it.debit || 0), 0);
            return (
              <div 
                key={entry.id}
                className="p-3 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100/80 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    #{entry.entryNumber}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {entry.description}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{entry.date}</span>
                      <span>·</span>
                      <span className={
                        entry.type === 'adjusting' ? 'text-amber-600 font-bold' :
                        entry.type === 'closing' ? 'text-blue-600 font-bold' : 'text-slate-500'
                      }>
                        {entry.type === 'adjusting' ? 'سند اصلاحی' :
                         entry.type === 'closing' ? 'سند بستن حساب‌ها' :
                         entry.type === 'purchase' ? 'سند خرید' :
                         entry.type === 'sale' ? 'سند فروش' : 'سند عادی'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="text-xs font-bold font-mono text-slate-900">
                    {formatCurrency(totalEntryAmt, project.currency)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    {entry.items.length} آرتیکل
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};
