import React from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  BookCheck
} from 'lucide-react';
import { JournalEntry, JournalItem, Account, CompanyProject } from '../types/accounting';
import { calculateLedger, calculateIncomeStatement, formatCurrency } from '../utils/accountingCalculations';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../data/defaultChartOfAccounts';

interface ClosingEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  project: CompanyProject;
  nextEntryNumber: number;
  onSaveClosingEntries: (closingEntries: JournalEntry[]) => void;
}

export const ClosingEntriesModal: React.FC<ClosingEntriesModalProps> = ({
  isOpen,
  onClose,
  entries,
  project,
  nextEntryNumber,
  onSaveClosingEntries
}) => {
  if (!isOpen) return null;

  // Calculators
  const nonClosingEntries = entries.filter(e => e.type !== 'closing');
  const ledger = calculateLedger(nonClosingEntries, DEFAULT_CHART_OF_ACCOUNTS);
  const incomeStatement = calculateIncomeStatement(nonClosingEntries, project, 0, DEFAULT_CHART_OF_ACCOUNTS);

  // 1. حساب‌های درآمد با مانده بستانکار
  const revenueAccounts = DEFAULT_CHART_OF_ACCOUNTS
    .filter(a => a.category === 'revenue')
    .map(a => ({
      code: a.code,
      name: a.name,
      creditBalance: ledger[a.code]?.balanceCredit || 0,
      debitBalance: ledger[a.code]?.balanceDebit || 0
    }))
    .filter(a => a.creditBalance > 0 || a.debitBalance > 0);

  // 2. حساب‌های هزینه با مانده بدهکار
  const expenseAccounts = DEFAULT_CHART_OF_ACCOUNTS
    .filter(a => a.category === 'expense' || a.category === 'cogs')
    .map(a => ({
      code: a.code,
      name: a.name,
      balance: ledger[a.code]?.balanceDebit || 0
    }))
    .filter(a => a.balance > 0);

  const drawingsBalance = ledger['302']?.balanceDebit || 0;

  const handleExecuteClosing = () => {
    const generated: JournalEntry[] = [];
    let curNumber = nextEntryNumber;

    // سند ۱: بستن درآمدها به خلاصه سود و زیان
    const totalRev = revenueAccounts.reduce((sum, a) => sum + (a.creditBalance - a.debitBalance), 0);
    if (totalRev > 0) {
      const revItems: JournalItem[] = revenueAccounts.map(a => ({
        id: `c-rev-${a.code}`,
        accountCode: a.code,
        accountName: a.name,
        debit: a.creditBalance,
        credit: a.debitBalance,
        description: 'بستن حساب موقت درآمد به خلاصه سود و زیان'
      }));
      revItems.push({
        id: 'c-rev-sum',
        accountCode: '304',
        accountName: 'خلاصه سود و زیان (حساب واسطه بستن)',
        debit: 0,
        credit: totalRev,
        description: 'انتقال جمع درآمدهای دوره به خلاصه سود و زیان'
      });

      generated.push({
        id: Math.random().toString(36).substring(2, 9),
        entryNumber: curNumber++,
        date: `${project.fiscalYear}/12/29`,
        description: 'سند بستن حساب‌های موقت درآمد به خلاصه سود و زیان پایان دوره',
        type: 'closing',
        items: revItems,
        createdAt: new Date().toISOString()
      });
    }

    // سند ۲: بستن هزینه‌ها به خلاصه سود و زیان
    const totalExp = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);
    if (totalExp > 0) {
      const expItems: JournalItem[] = [
        {
          id: 'c-exp-sum',
          accountCode: '304',
          accountName: 'خلاصه سود و زیان (حساب واسطه بستن)',
          debit: totalExp,
          credit: 0,
          description: 'انتقال جمع هزینه‌ها به خلاصه سود و زیان'
        },
        ...expenseAccounts.map(a => ({
          id: `c-exp-${a.code}`,
          accountCode: a.code,
          accountName: a.name,
          debit: 0,
          credit: a.balance,
          description: 'بستن حساب موقت هزینه'
        }))
      ];

      generated.push({
        id: Math.random().toString(36).substring(2, 9),
        entryNumber: curNumber++,
        date: `${project.fiscalYear}/12/29`,
        description: 'سند بستن حساب‌های موقت هزینه به خلاصه سود و زیان پایان دوره',
        type: 'closing',
        items: expItems,
        createdAt: new Date().toISOString()
      });
    }

    // سند ۳: بستن مانده خلاصه سود و زیان به سرمایه یا سود انباشته
    const netIncome = incomeStatement.netIncome;
    if (netIncome !== 0) {
      const netItems: JournalItem[] = netIncome > 0
        ? [
            {
              id: 'c-net-1',
              accountCode: '304',
              accountName: 'خلاصه سود و زیان (حساب واسطه بستن)',
              debit: Math.abs(netIncome),
              credit: 0,
              description: 'بستن مانده بستانکار خلاصه سود و زیان (سود خالص)'
            },
            {
              id: 'c-net-2',
              accountCode: project.type === 'merchandising' ? '303' : '301',
              accountName: project.type === 'merchandising' ? 'سود و زیان انباشته' : 'سرمایه اولیه',
              debit: 0,
              credit: Math.abs(netIncome),
              description: 'انتقال سود خالص به سرمایه / سود انباشته'
            }
          ]
        : [
            {
              id: 'c-net-1',
              accountCode: project.type === 'merchandising' ? '303' : '301',
              accountName: project.type === 'merchandising' ? 'سود و زیان انباشته' : 'سرمایه اولیه',
              debit: Math.abs(netIncome),
              credit: 0,
              description: 'انتقال زیان خالص به سرمایه / سود انباشته'
            },
            {
              id: 'c-net-2',
              accountCode: '304',
              accountName: 'خلاصه سود و زیان (حساب واسطه بستن)',
              debit: 0,
              credit: Math.abs(netIncome),
              description: 'بستن مانده بدهکار خلاصه سود و زیان (زیان خالص)'
            }
          ];

      generated.push({
        id: Math.random().toString(36).substring(2, 9),
        entryNumber: curNumber++,
        date: `${project.fiscalYear}/12/29`,
        description: `سند بستن حساب خلاصه سود و زیان به ${project.type === 'merchandising' ? 'سود انباشته' : 'حساب سرمایه'}`,
        type: 'closing',
        items: netItems,
        createdAt: new Date().toISOString()
      });
    }

    // سند ۴: بستن حساب برداشت به سرمایه
    if (drawingsBalance > 0) {
      generated.push({
        id: Math.random().toString(36).substring(2, 9),
        entryNumber: curNumber++,
        date: `${project.fiscalYear}/12/29`,
        description: 'سند بستن حساب برداشت شخصی مالک به حساب سرمایه',
        type: 'closing',
        items: [
          {
            id: 'c-draw-1',
            accountCode: '301',
            accountName: 'سرمایه اولیه',
            debit: drawingsBalance,
            credit: 0,
            description: 'کاهش سرمایه بابت برداشت‌های طی سال'
          },
          {
            id: 'c-draw-2',
            accountCode: '302',
            accountName: 'برداشت شخصی مالک',
            debit: 0,
            credit: drawingsBalance,
            description: 'صفر کردن مانده حساب برداشت'
          }
        ],
        createdAt: new Date().toISOString()
      });
    }

    if (generated.length === 0) {
      alert('حساب موقتی با مانده فعال برای بستن یافت نشد.');
      return;
    }

    onSaveClosingEntries(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base">بستن حساب‌های موقت پایان سال (Closing Entries)</h2>
              <p className="text-[11px] text-slate-300">مرحله نهایی چرخه حسابداری کلاسی دوره {project.fiscalYear}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Educational Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-950">
              <BookCheck className="w-4 h-4 text-emerald-700" />
              ۴ مرحله استاندارد آموزش داده شده در دانشگاه:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-900">
              <li>بستن حساب‌های درآمد به خلاصه سود و زیان (کد ۳۰۴)</li>
              <li>بستن حساب‌های هزینه و بهای تمام شده به خلاصه سود و زیان</li>
              <li>بستن مانده حساب خلاصه سود و زیان (سود یا زیان دوره) به سرمایه یا سود انباشته</li>
              <li>بستن حساب برداشت شخصی به حساب سرمایه</li>
            </ol>
          </div>

          {/* Accounts Summary to be closed */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-slate-700">حساب‌های درآمد قابل بستن:</div>
              {revenueAccounts.length === 0 ? (
                <div className="text-[11px] text-slate-400">گردش درآمدی ثبت نشده است.</div>
              ) : (
                revenueAccounts.map(a => (
                  <div key={a.code} className="flex justify-between text-xs font-mono text-emerald-800">
                    <span>{a.code} - {a.name}</span>
                    <span className="font-bold">{formatCurrency(a.creditBalance, project.currency)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-slate-700">حساب‌های هزینه قابل بستن:</div>
              {expenseAccounts.length === 0 ? (
                <div className="text-[11px] text-slate-400">گردش هزینه‌ای ثبت نشده است.</div>
              ) : (
                expenseAccounts.map(a => (
                  <div key={a.code} className="flex justify-between text-xs font-mono text-rose-800">
                    <span>{a.code} - {a.name}</span>
                    <span className="font-bold">{formatCurrency(a.balance, project.currency)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Net Income Summary */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400">سود/زیان حاصله برای انتقال به سرمایه:</div>
                <div className="text-sm font-bold text-emerald-400">
                  {incomeStatement.netIncome >= 0 ? 'سود خالص سال جاری' : 'زیان خالص سال جاری'}
                </div>
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {formatCurrency(incomeStatement.netIncome, project.currency)}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleExecuteClosing}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              صدور خودکار اسناد ۴ گانه بستن حساب‌ها در روزنامه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
