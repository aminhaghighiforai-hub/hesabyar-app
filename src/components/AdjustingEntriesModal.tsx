import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Check, 
  HelpCircle, 
  Calculator,
  ArrowRight,
  TrendingDown,
  Layers,
  Clock
} from 'lucide-react';
import { JournalEntry, JournalItem } from '../types/accounting';
import { formatCurrency } from '../utils/accountingCalculations';

interface AdjustingEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entry: JournalEntry) => void;
  nextEntryNumber: number;
  fiscalYear: string;
  currency?: 'toman' | 'rial';
}

type AdjustmentCategory = 'supplies' | 'depreciation' | 'prepaid' | 'unearned';

export const AdjustingEntriesModal: React.FC<AdjustingEntriesModalProps> = ({
  isOpen,
  onClose,
  onSaveEntry,
  nextEntryNumber,
  fiscalYear,
  currency = 'toman'
}) => {
  const [activeCategory, setActiveCategory] = useState<AdjustmentCategory>('supplies');

  // 1. Supplies calculation state
  const [suppliesLedgerBalance, setSuppliesLedgerBalance] = useState<number>(6000000); // مانده دفتر کل
  const [suppliesEndingPhysical, setSuppliesEndingPhysical] = useState<number>(1500000); // موجودی انبارگردانی

  // 2. Depreciation state
  const [assetType, setAssetType] = useState<'equipment' | 'vehicle' | 'building'>('equipment');
  const [assetCost, setAssetCost] = useState<number>(30000000);
  const [salvageValue, setSalvageValue] = useState<number>(0);
  const [usefulLife, setUsefulLife] = useState<number>(10); // ۱۰ سال

  // 3. Prepaid expenses state
  const [prepaidType, setPrepaidType] = useState<'insurance' | 'rent'>('insurance');
  const [prepaidTotal, setPrepaidTotal] = useState<number>(12000000);
  const [totalMonths, setTotalMonths] = useState<number>(12);
  const [expiredMonths, setExpiredMonths] = useState<number>(8);

  // 4. Unearned revenue state
  const [unearnedTotal, setUnearnedTotal] = useState<number>(20000000);
  const [earnedPortion, setEarnedPortion] = useState<number>(10000000);

  if (!isOpen) return null;

  // Calculators
  const suppliesUsed = Math.max(0, suppliesLedgerBalance - suppliesEndingPhysical);
  const annualDepreciation = usefulLife > 0 ? Math.round((assetCost - salvageValue) / usefulLife) : 0;
  const prepaidExpired = totalMonths > 0 ? Math.round((prepaidTotal / totalMonths) * expiredMonths) : 0;

  const handleCreateAdjustment = (category: AdjustmentCategory) => {
    const entryId = Math.random().toString(36).substring(2, 9);
    let items: JournalItem[] = [];
    let desc = '';

    if (category === 'supplies') {
      desc = `ثبت اصلاحی پایان دوره ${fiscalYear}: ملزومات مصرف شده طی سال بر اساس انبارگردانی`;
      items = [
        {
          id: 'adj-1',
          accountCode: '604',
          accountName: 'هزینه ملزومات مصرف شده',
          debit: suppliesUsed,
          credit: 0,
          description: 'شناسایی هزینه ملزومات مصرفی دوره'
        },
        {
          id: 'adj-2',
          accountCode: '106',
          accountName: 'ملزومات اداری و مصرفی',
          debit: 0,
          credit: suppliesUsed,
          description: 'کاهش مانده دارایی ملزومات'
        }
      ];
    } else if (category === 'depreciation') {
      const assetInfo = 
        assetType === 'equipment' ? { contraCode: '125', contraName: 'استهلاک انباشته اثاثه (کاهنده دارایی)', label: 'اثاثه و تجهیزات' } :
        assetType === 'vehicle' ? { contraCode: '127', contraName: 'استهلاک انباشته وسایط نقلیه (کاهنده دارایی)', label: 'وسایط نقلیه' } :
        { contraCode: '123', contraName: 'استهلاک انباشته ساختمان (کاهنده دارایی)', label: 'ساختمان' };

      desc = `ثبت اصلاحی پایان دوره ${fiscalYear}: هزینه استهلاک سالانه ${assetInfo.label} (روش خط مستقیم)`;
      items = [
        {
          id: 'adj-1',
          accountCode: '603',
          accountName: 'هزینه استهلاک دارایی‌های ثابت',
          debit: annualDepreciation,
          credit: 0,
          description: `استهلاک ${assetInfo.label}`
        },
        {
          id: 'adj-2',
          accountCode: assetInfo.contraCode,
          accountName: assetInfo.contraName,
          debit: 0,
          credit: annualDepreciation,
          description: `افزایش استهلاک انباشته ${assetInfo.label}`
        }
      ];
    } else if (category === 'prepaid') {
      const isRent = prepaidType === 'rent';
      desc = `ثبت اصلاحی پایان دوره ${fiscalYear}: منقضی شدن ${expiredMonths} ماه از پیش‌پرداخت ${isRent ? 'اجاره' : 'بیمه'}`;
      items = [
        {
          id: 'adj-1',
          accountCode: isRent ? '602' : '606',
          accountName: isRent ? 'هزینه اجاره محل' : 'هزینه بیمه',
          debit: prepaidExpired,
          credit: 0,
          description: `هزینه ${isRent ? 'اجاره' : 'بیمه'} منقضی شده`
        },
        {
          id: 'adj-2',
          accountCode: '105',
          accountName: 'پیش‌پرداخت‌ها (بیمه / اجاره)',
          debit: 0,
          credit: prepaidExpired,
          description: 'کاهش مانده حساب پیش‌پرداخت'
        }
      ];
    } else if (category === 'unearned') {
      desc = `ثبت اصلاحی پایان دوره ${fiscalYear}: شناسایی بخش تحقق‌یافته از پیش‌دریافت خدمات`;
      items = [
        {
          id: 'adj-1',
          accountCode: '203',
          accountName: 'پیش‌دریافت‌ها (پیش‌دریافت درآمد)',
          debit: earnedPortion,
          credit: 0,
          description: 'کاهش بدهی پیش‌دریافت'
        },
        {
          id: 'adj-2',
          accountCode: '401',
          accountName: 'درآمد ارائه خدمات',
          debit: 0,
          credit: earnedPortion,
          description: 'شناسایی درآمد حاصله'
        }
      ];
    }

    const newEntry: JournalEntry = {
      id: entryId,
      entryNumber: nextEntryNumber,
      date: `${fiscalYear}/12/29`,
      description: desc,
      type: 'adjusting',
      items,
      createdAt: new Date().toISOString()
    };

    onSaveEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base">ثبت‌های اصلاحی و تعدیلی پایان دوره مالی</h2>
              <p className="text-[11px] text-slate-300">مطابق استاندارد حسابداری تعهدی و اصل تطابق</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for Adjustments */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 grid grid-cols-4 gap-1.5 shrink-0 text-center">
          <button
            type="button"
            onClick={() => setActiveCategory('supplies')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'supplies' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            ملزومات مصرفی
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('depreciation')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'depreciation' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            استهلاک دارایی
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('prepaid')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'prepaid' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            پیش‌پرداخت منقضی
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('unearned')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'unearned' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            پیش‌دریافت درآمد
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: SUPPLIES */}
          {activeCategory === 'supplies' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <span className="font-bold block mb-1">📘 منطق کلاسی حسابداری ملزومات:</span>
                ملزومات مصرف شده طی سال = مانده حساب ملزومات در دفتر کل منهای موجودی فیزیکی واقعی در انبارگردانی پایان سال.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    مانده ملزومات در دفاتر ({currency === 'toman' ? 'تومان' : 'ریال'})
                  </label>
                  <input
                    type="number"
                    value={suppliesLedgerBalance}
                    onChange={e => setSuppliesLedgerBalance(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    موجودی عینی پایان سال
                  </label>
                  <input
                    type="number"
                    value={suppliesEndingPhysical}
                    onChange={e => setSuppliesEndingPhysical(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400">مبلغ هزینه ملزومات مصرف شده (آرتیکل اصلاحی):</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(suppliesUsed, currency)}
                </div>
                <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800 space-y-1">
                  <div>بدهکار: هزینه ملزومات مصرف شده (۶۰۴) → {formatCurrency(suppliesUsed, currency)}</div>
                  <div>بستانکار: ملزومات اداری و مصرفی (۱۰۶) → {formatCurrency(suppliesUsed, currency)}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCreateAdjustment('supplies')}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
              >
                صدور سند اصلاحی ملزومات در دفتر روزنامه
              </button>
            </div>
          )}

          {/* TAB 2: DEPRECIATION */}
          {activeCategory === 'depreciation' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <span className="font-bold block mb-1">📘 فرمول خط مستقیم استهلاک:</span>
                استهلاک سالانه = (بهای تمام شده دارایی - ارزش اسقاط) تقسیم بر عمر مفید (سال).
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">نوع دارایی</label>
                  <select
                    value={assetType}
                    onChange={e => setAssetType(e.target.value as any)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-600"
                  >
                    <option value="equipment">اثاثه و تجهیزات اداری</option>
                    <option value="vehicle">وسایط نقلیه</option>
                    <option value="building">ساختمان</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">بهای تمام شده دارایی</label>
                  <input
                    type="number"
                    value={assetCost}
                    onChange={e => setAssetCost(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ارزش اسقاط (Salvage Value)</label>
                  <input
                    type="number"
                    value={salvageValue}
                    onChange={e => setSalvageValue(Number(e.target.value))}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">عمر مفید برحسب سال</label>
                  <input
                    type="number"
                    min="1"
                    value={usefulLife}
                    onChange={e => setUsefulLife(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400">استهلاک سالانه محاسبه شده:</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(annualDepreciation, currency)}
                </div>
                <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800 space-y-1">
                  <div>بدهکار: هزینه استهلاک دارایی‌های ثابت (۶۰۳) → {formatCurrency(annualDepreciation, currency)}</div>
                  <div>بستانکار: استهلاک انباشته (حساب کاهنده دارایی) → {formatCurrency(annualDepreciation, currency)}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCreateAdjustment('depreciation')}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
              >
                صدور سند اصلاحی استهلاک در روزنامه
              </button>
            </div>
          )}

          {/* TAB 3: PREPAID EXPENSES */}
          {activeCategory === 'prepaid' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <span className="font-bold block mb-1">📘 منطق کلاسی پیش‌پرداخت‌ها:</span>
                مبلغی که قبلاً پرداخت شده و دارایی بوده، با گذشت زمان تبدیل به هزینه می‌شود.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">عنوان پیش‌پرداخت</label>
                  <select
                    value={prepaidType}
                    onChange={e => setPrepaidType(e.target.value as any)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-600"
                  >
                    <option value="insurance">پیش‌پرداخت بیمه</option>
                    <option value="rent">پیش‌پرداخت اجاره</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">کل مبلغ پیش‌پرداخت شده</label>
                  <input
                    type="number"
                    value={prepaidTotal}
                    onChange={e => setPrepaidTotal(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">کل مدت قرارداد (ماه)</label>
                  <input
                    type="number"
                    value={totalMonths}
                    onChange={e => setTotalMonths(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">تعداد ماه‌های منقضی شده</label>
                  <input
                    type="number"
                    value={expiredMonths}
                    onChange={e => setExpiredMonths(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400">مبلغ هزینه منقضی شده دوره:</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(prepaidExpired, currency)}
                </div>
                <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800 space-y-1">
                  <div>بدهکار: هزینه {prepaidType === 'rent' ? 'اجاره' : 'بیمه'} → {formatCurrency(prepaidExpired, currency)}</div>
                  <div>بستانکار: پیش‌پرداخت‌ها (۱۰۵) → {formatCurrency(prepaidExpired, currency)}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCreateAdjustment('prepaid')}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
              >
                صدور سند اصلاحی پیش‌پرداخت
              </button>
            </div>
          )}

          {/* TAB 4: UNEARNED REVENUE */}
          {activeCategory === 'unearned' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <span className="font-bold block mb-1">📘 منطق کلاسی پیش‌دریافت‌ها:</span>
                مبالغ دریافتی از مشتری در ابتدا به عنوان بدهی (تعهد انجام کار) ثبت شده و به تناسب ارائه کار در پایان دوره به حساب درآمد منظور می‌گردد.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">کل پیش‌دریافت اولیه</label>
                  <input
                    type="number"
                    value={unearnedTotal}
                    onChange={e => setUnearnedTotal(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">بخش انجام و تحقق یافته</label>
                  <input
                    type="number"
                    value={earnedPortion}
                    onChange={e => setEarnedPortion(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-left focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="text-xs text-slate-400">درآمد شناسایی شده در پایان دوره:</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(earnedPortion, currency)}
                </div>
                <div className="text-[11px] text-slate-300 pt-2 border-t border-slate-800 space-y-1">
                  <div>بدهکار: پیش‌دریافت‌ها (۲۰۳) → {formatCurrency(earnedPortion, currency)}</div>
                  <div>بستانکار: درآمد ارائه خدمات (۴۰۱) → {formatCurrency(earnedPortion, currency)}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCreateAdjustment('unearned')}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
              >
                صدور سند اصلاحی پیش‌دریافت
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
