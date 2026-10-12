import { Account, JournalEntry, LedgerAccountSummary, TrialBalanceRow, CompanyProject } from '../types/accounting';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../data/defaultChartOfAccounts';

// Format numbers with Persian comma separation
export function formatCurrency(amount: number, currency: 'toman' | 'rial' = 'toman'): string {
  const formatted = Math.abs(amount).toLocaleString('fa-IR');
  const unit = currency === 'toman' ? 'تومان' : 'ریال';
  return amount < 0 ? `(${formatted}) ${unit}` : `${formatted} ${unit}`;
}

export function formatNumberOnly(amount: number): string {
  return Math.abs(amount).toLocaleString('fa-IR');
}

// محاسبه خلاصه حساب‌های دفتر کل از روی اسناد روزنامه
export function calculateLedger(
  entries: JournalEntry[],
  chartOfAccounts: Account[] = DEFAULT_CHART_OF_ACCOUNTS
): Record<string, LedgerAccountSummary> {
  const ledger: Record<string, LedgerAccountSummary> = {};

  // مقداردهی اولیه برای تمام حساب‌های کدینگ
  chartOfAccounts.forEach(acc => {
    ledger[acc.code] = {
      account: acc,
      debitTurnover: 0,
      creditTurnover: 0,
      balanceDebit: 0,
      balanceCredit: 0,
      entries: []
    };
  });

  // مرتب‌سازی اسناد بر اساس شماره یا تاریخ
  const sortedEntries = [...entries].sort((a, b) => a.entryNumber - b.entryNumber);

  sortedEntries.forEach(entry => {
    entry.items.forEach(item => {
      let accSummary = ledger[item.accountCode];
      if (!accSummary) {
        // حسابی که در کدینگ پیش‌فرض نیست اما در سند آمده
        const fallbackAcc: Account = {
          code: item.accountCode,
          name: item.accountName || `حساب ${item.accountCode}`,
          category: 'expense',
          subCategory: 'operating_expense',
          nature: 'debit',
          isPermanent: false
        };
        accSummary = {
          account: fallbackAcc,
          debitTurnover: 0,
          creditTurnover: 0,
          balanceDebit: 0,
          balanceCredit: 0,
          entries: []
        };
        ledger[item.accountCode] = accSummary;
      }

      accSummary.debitTurnover += Number(item.debit || 0);
      accSummary.creditTurnover += Number(item.credit || 0);

      // محاسبه مانده تجمعی پس از این آرتیکل
      const net = accSummary.debitTurnover - accSummary.creditTurnover;
      let balanceType: 'بدهکار' | 'بستانکار' | 'تراز' = 'تراز';
      if (net > 0) balanceType = 'بدهکار';
      else if (net < 0) balanceType = 'بستانکار';

      accSummary.entries.push({
        entryId: entry.id,
        entryNumber: entry.entryNumber,
        date: entry.date,
        description: item.description || entry.description,
        debit: Number(item.debit || 0),
        credit: Number(item.credit || 0),
        balance: Math.abs(net),
        balanceType
      });
    });
  });

  // محاسبه مانده نهایی برای هر حساب
  Object.values(ledger).forEach(accSummary => {
    const net = accSummary.debitTurnover - accSummary.creditTurnover;
    if (net > 0) {
      accSummary.balanceDebit = net;
      accSummary.balanceCredit = 0;
    } else if (net < 0) {
      accSummary.balanceDebit = 0;
      accSummary.balanceCredit = Math.abs(net);
    } else {
      accSummary.balanceDebit = 0;
      accSummary.balanceCredit = 0;
    }
  });

  return ledger;
}

