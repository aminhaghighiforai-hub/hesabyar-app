export type CompanyType = 'merchandising' | 'service' | 'hybrid'; // بازرگانی، خدماتی، یا تلفیقی (ترکیبی)
export type InventoryMethod = 'perpetual' | 'periodic'; // دائمی یا ادواری
export type CurrencyUnit = 'toman' | 'rial';

export interface CompanyProject {
  id: string;
  name: string;
  type: CompanyType;
  inventoryMethod: InventoryMethod;
  fiscalYear: string; // e.g. "۱۴۰۳"
  currency: CurrencyUnit;
  description: string;
  studentName?: string;
  courseName?: string;
  createdAt: string;
  updatedAt: string;
}

export type AccountCategory = 
  | 'asset'      // دارایی‌ها
  | 'liability'  // بدهی‌ها
  | 'equity'     // سرمایه و حقوق صاحبان سهام
  | 'revenue'    // درآمدها
  | 'cogs'       // بهای تمام شده / خرید
  | 'expense';   // هزینه‌ها

export type AccountSubCategory =
  | 'current_asset'
  | 'non_current_asset'
  | 'current_liability'
  | 'long_term_liability'
  | 'equity'
  | 'operating_revenue'
  | 'sales_discount_return'
  | 'purchases_cogs'
  | 'operating_expense';

export interface Account {
  code: string;
  name: string;
  category: AccountCategory;
  subCategory: AccountSubCategory;
  nature: 'debit' | 'credit'; // ماهیت حساب: بدهکار یا بستانکار
  isPermanent: boolean; // دائم یا موقت
  description?: string;
}

export interface JournalItem {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
  ref?: string; // عطف دفتر کل
}

export type EntryType = 
  | 'regular'    // عادی
  | 'adjusting'  // اصلاحی پایان دوره
  | 'closing'    // بستن حساب‌های موقت یا دائم
  | 'opening'    // سند افتتاحیه
  | 'trade'      // بازرگانی عمومی
  | 'purchase'   // خرید کالا
  | 'sale';      // فروش کالا

export interface JournalEntry {
  id: string;
  entryNumber: number;
  date: string; // مثلاً 1403/01/15
  description: string;
  type: EntryType;
  items: JournalItem[];
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type InvoiceType = 'purchase' | 'sale' | 'purchase_return' | 'sale_return';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  date: string;
  partyName: string; // نام خریدار یا فروشنده
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentType: 'cash' | 'credit' | 'mixed';
  cashAmount: number;
  creditAmount: number;
  linkedJournalEntryId?: string;
  note?: string;
}

// وضعیت مانده دفتر کل
export interface LedgerAccountSummary {
  account: Account;
  debitTurnover: number;  // گردش بدهکار
  creditTurnover: number; // گردش بستانکار
  balanceDebit: number;   // مانده بدهکار
  balanceCredit: number;  // مانده بستانکار
  entries: {
    entryId: string;
    entryNumber: number;
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    balanceType: 'بدهکار' | 'بستانکار' | 'تراز';
  }[];
}

// تراز آزمایشی
export interface TrialBalanceRow {
  code: string;
  name: string;
  category: AccountCategory;
  // قبل از اصلاحات
  unadjustedDebitTurnover: number;
  unadjustedCreditTurnover: number;
  unadjustedDebitBalance: number;
  unadjustedCreditBalance: number;
  // اصلاحات
  adjustmentDebit: number;
  adjustmentCredit: number;
  // پس از اصلاحات
  adjustedDebitBalance: number;
  adjustedCreditBalance: number;
}
