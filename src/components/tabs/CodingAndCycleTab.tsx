import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  FolderTree, 
  Plus, 
  HelpCircle, 
  ArrowRight,
  BookMarked,
  Layers,
  Sparkles
} from 'lucide-react';
import { Account, AccountCategory } from '../../types/accounting';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../../data/defaultChartOfAccounts';

interface CodingAndCycleTabProps {
  accounts: Account[];
  onAddNewAccount: (account: Account) => void;
  onOpenClosingModal: () => void;
  onOpenAdjustingModal: () => void;
  onSelectTab: (tab: any) => void;
}

export const CodingAndCycleTab: React.FC<CodingAndCycleTabProps> = ({
  accounts,
  onAddNewAccount,
  onOpenClosingModal,
  onOpenAdjustingModal,
  onSelectTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cycle' | 'chart'>('cycle');
  const [newCode, setNewCode] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<AccountCategory>('expense');
  const [newNature, setNewNature] = useState<'debit' | 'credit'>('debit');
  const [isAddingAcc, setIsAddingAcc] = useState<boolean>(false);

  const cycleSteps = [
    { id: 1, title: '۱. جمع‌آوری و تحلیل مدارک مثبته', desc: 'بررسی فاکتورها، رسیدهای بانکی، چک‌ها و اسناد خرید و فروش', tab: 'dashboard' },
    { id: 2, title: '۲. ثبت رویدادهای مالی در دفتر روزنامه', desc: 'صدور اسناد دوبل حسابداری با رعایت برابری بدهکار و بستانکار', tab: 'journal' },
    { id: 3, title: '۳. انتقال آرتیکل‌ها به دفتر کل و معین', desc: 'طبقه‌بندی در حساب‌های T شکل و استخراج مانده هر حساب', tab: 'ledger' },
    { id: 4, title: '۴. تهیه تراز آزمایشی قبل از اصلاحات', desc: 'تراز آزمایشی ۲ یا ۴ ستونی جهت سنجش صحت توازن دفاتر', tab: 'reports' },
    { id: 5, title: '۵. انجام ثبت‌های تعدیلی و اصلاحی', desc: 'شناسایی استهلاک، ملزومات مصرفی، بیمه منقضی و پیش‌دریافت‌ها', action: 'adjusting' },
    { id: 6, title: '۶. تهیه تراز آزمایشی ۶ ستونی اصلاح شده', desc: 'تراز تلفیقی قبل از اصلاحات + اصلاحات = پس از اصلاحات', tab: 'reports' },
    { id: 7, title: '۷. تهیه صورت‌های مالی اساسی', desc: 'صورت سود و زیان (خدماتی/بازرگانی)، گردش سرمایه و ترازنامه', tab: 'reports' },
    { id: 8, title: '۸. بستن حساب‌های موقت پایان سال', desc: 'بستن درآمد و هزینه به خلاصه سود و زیان و انتقال به سرمایه', action: 'closing' },
    { id: 9, title: '۹. صدور سند اختتامیه و افتتاحیه دوره بعد', desc: 'بستن حساب‌های دائمی ترازنامه و انتقال به دوره مالی جدید', tab: 'reports' }
  ];

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      alert('لطفاً کد و نام حساب را کامل وارد کنید.');
      return;
    }

    const acc: Account = {
      code: newCode.trim(),
      name: newName.trim(),
      category: newCategory,
      subCategory: newCategory === 'asset' ? 'current_asset' : 'operating_expense',
      nature: newNature,
      isPermanent: newCategory === 'asset' || newCategory === 'liability' || newCategory === 'equity'
    };

    onAddNewAccount(acc);
    setIsAddingAcc(false);
    setNewCode('');
    setNewName('');
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 pt-3">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
            راهنمای چرخه و درخت کدینگ حساب‌ها
          </h2>
          <p className="text-[11px] text-slate-500">
            آموزش قدم به قدم چرخه کامل حسابداری و مشاهده کدهای استاندارد
          </p>
        </div>
      </div>

      {/* Switcher */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-1 text-center">
        <button
          onClick={() => setActiveSubTab('cycle')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'cycle' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          چک‌لیست ۹ مرحله چرخه حسابداری
        </button>
        <button
          onClick={() => setActiveSubTab('chart')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'chart' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          درخت کدینگ حساب‌ها ({accounts.length})
        </button>
      </div>

      {/* VIEW 1: CYCLE */}
      {activeSubTab === 'cycle' && (
        <div className="space-y-3">
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
            <span className="font-bold block mb-1">🎓 نقشه راه تحویل پروژه کلاسی به استاد:</span>
            برای انجام کامل پروژه‌های درسی، مراحل زیر را به ترتیب انجام دهید. روی هر مرحله کلیک کنید تا به بخش مربوطه منتقل شوید.
          </div>

          <div className="space-y-2">
            {cycleSteps.map(step => (
              <div
                key={step.id}
                onClick={() => {
                  if (step.action === 'adjusting') onOpenAdjustingModal();
                  else if (step.action === 'closing') onOpenClosingModal();
                  else if (step.tab) onSelectTab(step.tab);
                }}
                className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold text-xs shrink-0 font-mono group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {step.id}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700 shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CHART OF ACCOUNTS */}
      {activeSubTab === 'chart' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">کدینگ استاندارد دانشگاهی</span>
            <button
              onClick={() => setIsAddingAcc(true)}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              افزودن حساب جدید
            </button>
          </div>

          {/* Add Account Modal Form inline */}
          {isAddingAcc && (
            <form onSubmit={handleAddAccountSubmit} className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2.5">
              <span className="text-xs font-bold text-emerald-950 block">مشخصات حساب جدید:</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="کد حساب (مثلاً ۶۱۰)"
                  className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-emerald-600 font-mono"
                  required
                />
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="نام حساب (مثلاً هزینه آموزش)"
                  className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-emerald-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-emerald-600 font-bold"
                >
                  <option value="asset">دارایی‌ها</option>
                  <option value="liability">بدهی‌ها</option>
                  <option value="equity">سرمایه و حقوق مالکان</option>
                  <option value="revenue">درآمدها</option>
                  <option value="cogs">بهای تمام شده / خرید</option>
                  <option value="expense">هزینه‌ها</option>
                </select>
                <select
                  value={newNature}
                  onChange={e => setNewNature(e.target.value as any)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-emerald-600 font-bold"
                >
                  <option value="debit">ماهیت بدهکار</option>
                  <option value="credit">ماهیت بستانکار</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  ذخیره حساب
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAcc(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {/* Accounts list grouped */}
          <div className="space-y-2">
            {accounts.map(acc => (
              <div 
                key={acc.code}
                className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-9 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-xs">
                    {acc.code}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">{acc.name}</span>
                    <div className="text-[10px] text-slate-400">
                      {acc.category === 'asset' ? 'دارایی' :
                       acc.category === 'liability' ? 'بدهی' :
                       acc.category === 'equity' ? 'حقوق صاحبان سهام' :
                       acc.category === 'revenue' ? 'درآمد' :
                       acc.category === 'cogs' ? 'خرید و بهای تمام شده' : 'هزینه عملیاتی'}
                      {' · '}
                      {acc.isPermanent ? 'حساب دائم (ترازنامه‌ای)' : 'حساب موقت (سود و زیانی)'}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg font-mono ${
                  acc.nature === 'debit' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}>
                  {acc.nature === 'debit' ? 'ماهیت بدهکار' : 'ماهیت بستانکار'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