// محاسبه تراز آزمایشی (شامل قبل از اصلاحات، اصلاحات، و اصلاح‌شده)
export function calculateTrialBalance(
  entries: JournalEntry[],
  chartOfAccounts: Account[] = DEFAULT_CHART_OF_ACCOUNTS
): {
  rows: TrialBalanceRow[];
  totals: {
    unadjustedDebitTurnover: number;
    unadjustedCreditTurnover: number;
    unadjustedDebitBalance: number;
    unadjustedCreditBalance: number;
    adjustmentDebit: number;
    adjustmentCredit: number;
    adjustedDebitBalance: number;
    adjustedCreditBalance: number;
  };
} {
  const regularEntries = entries.filter(e => e.type !== 'adjusting' && e.type !== 'closing');
  const adjustingEntries = entries.filter(e => e.type === 'adjusting');
  const allEntriesExceptClosing = entries.filter(e => e.type !== 'closing');

  const unadjustedLedger = calculateLedger(regularEntries, chartOfAccounts);
  const adjustingLedger = calculateLedger(adjustingEntries, chartOfAccounts);
  const adjustedLedger = calculateLedger(allEntriesExceptClosing, chartOfAccounts);

  const rows: TrialBalanceRow[] = [];

  const totals = {
    unadjustedDebitTurnover: 0,
    unadjustedCreditTurnover: 0,
    unadjustedDebitBalance: 0,
    unadjustedCreditBalance: 0,
    adjustmentDebit: 0,
    adjustmentCredit: 0,
    adjustedDebitBalance: 0,
    adjustedCreditBalance: 0,
  };

  chartOfAccounts.forEach(acc => {
    const unadj = unadjustedLedger[acc.code];
    const adj = adjustingLedger[acc.code];
    const adjusted = adjustedLedger[acc.code];

    const hasActivity =
      (unadj && (unadj.debitTurnover > 0 || unadj.creditTurnover > 0)) ||
      (adj && (adj.debitTurnover > 0 || adj.creditTurnover > 0)) ||
      (adjusted && (adjusted.debitTurnover > 0 || adjusted.creditTurnover > 0));

    if (!hasActivity) return;

    const row: TrialBalanceRow = {
      code: acc.code,
      name: acc.name,
      category: acc.category,
      unadjustedDebitTurnover: unadj ? unadj.debitTurnover : 0,
      unadjustedCreditTurnover: unadj ? unadj.creditTurnover : 0,
      unadjustedDebitBalance: unadj ? unadj.balanceDebit : 0,
      unadjustedCreditBalance: unadj ? unadj.balanceCredit : 0,
      adjustmentDebit: adj ? adj.debitTurnover : 0,
      adjustmentCredit: adj ? adj.creditTurnover : 0,
      adjustedDebitBalance: adjusted ? adjusted.balanceDebit : 0,
      adjustedCreditBalance: adjusted ? adjusted.balanceCredit : 0,
    };

    totals.unadjustedDebitTurnover += row.unadjustedDebitTurnover;
    totals.unadjustedCreditTurnover += row.unadjustedCreditTurnover;
    totals.unadjustedDebitBalance += row.unadjustedDebitBalance;
    totals.unadjustedCreditBalance += row.unadjustedCreditBalance;
    totals.adjustmentDebit += row.adjustmentDebit;
    totals.adjustmentCredit += row.adjustmentCredit;
    totals.adjustedDebitBalance += row.adjustedDebitBalance;
    totals.adjustedCreditBalance += row.adjustedCreditBalance;

    rows.push(row);
  });

  return { rows, totals };
}

// ساختار صورت سود و زیان استاندارد
export interface IncomeStatementData {
  companyType: 'merchandising' | 'service' | 'hybrid';
  // فروش / درآمد
  grossSalesOrRevenue: number;
  salesReturnsAndAllowances: number;
  salesDiscounts: number;
  netSalesOrRevenue: number;
  serviceRevenue?: number;
  // بهای تمام شده کالای فروش رفته (مخصوص بازرگانی و تلفیقی)
  beginningInventory: number;
  purchases: number;
  freightIn: number;
  purchaseReturns: number;
  purchaseDiscounts: number;
  costOfGoodsPurchased: number;
  costOfGoodsAvailableForSale: number;
  endingInventory: number;
  costOfGoodsSold: number;
  // سود ناخالص
  grossProfit: number;
  // هزینه‌های عملیاتی تفکیک‌شده
  operatingExpenses: { code: string; name: string; amount: number }[];
  totalOperatingExpenses: number;
  // سود/زیان خالص
  netIncome: number;
}

