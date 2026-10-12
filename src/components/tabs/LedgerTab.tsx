import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Table, 
  Split, 
  Printer, 
  ArrowLeft,
  Filter
} from 'lucide-react';
import { JournalEntry, Account, AccountCategory } from '../../types/accounting';
import { calculateLedger, formatCurrency, formatNumberOnly } from '../../utils/accountingCalculations';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../../data/defaultChartOfAccounts';

interface LedgerTabProps {
  entries: JournalEntry[];
  currency?: 'toman' | 'rial';
}

export const LedgerTab: React.FC<LedgerTabProps> = ({
  entries,
  currency = 'toman'
}) => {
  const [viewMode, setViewMode] = useState<'t_account' | 'table'>('t_account');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const ledger = calculateLedger(entries, DEFAULT_CHART_OF_ACCOUNTS);

  // حساب‌هایی که گردش دارند یا کاربر در آنها سرچ کرده
  const activeAccounts = Object.values(ledger).filter(accSummary => {
    const hasActivity = accSummary.debitTurnover > 0 || accSummary.creditTurnover > 0;
    if (!hasActivity) return false;

    if (selectedCategory !== 'all' && accSummary.account.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = accSummary.account.name.toLowerCase().includes(q);
      const matchCode = accSummary.account.code.includes(q);
      return matchName || matchCode;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 pt-3">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
            دفاتر کل و معین (General Ledger)
          </h2>
          <p className="text-[11px] text-slate-500">
            گردش و مانده‌گیری حساب‌ها در قالب T-Account یا جدول رسمی
          </p>
        </div>

        {/* View Mode Switcher (T-Account vs Table) */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
          <button
            onClick={() => setViewMode('t_account')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 't_account' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="حساب‌های تی شکل (روش کلاسی)"
          >
            <Split className="w-3.5 h-3.5" />
            <span className="text-[10px]">حساب‌های T</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="جدول رسمی دفتر کل"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="text-[10px]">جدول رسمی</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو در حساب‌های دفتر کل..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه حساب‌های فعال ({activeAccounts.length})
          </button>
          <button
            onClick={() => setSelectedCategory('asset')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'asset' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            دارایی‌ها
          </button>
          <button
            onClick={() => setSelectedCategory('liability')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'liability' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            بدهی‌ها
          </button>
          <button
            onClick={() => setSelectedCategory('equity')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'equity' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            سرمایه
          </button>
          <button
            onClick={() => setSelectedCategory('revenue')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'revenue' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            درآمدها
          </button>
          <button
            onClick={() => setSelectedCategory('expense')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'expense' || selectedCategory === 'cogs' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            هزینه‌ها و بهای تمام شده
          </button>
        </div>
      </div>

      {/* Render Ledger Items */}
      {activeAccounts.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center border border-slate-200">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-600">گردشی در این حساب‌ها ثبت نشده است.</div>
        </div>
      ) : viewMode === 't_account' ? (
        /* ---------------- T-ACCOUNT VIEW ---------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeAccounts.map(accSummary => {
            const debits = accSummary.entries.filter(e => e.debit > 0);
            const credits = accSummary.entries.filter(e => e.credit > 0);
            const maxRows = Math.max(debits.length, credits.length, 1);

            return (
              <div 
                key={accSummary.account.code}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* T-Bar Header */}
                <div className="bg-slate-900 text-white p-3 text-center border-b border-slate-800">
                  <div className="text-xs font-bold">{accSummary.account.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    کد حساب: {accSummary.account.code}
                  </div>
                </div>

                {/* T-Columns: Left Debit, Right Credit (RTL aware: راست بدهکار، چپ بستانکار در استانداردهای فارسی یا برعکس) */}
                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-300 p-2 text-xs flex-1">
                  
                  {/* راست: بدهکار (Debit) */}
                  <div className="px-2 space-y-1.5">
                    <div className="text-[10px] font-bold text-emerald-700 border-b border-slate-200 pb-1 text-center">
                      بدهکار (Debit)
                    </div>
                    {debits.length === 0 ? (
                      <div className="text-[10px] text-slate-300 text-center py-2">-</div>
                    ) : (
                      debits.map((d, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400 text-[10px]">#{d.entryNumber}</span>
                          <span className="text-emerald-800 font-bold">{formatNumberOnly(d.debit)}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* چپ: بستانکار (Credit) */}
                  <div className="px-2 space-y-1.5">
                    <div className="text-[10px] font-bold text-rose-700 border-b border-slate-200 pb-1 text-center">
                      بستانکار (Credit)
                    </div>
                    {credits.length === 0 ? (
                      <div className="text-[10px] text-slate-300 text-center py-2">-</div>
                    ) : (
                      credits.map((c, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400 text-[10px]">#{c.entryNumber}</span>
                          <span className="text-rose-800 font-bold">{formatNumberOnly(c.credit)}</span>
                        </div>
                      ))
                    )}
                  </div>

                </div>

                {/* T-Account Bottom Line: Turnovers and Net Balance */}
                <div className="bg-slate-50 border-t-2 border-slate-300 p-2.5 text-xs">
                  <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-200 pb-1.5 border-b border-slate-200 text-[11px] font-mono font-bold">
                    <div className="text-emerald-700 text-left pl-2">
                      گردش: {formatNumberOnly(accSummary.debitTurnover)}
                    </div>
                    <div className="text-rose-700 text-left pr-2">
                      گردش: {formatNumberOnly(accSummary.creditTurnover)}
                    </div>
                  </div>

                  {/* Final Net Balance */}
                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600">مانده نهایی حساب:</span>
                    <span className={`font-mono ${
                      accSummary.balanceDebit > 0 ? 'text-emerald-700' :
                      accSummary.balanceCredit > 0 ? 'text-rose-700' : 'text-slate-500'
                    }`}>
                      {accSummary.balanceDebit > 0 && `${formatCurrency(accSummary.balanceDebit, currency)} (بدهکار)`}
                      {accSummary.balanceCredit > 0 && `${formatCurrency(accSummary.balanceCredit, currency)} (بستانکار)`}
                      {accSummary.balanceDebit === 0 && accSummary.balanceCredit === 0 && 'تراز (مانده صفر)'}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* ---------------- STANDARD TABLE VIEW ---------------- */
        <div className="space-y-4">
          {activeAccounts.map(accSummary => (
            <div 
              key={accSummary.account.code}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Account Title Header */}
              <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {accSummary.account.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500 mr-2">
                    (کد {accSummary.account.code})
                  </span>
                </div>
                <div className="text-xs font-bold font-mono">
                  {accSummary.balanceDebit > 0 && (
                    <span className="text-emerald-700">مانده: {formatCurrency(accSummary.balanceDebit, currency)} بد</span>
                  )}
                  {accSummary.balanceCredit > 0 && (
                    <span className="text-rose-700">مانده: {formatCurrency(accSummary.balanceCredit, currency)} بس</span>
                  )}
                  {accSummary.balanceDebit === 0 && accSummary.balanceCredit === 0 && (
                    <span className="text-slate-500">مانده: ۰</span>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 font-medium">تاریخ</th>
                      <th className="py-2 px-3 font-medium">شماره سند</th>
                      <th className="py-2 px-3 font-medium">شرح رویداد</th>
                      <th className="py-2 px-3 font-medium text-left text-emerald-700">بدهکار</th>
                      <th className="py-2 px-3 font-medium text-left text-rose-700">بستانکار</th>
                      <th className="py-2 px-3 font-medium text-center">تشخیص</th>
                      <th className="py-2 px-3 font-medium text-left">مانده</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accSummary.entries.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 font-mono text-[11px]">
                        <td className="py-2 px-3 text-slate-500">{entry.date}</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">#{entry.entryNumber}</td>
                        <td className="py-2 px-3 font-sans text-slate-800">{entry.description}</td>
                        <td className="py-2 px-3 text-left font-bold text-emerald-700">
                          {entry.debit > 0 ? formatNumberOnly(entry.debit) : '-'}
                        </td>
                        <td className="py-2 px-3 text-left font-bold text-rose-700">
                          {entry.credit > 0 ? formatNumberOnly(entry.credit) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-sans font-bold text-[10px]">
                          {entry.balanceType === 'بدهکار' ? 'بد' : entry.balanceType === 'بستانکار' ? 'بس' : '-'}
                        </td>
                        <td className="py-2 px-3 text-left font-bold text-slate-900">
                          {formatNumberOnly(entry.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
