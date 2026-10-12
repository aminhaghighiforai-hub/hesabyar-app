import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Search,
  Scale
} from 'lucide-react';
import { JournalEntry, JournalItem, EntryType, Account } from '../types/accounting';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../data/defaultChartOfAccounts';
import { formatCurrency, formatNumberOnly } from '../utils/accountingCalculations';

interface JournalEntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  nextEntryNumber: number;
  initialEntry?: JournalEntry | null;
  accounts?: Account[];
  currency?: 'toman' | 'rial';
}

export const JournalEntryFormModal: React.FC<JournalEntryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  nextEntryNumber,
  initialEntry,
  accounts = DEFAULT_CHART_OF_ACCOUNTS,
  currency = 'toman'
}) => {
  const [entryNumber, setEntryNumber] = useState<number>(nextEntryNumber);
  const [date, setDate] = useState<string>('1403/02/01');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<EntryType>('regular');
  const [items, setItems] = useState<JournalItem[]>([
    { id: '1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 0, credit: 0, description: '' },
    { id: '2', accountCode: '301', accountName: 'سرمایه اولیه', debit: 0, credit: 0, description: '' }
  ]);
  const [accountSearchQuery, setAccountSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialEntry) {
      setEntryNumber(initialEntry.entryNumber);
      setDate(initialEntry.date);
      setDescription(initialEntry.description);
      setType(initialEntry.type);
      setItems(initialEntry.items);
    } else {
      setEntryNumber(nextEntryNumber);
      setDate('1403/02/01');
      setDescription('');
      setType('regular');
      setItems([
        { id: '1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 0, credit: 0, description: '' },
        { id: '2', accountCode: '301', accountName: 'سرمایه اولیه', debit: 0, credit: 0, description: '' }
      ]);
    }
  }, [initialEntry, nextEntryNumber, isOpen]);

  if (!isOpen) return null;

  // Calculators
  const totalDebit = items.reduce((sum, item) => sum + Number(item.debit || 0), 0);
  const totalCredit = items.reduce((sum, item) => sum + Number(item.credit || 0), 0);
  const diff = Math.abs(totalDebit - totalCredit);
  const isBalanced = diff === 0 && totalDebit > 0;

  const handleAccountChange = (itemId: string, accountCode: string) => {
    const selectedAcc = accounts.find(a => a.code === accountCode);
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          accountCode,
          accountName: selectedAcc ? selectedAcc.name : item.accountName
        };
      }
      return item;
    }));
  };

  const handleItemValueChange = (
    itemId: string, 
    field: 'debit' | 'credit' | 'description', 
    value: any
  ) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleAddItem = (presetDebit = 0, presetCredit = 0) => {
    const newItem: JournalItem = {
      id: Math.random().toString(36).substring(2, 9),
      accountCode: '101',
      accountName: 'موجودی نقد و بانک (صندوق)',
      debit: presetDebit,
      credit: presetCredit,
      description: ''
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    if (items.length <= 2) {
      alert('حداقل ۲ آرتیکل (یک بدهکار و یک بستانکار) در هر سند حسابداری دوبل الزامی است.');
      return;
    }
    setItems(items.filter(i => i.id !== itemId));
  };

  // Quick Educational Presets for Accounting Students
  const applyPreset = (presetName: string) => {
    if (presetName === 'capital') {
      setDescription('تأسیس شرکت و واریز نقدی سرمایه به بانک');
      setItems([
        { id: '1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 50000000, credit: 0, description: 'واریز نقدی سرمایه' },
        { id: '2', accountCode: '301', accountName: 'سرمایه اولیه', debit: 0, credit: 50000000, description: 'ثبت سرمایه اولیه موسسان' }
      ]);
    } else if (presetName === 'credit_purchase') {
      setDescription('خرید نسیه کالا بر اساس فاکتور');
      setType('purchase');
      setItems([
        { id: '1', accountCode: '501', accountName: 'خرید ناخالص کالا (روش ادواری)', debit: 20000000, credit: 0, description: 'خرید کالای بازرگانی' },
        { id: '2', accountCode: '201', accountName: 'حساب‌های پرداختنی تجاری (بستانکاران)', debit: 0, credit: 20000000, description: 'بدهی بابت خرید نسیه' }
      ]);
    } else if (presetName === 'sale_mixed') {
      setDescription('فروش نقد و نسیه کالا');
      setType('sale');
      setItems([
        { id: '1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 15000000, credit: 0, description: 'دریافت نقد در بانک' },
        { id: '2', accountCode: '103', accountName: 'حساب‌های دریافتنی تجاری', debit: 15000000, credit: 0, description: 'طلب از خریدار' },
        { id: '3', accountCode: '402', accountName: 'فروش ناخالص کالا', debit: 0, credit: 30000000, description: 'فروش کالا' }
      ]);
    } else if (presetName === 'expense_rent') {
      setDescription('پرداخت هزینه اجاره محل با حواله بانکی');
      setItems([
        { id: '1', accountCode: '602', accountName: 'هزینه اجاره محل', debit: 8000000, credit: 0, description: 'اجاره ماه جاری' },
        { id: '2', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 0, credit: 8000000, description: 'پرداخت از حساب بانک' }
      ]);
    } else if (presetName === 'depreciation') {
      setDescription('ثبت اصلاحی پایان دوره: استهلاک تجهیزات و اثاثه');
      setType('adjusting');
      setItems([
        { id: '1', accountCode: '603', accountName: 'هزینه استهلاک دارایی‌های ثابت', debit: 3000000, credit: 0, description: 'استهلاک سال جاری اثاثه' },
        { id: '2', accountCode: '125', accountName: 'استهلاک انباشته اثاثه (کاهنده دارایی)', debit: 0, credit: 3000000, description: 'استهلاک انباشته' }
      ]);
    } else if (presetName === 'supplies') {
      setDescription('ثبت اصلاحی پایان دوره: ملزومات مصرف شده طی سال');
      setType('adjusting');
      setItems([
        { id: '1', accountCode: '604', accountName: 'هزینه ملزومات مصرف شده', debit: 2500000, credit: 0, description: 'شناسایی هزینه ملزومات' },
        { id: '2', accountCode: '106', accountName: 'ملزومات اداری و مصرفی', debit: 0, credit: 2500000, description: 'کاهش مانده ملزومات' }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('لطفاً شرح کلی سند حسابداری را وارد نمایید.');
      return;
    }

    if (!isBalanced) {
      alert(`سند حسابداری باید تراز باشد! در حال حاضر جمع بدهکار و بستانکار ${formatCurrency(diff, currency)} اختلاف دارد.`);
      return;
    }

    const newEntry: JournalEntry = {
      id: initialEntry ? initialEntry.id : Math.random().toString(36).substring(2, 9),
      entryNumber: Number(entryNumber),
      date: date.trim(),
      description: description.trim(),
      type,
      items: items.map(item => ({
        ...item,
        debit: Number(item.debit || 0),
        credit: Number(item.credit || 0),
        ref: item.accountCode
      })),
      createdAt: initialEntry?.createdAt || new Date().toISOString()
    };

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-emerald-950/20 flex flex-col max-h-[92vh] border border-emerald-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header (Green themed with shadow as requested) */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              {entryNumber}
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base">
                {initialEntry ? 'ویرایش سند حسابداری' : 'صدور سند جدید در دفتر روزنامه'}
              </h2>
              <p className="text-[11px] text-emerald-100">ثبت استاندارد دوبل (بدهکار / بستانکار)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Strip for Students */}
        <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[11px] text-emerald-900 font-bold whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            الگوهای کلاسی:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('capital')}
            className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap font-medium transition-colors"
          >
            سرمایه‌گذاری اولیه
          </button>
          <button
            type="button"
            onClick={() => applyPreset('credit_purchase')}
            className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap font-medium transition-colors"
          >
            خرید نسیه
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sale_mixed')}
            className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap font-medium transition-colors"
          >
            فروش کالا
          </button>
          <button
            type="button"
            onClick={() => applyPreset('expense_rent')}
            className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap font-medium transition-colors"
          >
            هزینه اجاره
          </button>
          <button
            type="button"
            onClick={() => applyPreset('supplies')}
            className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap font-medium transition-colors"
          >
            اصلاح ملزومات
          </button>
          <button
            type="button"
            onClick={() => applyPreset('depreciation')}
            className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap font-medium transition-colors"
          >
            اصلاح استهلاک
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form noValidate onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">شماره سند</label>
              <input
                type="number"
                value={entryNumber}
                onChange={e => setEntryNumber(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-center focus:outline-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">تاریخ سند</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="1403/01/15"
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-center focus:outline-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">نوع سند</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EntryType)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 focus:outline-emerald-600 focus:bg-white"
              >
                <option value="regular">عادی</option>
                <option value="adjusting">اصلاحی پایان دوره</option>
                <option value="opening">افتتاحیه</option>
                <option value="closing">بستن حساب‌ها</option>
                <option value="purchase">خرید</option>
                <option value="sale">فروش</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">شرح کلی سند</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="مثال: بابت خرید نسیه کالا از شرکت البرز یا پرداخت حقوق فروردین..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-600 focus:bg-white"
              required
            />
          </div>

          {/* Articles Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                آرتیکل‌های دوبل حسابداری
              </span>
              <button
                type="button"
                onClick={() => handleAddItem()}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن سطر
              </button>
            </div>

            {/* Articles List */}
            <div className="space-y-2.5">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 w-5 text-center">
                      {index + 1}
                    </span>
                    
                    {/* Account Selector */}
                    <div className="flex-1">
                      <select
                        value={item.accountCode}
                        onChange={e => handleAccountChange(item.id, e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl px-2 py-1.5 focus:outline-emerald-600"
                      >
                        {accounts.map(acc => (
                          <option key={acc.code} value={acc.code}>
                            {acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delete Row Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title="حذف ردیف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Debit / Credit Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-700 mb-0.5">
                        بدهکار ({currency === 'toman' ? 'تومان' : 'ریال'})
                      </label>
                      <input
                        type="number"
                        value={item.debit || ''}
                        onChange={e => {
                          const val = Number(e.target.value);
                          handleItemValueChange(item.id, 'debit', val);
                          if (val > 0) handleItemValueChange(item.id, 'credit', 0);
                        }}
                        placeholder="0"
                        className="w-full text-xs font-mono font-bold text-emerald-700 bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5 text-left focus:outline-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-rose-700 mb-0.5">
                        بستانکار ({currency === 'toman' ? 'تومان' : 'ریال'})
                      </label>
                      <input
                        type="number"
                        value={item.credit || ''}
                        onChange={e => {
                          const val = Number(e.target.value);
                          handleItemValueChange(item.id, 'credit', val);
                          if (val > 0) handleItemValueChange(item.id, 'debit', 0);
                        }}
                        placeholder="0"
                        className="w-full text-xs font-mono font-bold text-rose-700 bg-rose-50/40 border border-rose-200 rounded-xl px-2.5 py-1.5 text-left focus:outline-rose-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Row specific note */}
                  <div>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={e => handleItemValueChange(item.id, 'description', e.target.value)}
                      placeholder="شرح این ردیف (اختیاری)"
                      className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-emerald-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Balancing Status Footer */}
          <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">جمع بدهکار:</span>
              <span className="font-mono font-extrabold text-emerald-700">
                {formatCurrency(totalDebit, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">جمع بستانکار:</span>
              <span className="font-mono font-extrabold text-rose-700">
                {formatCurrency(totalCredit, currency)}
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {isBalanced ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className={`text-xs font-bold ${isBalanced ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isBalanced ? 'سند کاملاً تراز و معتبر است' : `عدم تراز! اختلاف: ${formatCurrency(diff, currency)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={!isBalanced}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all ${
                isBalanced
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 active:scale-98 shadow-emerald-600/30'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {initialEntry ? 'بروزرسانی سند' : 'ثبت قطعی در دفتر روزنامه'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