export function calculateIncomeStatement(
  entries: JournalEntry[],
  project: CompanyProject,
  endingInventoryVal: number = 0,
  chartOfAccounts: Account[] = DEFAULT_CHART_OF_ACCOUNTS
): IncomeStatementData {
  // همه اسناد به جز اسناد بستن حساب‌ها
  const activeEntries = entries.filter(e => e.type !== 'closing');
  const ledger = calculateLedger(activeEntries, chartOfAccounts);

  const getBalance = (code: string): number => {
    const item = ledger[code];
    if (!item) return 0;
    // برای درآمدها و اعتبارات بستانکار، برای هزینه‌ها بدهکار
    return item.balanceCredit > 0 ? item.balanceCredit : item.balanceDebit;
  };

  const isMerchandising = project.type === 'merchandising';
  const isHybrid = project.type === 'hybrid';

  if (isMerchandising || isHybrid) {
    const grossSales = getBalance('402');
    const serviceRevenue = isHybrid ? getBalance('401') : 0;
    const salesReturns = getBalance('403');
    const salesDiscounts = getBalance('404');
    const netGoodsSales = grossSales - salesReturns - salesDiscounts;

    // بهای تمام شده
    const beginningInventory = ledger['107']?.entries[0]?.debit || 0; // مانده اول دوره موجودی کالا
    const purchases = getBalance('501');
    const freightIn = getBalance('502');
    const purchaseReturns = getBalance('503');
    const purchaseDiscounts = getBalance('504');
    const cogsDirect = getBalance('505'); // در روش دائمی مستقیماً در 505 است

    let costOfGoodsSold = 0;
    let costOfGoodsPurchased = 0;
    let costOfGoodsAvailableForSale = 0;

    if (project.inventoryMethod === 'perpetual' && cogsDirect > 0) {
      costOfGoodsSold = cogsDirect;
    } else {
      // روش ادواری:
      costOfGoodsPurchased = purchases + freightIn - purchaseReturns - purchaseDiscounts;
      costOfGoodsAvailableForSale = beginningInventory + costOfGoodsPurchased;
      costOfGoodsSold = Math.max(0, costOfGoodsAvailableForSale - endingInventoryVal);
    }

    const grossProfitGoods = netGoodsSales - costOfGoodsSold;
    const totalGrossProfit = grossProfitGoods + serviceRevenue;

    // هزینه‌های عملیاتی (کدهای 601 تا 630)
    const operatingExpenses: { code: string; name: string; amount: number }[] = [];
    let totalOperatingExpenses = 0;

    chartOfAccounts
      .filter(a => a.category === 'expense' && a.code.startsWith('6'))
      .forEach(acc => {
        const amt = ledger[acc.code]?.balanceDebit || 0;
        if (amt > 0) {
          operatingExpenses.push({ code: acc.code, name: acc.name, amount: amt });
          totalOperatingExpenses += amt;
        }
      });

    const netIncome = totalGrossProfit - totalOperatingExpenses;

    return {
      companyType: project.type,
      grossSalesOrRevenue: grossSales + serviceRevenue,
      salesReturnsAndAllowances: salesReturns,
      salesDiscounts: salesDiscounts,
      netSalesOrRevenue: netGoodsSales + serviceRevenue,
      serviceRevenue,
      beginningInventory,
      purchases,
      freightIn,
      purchaseReturns,
      purchaseDiscounts,
      costOfGoodsPurchased,
      costOfGoodsAvailableForSale,
      endingInventory: endingInventoryVal,
      costOfGoodsSold,
      grossProfit: totalGrossProfit,
      operatingExpenses,
      totalOperatingExpenses,
      netIncome
    };
  } else {
    // شرکت خدماتی خالص
    const serviceRevenue = getBalance('401');
    const operatingExpenses: { code: string; name: string; amount: number }[] = [];
    let totalOperatingExpenses = 0;

    chartOfAccounts
      .filter(a => a.category === 'expense')
      .forEach(acc => {
        const amt = ledger[acc.code]?.balanceDebit || 0;
        if (amt > 0) {
          operatingExpenses.push({ code: acc.code, name: acc.name, amount: amt });
          totalOperatingExpenses += amt;
        }
      });

    const netIncome = serviceRevenue - totalOperatingExpenses;

    return {
      companyType: 'service',
      grossSalesOrRevenue: serviceRevenue,
      salesReturnsAndAllowances: 0,
      salesDiscounts: 0,
      netSalesOrRevenue: serviceRevenue,
      serviceRevenue,
      beginningInventory: 0,
      purchases: 0,
      freightIn: 0,
      purchaseReturns: 0,
      purchaseDiscounts: 0,
      costOfGoodsPurchased: 0,
      costOfGoodsAvailableForSale: 0,
      endingInventory: 0,
      costOfGoodsSold: 0,
      grossProfit: serviceRevenue,
      operatingExpenses,
      totalOperatingExpenses,
      netIncome
    };
  }
}

// ساختار ترازنامه (صورت وضعیت مالی)
export interface BalanceSheetData {
  currentAssets: { code: string; name: string; amount: number }[];
  totalCurrentAssets: number;
  nonCurrentAssets: { code: string; name: string; gross: number; contra: number; net: number }[];
  totalNonCurrentAssets: number;
  totalAssets: number;

  currentLiabilities: { code: string; name: string; amount: number }[];
  totalCurrentLiabilities: number;
  longTermLiabilities: { code: string; name: string; amount: number }[];
  totalLongTermLiabilities: number;
  totalLiabilities: number;

  equityItems: { name: string; amount: number }[];
  totalEquity: number;

  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  discrepancy: number;
}

