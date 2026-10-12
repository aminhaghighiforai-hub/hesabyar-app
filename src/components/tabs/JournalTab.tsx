import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Scale,
  Calendar,
  FileText
} from 'lucide-react';
import { JournalEntry, EntryType, CompanyProject } from '../../types/accounting';
import { formatCurrency, formatNumberOnly } from '../../utils/accountingCalculations';

interface JournalTabProps {
  entries: JournalEntry[];
  project: CompanyProject;
  onOpenNewEntry: () => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  entries,
  project,
  onOpenNewEntry,
  onEditEntry,
  onDeleteEntry
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEntries = entries
    .filter(entry => {
      if (filterType !== 'all' && entry.type !== filterType) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inDesc = entry.description.toLowerCase().includes(q);
      const inItems = entry.items.some(
        it => it.accountName.toLowerCase().includes(q) || it.accountCode.includes(q)
      );
      return inDesc || inItems;
    })
    .sort((a, b) => a.entryNumber - b.entryNumber);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 pt-3">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
            دفتر روزنامه (General Journal)
          </h2>
          <p className="text-[11px] text-slate-500">
            ثبت کلیه رویدادهای مالی به صورت دوبل به ترتیب تاریخ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-xs font-bold transition-colors"
            title="چاپ یا ذخیره PDF دفتر روزنامه"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">چاپ کلاسی</span>
          </button>
          <button
            onClick={onOpenNewEntry}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-md shadow-emerald-600/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>سند جدید</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس شرح سند یا نام و کد حساب..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:outline-emerald-600"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه اسناد ({entries.length})
          </button>
          <button
            onClick={() => setFilterType('regular')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              filterType === 'regular'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            عادی
          </button>
          <button
            onClick={() => setFilterType('adjusting')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              filterType === 'adjusting'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ثبت‌های اصلاحی
          </button>
          <button
            onClick={() => setFilterType('trade')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              filterType === 'trade' || filterType === 'purchase' || filterType === 'sale'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            خرید و فروش
          </button>
          <button
            onClick={() => setFilterType('closing')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
              filterType === 'closing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            بستن حساب‌ها
          </button>
        </div>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-slate-200">
            <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-600">سندی مطابق این جستجو یا فیلتر یافت نشد.</div>
            <p className="text-[11px] text-slate-400 mt-1">
              با زدن دکمه «سند جدید» می‌توانید اولین رویداد مالی کلاسی را ثبت کنید.
            </p>
          </div>
        ) : (
          filteredEntries.map(entry => {
            const sumDebit = entry.items.reduce((s, it) => s + (it.debit || 0), 0);
            const sumCredit = entry.items.reduce((s, it) => s + (it.credit || 0), 0);

            return (
              <div 
                key={entry.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Entry Top Header */}
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs">
                      #{entry.entryNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {entry.description}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{entry.date}</span>
                        <span>·</span>
                        <span className={
                          entry.type === 'adjusting' ? 'text-amber-700 font-bold' :
                          entry.type === 'closing' ? 'text-blue-700 font-bold' : 'text-slate-600'
                        }>
                          {entry.type === 'adjusting' ? 'ثبت اصلاحی پایان دوره' :
                           entry.type === 'closing' ? 'سند بستن حساب‌ها' :
                           entry.type === 'opening' ? 'سند افتتاحیه' :
                           entry.type === 'purchase' ? 'سند خرید کالا' :
                           entry.type === 'sale' ? 'سند فروش کالا' : 'سند عادی روزنامه'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditEntry(entry)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="ویرایش سند"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`آیا از حذف سند شماره ${entry.entryNumber} اطمینان دارید؟`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف سند"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Double Entry Articles Table */}
                <div className="p-3 overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-400 border-b border-slate-100">
                        <th className="pb-1 font-medium w-16">کد حساب</th>
                        <th className="pb-1 font-medium">عنوان حساب و شرح آرتیکل</th>
                        <th className="pb-1 font-medium text-left w-24 sm:w-28 text-emerald-700">بدهکار</th>
                        <th className="pb-1 font-medium text-left w-24 sm:w-28 text-rose-700">بستانکار</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {entry.items.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/50">
                          <td className="py-2 text-[11px] font-mono text-slate-500">
                            {item.accountCode}
                          </td>
                          <td className="py-2">
                            <div className={`font-medium ${item.credit > 0 ? 'pr-4 text-slate-700' : 'text-slate-900 font-bold'}`}>
                              {item.accountName}
                            </div>
                            {item.description && (
                              <div className="text-[10px] text-slate-400 pr-4 mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </td>
                          <td className="py-2 text-left font-mono font-bold text-emerald-700">
                            {item.debit > 0 ? formatNumberOnly(item.debit) : '-'}
                          </td>
                          <td className="py-2 text-left font-mono font-bold text-rose-700">
                            {item.credit > 0 ? formatNumberOnly(item.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Entry Balance Status Footer */}
                <div className="px-3.5 py-2 bg-slate-50 text-[11px] flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تراز است</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono font-bold text-slate-700">
                    <span>جمع: {formatCurrency(sumDebit, project.currency)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
