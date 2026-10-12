import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Receipt, 
  RotateCcw, 
  CreditCard,
  Building,
  Check
} from 'lucide-react';
import { Invoice, InvoiceItem, InvoiceType, JournalEntry } from '../types/accounting';
import { formatCurrency } from '../utils/accountingCalculations';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveInvoice: (invoice: Invoice, generatedJournalEntry?: JournalEntry) => void;
  nextInvoiceNumber: number;
  nextJournalEntryNumber: number;
  currency?: 'toman' | 'rial';
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSaveInvoice,
  nextInvoiceNumber,
  nextJournalEntryNumber,
  currency = 'toman'
}) => {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('sale');
  const [partyName, setPartyName] = useState<string>('');
  const [date, setDate] = useState<string>('1403/02/10');
  const [paymentType, setPaymentType] = useState<'cash' | 'credit' | 'mixed'>('mixed');
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [autoCreateJournal, setAutoCreateJournal] = useState<boolean>(true);
  const [cashRatio, setCashRatio] = useState<number>(50); // ۵۰٪ نقد، ۵۰٪ نسیه برای حالت ترکیبی

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'کالای بازرگانی نمونه', quantity: 10, unitPrice: 2000000, totalPrice: 20000000 }
  ]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const total = Math.max(0, subtotal - discount + tax);

  let cashAmount = 0;
  let creditAmount = 0;
  if (paymentType === 'cash') {
    cashAmount = total;
    creditAmount = 0;
  } else if (paymentType === 'credit') {
    cashAmount = 0;
    creditAmount = total;
  } else {
    cashAmount = Math.round((total * cashRatio) / 100);
    creditAmount = total - cashAmount;
  }

  const handleItemChange = (itemId: string, field: 'description' | 'quantity' | 'unitPrice', value: any) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        updated.totalPrice = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: 'کالای جدید',
      quantity: 1,
      unitPrice: 1000000,
      totalPrice: 1000000
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    if (items.length <= 1) {
      alert('حداقل یک سطر کالا در فاکتور الزامی است.');
      return;
    }
    setItems(items.filter(i => i.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!partyName.trim()) {
      alert('لطفاً نام طرف حساب (خریدار یا فروشنده) را وارد نمایید.');
      return;
    }

    const invPrefix = 
      invoiceType === 'purchase' ? 'خ-' : 
      invoiceType === 'sale' ? 'ف-' : 
      invoiceType === 'purchase_return' ? 'ب‌خ-' : 'ب‌ف-';
    
    const invoiceId = Math.random().toString(36).substring(2, 9);
    const invoiceNumber = `${invPrefix}${nextInvoiceNumber}`;

    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber,
      type: invoiceType,
      date: date.trim(),
      partyName: partyName.trim(),
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentType,
      cashAmount,
      creditAmount
    };

    let generatedJournal: JournalEntry | undefined = undefined;

    if (autoCreateJournal) {
      const journalItems = [];
      const jId = Math.random().toString(36).substring(2, 9);

      if (invoiceType === 'sale') {
        // فروش کالا
        if (cashAmount > 0) {
          journalItems.push({
            id: 'j-1',
            accountCode: '102',
            accountName: 'حساب‌های بانکی',
            debit: cashAmount,
            credit: 0,
            description: `دریافت نقد بابت فاکتور ${invoiceNumber} از ${partyName}`
          });
        }
        if (creditAmount > 0) {
          journalItems.push({
            id: 'j-2',
            accountCode: '103',
            accountName: 'حساب‌های دریافتنی تجاری',
            debit: creditAmount,
            credit: 0,
            description: `طلب نسیه بابت فاکتور ${invoiceNumber} از ${partyName}`
          });
        }
        if (discount > 0) {
          journalItems.push({
            id: 'j-disc',
            accountCode: '404',
            accountName: 'تخفیفات نقدی فروش (کاهنده درآمد)',
            debit: discount,
            credit: 0,
            description: `تخفیف فاکتور ${invoiceNumber}`
          });
        }
        journalItems.push({
          id: 'j-3',
          accountCode: '402',
          accountName: 'فروش ناخالص کالا',
          debit: 0,
          credit: subtotal + tax,
          description: `فروش کالا طبق فاکتور ${invoiceNumber}`
        });

        generatedJournal = {
          id: jId,
          entryNumber: nextJournalEntryNumber,
          date: date.trim(),
          description: `فروش کالا به ${partyName} (فاکتور ${invoiceNumber})`,
          type: 'sale',
          items: journalItems,
          createdAt: new Date().toISOString()
        };
      } else if (invoiceType === 'purchase') {
        // خرید کالا
        journalItems.push({
          id: 'j-1',
          accountCode: '501',
          accountName: 'خرید ناخالص کالا (روش ادواری)',
          debit: subtotal + tax,
          credit: 0,
          description: `خرید کالا طبق فاکتور ${invoiceNumber} از ${partyName}`
        });
        if (discount > 0) {
          journalItems.push({
            id: 'j-disc',
            accountCode: '504',
            accountName: 'تخفیفات نقدی خرید (کاهنده خرید)',
            debit: 0,
            credit: discount,
            description: `تخفیف فاکتور ${invoiceNumber}`
          });
        }
        if (cashAmount > 0) {
          journalItems.push({
            id: 'j-2',
            accountCode: '102',
            accountName: 'حساب‌های بانکی',
            debit: 0,
            credit: cashAmount,
            description: `پرداخت نقدی بابت فاکتور ${invoiceNumber}`
          });
        }
        if (creditAmount > 0) {
          journalItems.push({
            id: 'j-3',
            accountCode: '201',
            accountName: 'حساب‌های پرداختنی تجاری (بستانکاران)',
            debit: 0,
            credit: creditAmount,
            description: `بدهی نسیه بابت فاکتور ${invoiceNumber} به ${partyName}`
          });
        }

        generatedJournal = {
          id: jId,
          entryNumber: nextJournalEntryNumber,
          date: date.trim(),
          description: `خرید کالا از ${partyName} (فاکتور ${invoiceNumber})`,
          type: 'purchase',
          items: journalItems,
          createdAt: new Date().toISOString()
        };
      }
    }

    onSaveInvoice(newInvoice, generatedJournal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-emerald-950/20 flex flex-col max-h-[92vh] border border-emerald-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base">صدور فاکتور بازرگانی (خرید و فروش)</h2>
              <p className="text-[11px] text-emerald-100">ثبت اقلام کالا و صدور خودکار سند حسابداری</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Type Switcher */}
        <div className="bg-emerald-50/80 p-2.5 border-b border-emerald-100 grid grid-cols-4 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setInvoiceType('sale')}
            className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              invoiceType === 'sale'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-emerald-100/60'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            فروش کالا
          </button>
          <button
            type="button"
            onClick={() => setInvoiceType('purchase')}
            className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              invoiceType === 'purchase'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-emerald-100/60'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            خرید کالا
          </button>
          <button
            type="button"
            onClick={() => setInvoiceType('sale_return')}
            className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              invoiceType === 'sale_return'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-emerald-100/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            برگشت فروش
          </button>
          <button
            type="button"
            onClick={() => setInvoiceType('purchase_return')}
            className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              invoiceType === 'purchase_return'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-emerald-100/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            برگشت خرید
          </button>
        </div>

        {/* Scrollable Form */}
        <form noValidate onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                طرف حساب ({invoiceType.includes('sale') ? 'خریدار' : 'فروشنده'})
              </label>
              <input
                type="text"
                value={partyName}
                onChange={e => setPartyName(e.target.value)}
                placeholder="مثلاً: شرکت بازرگانی کاسپین"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">تاریخ فاکتور</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="1403/02/10"
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center focus:outline-emerald-600"
                required
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">نحوه تسویه مبلغ</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType('cash')}
                className={`py-2 text-xs rounded-xl font-bold border transition-all ${
                  paymentType === 'cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                ۱۰۰٪ نقد (صندوق/بانک)
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('credit')}
                className={`py-2 text-xs rounded-xl font-bold border transition-all ${
                  paymentType === 'credit' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                ۱۰۰٪ نسیه (حساب‌ها)
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('mixed')}
                className={`py-2 text-xs rounded-xl font-bold border transition-all ${
                  paymentType === 'mixed' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                ترکیبی (نقد و نسیه)
              </button>
            </div>
            {paymentType === 'mixed' && (
              <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-600">درصد نقدی: {cashRatio}٪</span>
                  <span className="font-bold text-slate-600">درصد نسیه: {100 - cashRatio}٪</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="5"
                  value={cashRatio}
                  onChange={e => setCashRatio(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-800">اقلام کالا</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                افزودن ردیف
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">{index + 1}</span>
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="شرح و نام کالا"
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-emerald-600 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">تعداد / مقدار</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-center focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        قیمت واحد ({currency === 'toman' ? 'تومان' : 'ریال'})
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-left focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts & Tax */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                تخفیف نقدی فاکتور ({currency === 'toman' ? 'تومان' : 'ریال'})
              </label>
              <input
                type="number"
                value={discount || ''}
                onChange={e => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                مالیات ارزش افزوده ({currency === 'toman' ? 'تومان' : 'ریال'})
              </label>
              <input
                type="number"
                value={tax || ''}
                onChange={e => setTax(Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-left focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Auto Journal Checkbox */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-950">صدور خودکار سند در دفتر روزنامه</div>
              <div className="text-[10px] text-emerald-700">همزمان آرتیکل‌های دوبل استاندارد در روزنامه ثبت شوند</div>
            </div>
            <input
              type="checkbox"
              checked={autoCreateJournal}
              onChange={e => setAutoCreateJournal(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
            />
          </div>

          {/* Total Summary */}
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>جمع اقلام:</span>
              <span className="font-mono">{formatCurrency(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-rose-300">
                <span>تخفیف:</span>
                <span className="font-mono">-{formatCurrency(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-emerald-400 pt-1 border-t border-slate-800">
              <span>مبلغ قابل پرداخت فاکتور:</span>
              <span className="font-mono">{formatCurrency(total, currency)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>نقد: {formatCurrency(cashAmount, currency)}</span>
              <span>نسیه: {formatCurrency(creditAmount, currency)}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
            >
              ثبت فاکتور و صدور اسناد
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