export function calculateBalanceSheet(
  entries: JournalEntry[],
  project: CompanyProject,
  chartOfAccounts: Account[] = DEFAULT_CHART_OF_ACCOUNTS
): BalanceSheetData {
  const activeEntries = entries.filter(e => e.type !== 'closing');
  const ledger = calculateLedger(activeEntries, chartOfAccounts);
  const incomeStatement = calculateIncomeStatement(entries, project, 0, chartOfAccounts);

  // 1. دارایی‌های جاری
  const currentAssets: { code: string; name: string; amount: number }[] = [];
  let totalCurrentAssets = 0;

  chartOfAccounts
    .filter(a => a.category === 'asset' && a.subCategory === 'current_asset')
    .forEach(acc => {
      const amt = ledger[acc.code]?.balanceDebit || 0;
      if (amt > 0) {
        currentAssets.push({ code: acc.code, name: acc.name, amount: amt });
        totalCurrentAssets += amt;
      }
    });

  // 2. دارایی‌های ثابت (با استهلاک انباشته)
  const nonCurrentAssets: { code: string; name: string; gross: number; contra: number; net: number }[] = [];
  let totalNonCurrentAssets = 0;

  const pairs = [
    { assetCode: '121', contraCode: '', name: 'زمین' },
    { assetCode: '122', contraCode: '123', name: 'ساختمان' },
    { assetCode: '124', contraCode: '125', name: 'اثاثه و تجهیزات اداری' },
    { assetCode: '126', contraCode: '127', name: 'وسایط نقلیه' }
  ];

  pairs.forEach(p => {
    const gross = ledger[p.assetCode]?.balanceDebit || 0;
    const contra = p.contraCode ? (ledger[p.contraCode]?.balanceCredit || 0) : 0;
    const net = gross - contra;
    if (gross > 0) {
      nonCurrentAssets.push({ code: p.assetCode, name: p.name, gross, contra, net });
      totalNonCurrentAssets += net;
    }
  });

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  // 3. بدهی‌های جاری
  const currentLiabilities: { code: string; name: string; amount: number }[] = [];
  let totalCurrentLiabilities = 0;

  chartOfAccounts
    .filter(a => a.category === 'liability' && a.subCategory === 'current_liability')
    .forEach(acc => {
      const amt = ledger[acc.code]?.balanceCredit || 0;
      if (amt > 0) {
        currentLiabilities.push({ code: acc.code, name: acc.name, amount: amt });
        totalCurrentLiabilities += amt;
      }
    });

  // 4. بدهی‌های بلندمدت
  const longTermLiabilities: { code: string; name: string; amount: number }[] = [];
  let totalLongTermLiabilities = 0;

  chartOfAccounts
    .filter(a => a.category === 'liability' && a.subCategory === 'long_term_liability')
    .forEach(acc => {
      const amt = ledger[acc.code]?.balanceCredit || 0;
      if (amt > 0) {
        longTermLiabilities.push({ code: acc.code, name: acc.name, amount: amt });
        totalLongTermLiabilities += amt;
      }
    });

  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  // 5. سرمایه و حقوق صاحبان سهام
  const initialCapital = ledger['301']?.balanceCredit || 0;
  const drawings = ledger['302']?.balanceDebit || 0;
  const retainedEarnings = ledger['303']?.balanceCredit || 0;
  const currentNetIncome = incomeStatement.netIncome;

  const equityItems: { name: string; amount: number }[] = [
    { name: 'سرمایه اولیه شرکا', amount: initialCapital },
  ];

  if (drawings > 0) {
    equityItems.push({ name: 'کسر می‌شود: برداشت شخص مالک', amount: -drawings });
  }

  if (retainedEarnings > 0) {
    equityItems.push({ name: 'سود انباشته سنوات قبل', amount: retainedEarnings });
  }

  equityItems.push({
    name: currentNetIncome >= 0 ? 'سود خالص سال جاری' : 'زیان خالص سال جاری',
    amount: currentNetIncome
  });

  const totalEquity = initialCapital - drawings + retainedEarnings + currentNetIncome;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const discrepancy = Math.abs(totalAssets - totalLiabilitiesAndEquity);
  const isBalanced = discrepancy < 1; // تفاضل کمتر از ۱ واحد

  return {
    currentAssets,
    totalCurrentAssets,
    nonCurrentAssets,
    totalNonCurrentAssets,
    totalAssets,
    currentLiabilities,
    totalCurrentLiabilities,
    longTermLiabilities,
    totalLongTermLiabilities,
    totalLiabilities,
    equityItems,
    totalEquity,
    totalLiabilitiesAndEquity,
    isBalanced,
    discrepancy
  };
}
