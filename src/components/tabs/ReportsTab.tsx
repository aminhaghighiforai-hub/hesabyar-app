import React, { useState } from 'react';
import { 
  BarChart3, 
  Scale, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  ArrowDown,
  Building,
  User,
  HelpCircle
} from 'lucide-react';
import { JournalEntry, CompanyProject } from '../../types/accounting';
import { 
  calculateTrialBalance, 
  calculateIncomeStatement, 
  calculateBalanceSheet, 
  formatCurrency, 
  formatNumberOnly 
} from '../../utils/accountingCalculations';
import { DEFAULT_CHART_OF_ACCOUNTS } from '../../data/defaultChartOfAccounts';

interface ReportsTabProps {
  entries: JournalEntry[];
  project: CompanyProject;
}

type ReportView = 'trial_balance' | 'income_statement' | 'balance_sheet' | 'equity_statement';

export const ReportsTab: React.FC<ReportsTabProps> = ({
  entries,
  project
}) => {
  const [activeReport, setActiveReport] = useState<ReportView>('trial_balance');
  const [trialBalanceColumns, setTrialBalanceColumns] = useState<2 | 4 | 6>(6);
  const [endingInventoryInput, setEndingInventoryInput] = useState<number>(0);

  const trialBalance = calculateTrialBalance(entries, DEFAULT_CHART_OF_ACCOUNTS);
  const incomeStatement = calculateIncomeStatement(entries, project, endingInventoryInput, DEFAULT_CHART_OF_ACCOUNTS);
  const balanceSheet = calculateBalanceSheet(entries, project, DEFAULT_CHART_OF_ACCOUNTS);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 pt-3">
      
      {/* Top Header & Print */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
            صورت‌های مالی و ترازهای آزمایشی
          </h2>
          <p className="text-[11px] text-slate-500">
            گزارش‌های رسمی مطابق استانداردهای حسابداری دوره {project.fiscalYear}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors"
          title="چاپ صورت مالی"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">چاپ رسمی</span>
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 sm:grid-cols-4 gap-1 text-center">
        <button
          onClick={() => setActiveReport('trial_balance')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
            activeReport === 'trial_balance' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          تراز آزمایشی
        </button>
        <button
          onClick={() => setActiveReport('income_statement')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
            activeReport === 'income_statement' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          صورت سود و زیان
        </button>
        <button
          onClick={() => setActiveReport('balance_sheet')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
            activeReport === 'balance_sheet' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ترازنامه (وضعیت مالی)
        </button>
        <button
          onClick={() => setActiveReport('equity_statement')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all hidden sm:block ${
            activeReport === 'equity_statement' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          گردش حساب سرمایه
        </button>
      </div>

      {/* Official Academic Report Printable Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
        
        {/* Academic Header (Student & Project Details) */}
        <div className="text-center pb-4 border-b border-slate-200 space-y-1">
          <div className="text-xs text-emerald-700 font-bold tracking-wide">
            {project.type === 'merchandising' ? 'شرکت بازرگانی' : project.type === 'service' ? 'شرکت خدماتی' : 'شرکت بازرگانی و خدماتی (تلفیقی)'}
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
            {project.name}
          </h1>
          <div className="text-xs font-bold text-slate-700">
            {activeReport === 'trial_balance' && `تراز آزمایشی ${trialBalanceColumns} ستونی`}
            {activeReport === 'income_statement' && 'صورت سود و زیان'}
            {activeReport === 'balance_sheet' && 'ترازنامه (صورت وضعیت مالی)'}
            {activeReport === 'equity_statement' && 'صورت گردش حساب سرمایه'}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-3 mt-1">
            <span>برای سال مالی منتهی به ۲۹ اسفند {project.fiscalYear}</span>
            <span>·</span>
            <span>واحد پول: {project.currency === 'toman' ? 'تومان' : 'ریال'}</span>
            {project.studentName && (
              <>
                <span>·</span>
                <span>تهیه کننده: {project.studentName}</span>
              </>
            )}
          </div>
        </div>

        {/* ================= 1. TRIAL BALANCE VIEW ================= */}
        {activeReport === 'trial_balance' && (
          <div className="space-y-3">
            {/* 2 / 4 / 6 Columns Selector */}
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="text-xs font-bold text-slate-600">قالب تراز آزمایشی کلاسی:</span>
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                <button
                  onClick={() => setTrialBalanceColumns(2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    trialBalanceColumns === 2 ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  ۲ ستونی (مانده‌ها)
                </button>
                <button
                  onClick={() => setTrialBalanceColumns(4)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    trialBalanceColumns === 4 ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  ۴ ستونی (گردش و مانده)
                </button>
                <button
                  onClick={() => setTrialBalanceColumns(6)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    trialBalanceColumns === 6 ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  ۶ ستونی (اصلاحات)
                </button>
              </div>
            </div>

            {/* Trial Balance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  {trialBalanceColumns === 6 ? (
                    <>
                      <tr className="bg-slate-100 text-[10px] text-slate-700 border-b border-slate-200 text-center font-bold">
                        <th rowSpan={2} className="py-2 px-2 text-right">کد</th>
                        <th rowSpan={2} className="py-2 px-2 text-right">نام حساب</th>
                        <th colSpan={2} className="py-1 px-1 border-x border-slate-200 bg-slate-200/50">تراز آزمایشی قبل از اصلاحات</th>
                        <th colSpan={2} className="py-1 px-1 border-x border-slate-200 bg-amber-100/50">ثبت‌های اصلاحی</th>
                        <th colSpan={2} className="py-1 px-1 border-r border-slate-200 bg-emerald-100/50">تراز آزمایشی اصلاح شده</th>
                      </tr>
                      <tr className="bg-slate-50 text-[10px] text-slate-600 border-b border-slate-200">
                        <th className="py-1.5 px-2 text-left text-emerald-700">بدهکار</th>
                        <th className="py-1.5 px-2 text-left text-rose-700 border-l border-slate-200">بستانکار</th>
                        <th className="py-1.5 px-2 text-left text-emerald-700">بدهکار</th>
                        <th className="py-1.5 px-2 text-left text-rose-700 border-l border-slate-200">بستانکار</th>
                        <th className="py-1.5 px-2 text-left text-emerald-700">بدهکار</th>
                        <th className="py-1.5 px-2 text-left text-rose-700">بستانکار</th>
                      </tr>
                    </>
                  ) : trialBalanceColumns === 4 ? (
                    <>
                      <tr className="bg-slate-100 text-[10px] text-slate-700 border-b border-slate-200 text-center font-bold">
                        <th rowSpan={2} className="py-2 px-2 text-right">کد</th>
                        <th rowSpan={2} className="py-2 px-2 text-right">نام حساب</th>
                        <th colSpan={2} className="py-1 px-1 border-x border-slate-200">گردش حساب‌ها</th>
                        <th colSpan={2} className="py-1 px-1 border-r border-slate-200">مانده نهایی</th>
                      </tr>
                      <tr className="bg-slate-50 text-[10px] text-slate-600 border-b border-slate-200">
                        <th className="py-1.5 px-2 text-left text-emerald-700">بدهکار</th>
                        <th className="py-1.5 px-2 text-left text-rose-700 border-l border-slate-200">بستانکار</th>
                        <th className="py-1.5 px-2 text-left text-emerald-700">بدهکار</th>
                        <th className="py-1.5 px-2 text-left text-rose-700">بستانکار</th>
                      </tr>
                    </>
                  ) : (
                    <tr className="bg-slate-100 text-[11px] text-slate-700 border-b border-slate-200">
                      <th className="py-2 px-2 font-bold w-16">کد</th>
                      <th className="py-2 px-2 font-bold">نام حساب</th>
                      <th className="py-2 px-2 font-bold text-left text-emerald-700 w-32">مانده بدهکار</th>
                      <th className="py-2 px-2 font-bold text-left text-rose-700 w-32">مانده بستانکار</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trialBalance.rows.map(row => (
                    <tr key={row.code} className="hover:bg-slate-50/60 font-mono text-[11px]">
                      <td className="py-2 px-2 text-slate-400">{row.code}</td>
                      <td className="py-2 px-2 font-sans font-medium text-slate-800">{row.name}</td>
                      
                      {trialBalanceColumns === 6 && (
                        <>
                          <td className="py-2 px-2 text-left font-bold text-emerald-800">
                            {row.unadjustedDebitBalance > 0 ? formatNumberOnly(row.unadjustedDebitBalance) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-rose-800 border-l border-slate-100">
                            {row.unadjustedCreditBalance > 0 ? formatNumberOnly(row.unadjustedCreditBalance) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-emerald-800">
                            {row.adjustmentDebit > 0 ? formatNumberOnly(row.adjustmentDebit) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-rose-800 border-l border-slate-100">
                            {row.adjustmentCredit > 0 ? formatNumberOnly(row.adjustmentCredit) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-emerald-800">
                            {row.adjustedDebitBalance > 0 ? formatNumberOnly(row.adjustedDebitBalance) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-rose-800">
                            {row.adjustedCreditBalance > 0 ? formatNumberOnly(row.adjustedCreditBalance) : '-'}
                          </td>
                        </>
                      )}

                      {trialBalanceColumns === 4 && (
                        <>
                          <td className="py-2 px-2 text-left font-bold text-emerald-800">
                            {row.unadjustedDebitTurnover > 0 ? formatNumberOnly(row.unadjustedDebitTurnover) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-rose-800 border-l border-slate-100">
                            {row.unadjustedCreditTurnover > 0 ? formatNumberOnly(row.unadjustedCreditTurnover) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-emerald-800">
                            {row.adjustedDebitBalance > 0 ? formatNumberOnly(row.adjustedDebitBalance) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-rose-800">
                            {row.adjustedCreditBalance > 0 ? formatNumberOnly(row.adjustedCreditBalance) : '-'}
                          </td>
                        </>
                      )}

                      {trialBalanceColumns === 2 && (
                        <>
                          <td className="py-2 px-2 text-left font-bold text-emerald-800">
                            {row.adjustedDebitBalance > 0 ? formatNumberOnly(row.adjustedDebitBalance) : '-'}
                          </td>
                          <td className="py-2 px-2 text-left font-bold text-rose-800">
                            {row.adjustedCreditBalance > 0 ? formatNumberOnly(row.adjustedCreditBalance) : '-'}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>

                {/* Totals Row */}
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-300 font-mono font-extrabold text-xs">
                    <td colSpan={2} className="py-2.5 px-2 font-sans text-slate-900 font-bold">
                      جمع ستون‌ها (تراز بودن):
                    </td>

                    {trialBalanceColumns === 6 && (
                      <>
                        <td className="py-2.5 px-2 text-left text-emerald-800">
                          {formatNumberOnly(trialBalance.totals.unadjustedDebitBalance)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-rose-800 border-l border-slate-200">
                          {formatNumberOnly(trialBalance.totals.unadjustedCreditBalance)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-emerald-800">
                          {formatNumberOnly(trialBalance.totals.adjustmentDebit)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-rose-800 border-l border-slate-200">
                          {formatNumberOnly(trialBalance.totals.adjustmentCredit)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-emerald-800">
                          {formatNumberOnly(trialBalance.totals.adjustedDebitBalance)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-rose-800">
                          {formatNumberOnly(trialBalance.totals.adjustedCreditBalance)}
                        </td>
                      </>
                    )}

                    {trialBalanceColumns === 4 && (
                      <>
                        <td className="py-2.5 px-2 text-left text-emerald-800">
                          {formatNumberOnly(trialBalance.totals.unadjustedDebitTurnover)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-rose-800 border-l border-slate-200">
                          {formatNumberOnly(trialBalance.totals.unadjustedCreditTurnover)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-emerald-800">
                          {formatNumberOnly(trialBalance.totals.adjustedDebitBalance)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-rose-800">
                          {formatNumberOnly(trialBalance.totals.adjustedCreditBalance)}
                        </td>
                      </>
                    )}

                    {trialBalanceColumns === 2 && (
                      <>
                        <td className="py-2.5 px-2 text-left text-emerald-800">
                          {formatNumberOnly(trialBalance.totals.adjustedDebitBalance)}
                        </td>
                        <td className="py-2.5 px-2 text-left text-rose-800">
                          {formatNumberOnly(trialBalance.totals.adjustedCreditBalance)}
                        </td>
                      </>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ================= 2. INCOME STATEMENT VIEW ================= */}
        {activeReport === 'income_statement' && (
          <div className="space-y-4 max-w-xl mx-auto">
            {project.type === 'merchandising' || project.type === 'hybrid' ? (
              /* بازرگانی و تلفیقی: صورت سود و زیان چند مرحله‌ای */
              <div className="space-y-2 text-xs">
                
                {/* فروش ناخالص و خالص کالا */}
                <div className="flex justify-between font-bold text-slate-800 py-1">
                  <span>فروش ناخالص کالاهای بازرگانی</span>
                  <span className="font-mono">
                    {formatCurrency(incomeStatement.grossSalesOrRevenue - (incomeStatement.serviceRevenue || 0), project.currency)}
                  </span>
                </div>
                {incomeStatement.salesReturnsAndAllowances > 0 && (
                  <div className="flex justify-between text-slate-600 py-0.5 pr-4">
                    <span>کسر می‌شود: برگشت از فروش و تخفیفات</span>
                    <span className="font-mono text-rose-700">({formatNumberOnly(incomeStatement.salesReturnsAndAllowances)})</span>
                  </div>
                )}
                {incomeStatement.salesDiscounts > 0 && (
                  <div className="flex justify-between text-slate-600 py-0.5 pr-4">
                    <span>کسر می‌شود: تخفیفات نقدی فروش</span>
                    <span className="font-mono text-rose-700">({formatNumberOnly(incomeStatement.salesDiscounts)})</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-slate-900 py-1.5 border-t border-b border-slate-200 bg-slate-50 px-2 rounded-lg">
                  <span>فروش خالص کالا</span>
                  <span className="font-mono text-emerald-800">
                    {formatCurrency(incomeStatement.netSalesOrRevenue - (incomeStatement.serviceRevenue || 0), project.currency)}
                  </span>
                </div>

                {/* بهای تمام شده کالای فروش رفته (COGS) */}
                <div className="pt-2">
                  <div className="font-bold text-slate-900 mb-1">بهای تمام شده کالای فروش رفته:</div>
                  <div className="pr-4 space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>موجودی کالای اول دوره</span>
                      <span className="font-mono">{formatNumberOnly(incomeStatement.beginningInventory)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>خرید ناخالص کالا طی دوره</span>
                      <span className="font-mono">{formatNumberOnly(incomeStatement.purchases)}</span>
                    </div>
                    {incomeStatement.freightIn > 0 && (
                      <div className="flex justify-between">
                        <span>اضافه می‌شود: کرایه حمل کالای خریداری شده</span>
                        <span className="font-mono">{formatNumberOnly(incomeStatement.freightIn)}</span>
                      </div>
                    )}
                    {incomeStatement.purchaseReturns > 0 && (
                      <div className="flex justify-between text-rose-700">
                        <span>کسر می‌شود: برگشت از خرید و تخفیفات</span>
                        <span className="font-mono">({formatNumberOnly(incomeStatement.purchaseReturns)})</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-slate-700 pt-1 border-t border-slate-100">
                      <span>بهای تمام شده کالای آماده برای فروش</span>
                      <span className="font-mono">{formatNumberOnly(incomeStatement.costOfGoodsAvailableForSale)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 items-center">
                      <span>کسر می‌شود: موجودی کالای پایان دوره</span>
                      <span className="font-mono">({formatNumberOnly(incomeStatement.endingInventory)})</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-slate-900 py-1.5 border-t border-slate-200 mt-1">
                    <span>بهای تمام شده کالای فروش رفته</span>
                    <span className="font-mono text-rose-800">({formatCurrency(incomeStatement.costOfGoodsSold, project.currency)})</span>
                  </div>
                </div>

                {/* در صورت تلفیقی بودن: نمایش درآمد خدمات */}
                {project.type === 'hybrid' && (
                  <div className="flex justify-between font-bold text-xs py-2 bg-indigo-50/80 px-3 rounded-xl border border-indigo-200 text-indigo-950">
                    <span>اضافه می‌شود: درآمد حاصل از ارائه خدمات</span>
                    <span className="font-mono text-emerald-700">
                      +{formatCurrency(incomeStatement.serviceRevenue || 0, project.currency)}
                    </span>
                  </div>
                )}

                {/* سود ناخالص عملیاتی */}
                <div className="flex justify-between font-extrabold text-sm py-2 bg-emerald-50 px-3 rounded-xl border border-emerald-200 text-emerald-950">
                  <span>{project.type === 'hybrid' ? 'جمع سود ناخالص و درآمدهای عملیاتی' : 'سود ناخالص عملیاتی (Gross Profit)'}</span>
                  <span className="font-mono text-emerald-700">{formatCurrency(incomeStatement.grossProfit, project.currency)}</span>
                </div>

                {/* هزینه‌های عملیاتی */}
                <div className="pt-2">
                  <div className="font-bold text-slate-800 mb-1">هزینه‌های عملیاتی و اداری:</div>
                  <div className="pr-4 space-y-1 text-slate-600">
                    {incomeStatement.operatingExpenses.map(exp => (
                      <div key={exp.code} className="flex justify-between">
                        <span>{exp.name}</span>
                        <span className="font-mono">{formatNumberOnly(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 py-1.5 border-t border-slate-200 mt-1">
                    <span>جمع هزینه‌های عملیاتی</span>
                    <span className="font-mono text-rose-800">({formatCurrency(incomeStatement.totalOperatingExpenses, project.currency)})</span>
                  </div>
                </div>

                {/* سود/زیان خالص */}
                <div className="flex justify-between font-black text-base py-3 bg-slate-900 text-white px-4 rounded-2xl shadow-sm mt-4">
                  <span>{incomeStatement.netIncome >= 0 ? 'سود خالص سال مالی' : 'زیان خالص سال مالی'}</span>
                  <span className={`font-mono ${incomeStatement.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(incomeStatement.netIncome, project.currency)}
                  </span>
                </div>

              </div>
            ) : (
              /* خدماتی: صورت سود و زیان تک‌مرحله‌ای */
              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-extrabold text-sm py-2 bg-slate-50 px-3 rounded-xl border border-slate-200">
                  <span>درآمد حاصل از ارائه خدمات</span>
                  <span className="font-mono text-emerald-800">{formatCurrency(incomeStatement.netSalesOrRevenue, project.currency)}</span>
                </div>

                <div className="pt-2">
                  <div className="font-bold text-slate-800 mb-2">کسر می‌شود: هزینه‌های عملیاتی:</div>
                  <div className="pr-4 space-y-1.5 text-slate-600">
                    {incomeStatement.operatingExpenses.map(exp => (
                      <div key={exp.code} className="flex justify-between">
                        <span>{exp.name}</span>
                        <span className="font-mono">{formatNumberOnly(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 py-2 border-t border-slate-200 mt-2">
                    <span>جمع کل هزینه‌ها</span>
                    <span className="font-mono text-rose-800">({formatCurrency(incomeStatement.totalOperatingExpenses, project.currency)})</span>
                  </div>
                </div>

                <div className="flex justify-between font-black text-base py-3 bg-slate-900 text-white px-4 rounded-2xl shadow-sm mt-4">
                  <span>{incomeStatement.netIncome >= 0 ? 'سود خالص دوره مالی' : 'زیان خالص دوره مالی'}</span>
                  <span className={`font-mono ${incomeStatement.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(incomeStatement.netIncome, project.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. BALANCE SHEET VIEW ================= */}
        {activeReport === 'balance_sheet' && (
          <div className="space-y-4">
            
            {/* Status of Accounting Equation */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              balanceSheet.isBalanced ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {balanceSheet.isBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertTriangle className="w-4 h-4 text-amber-700" />}
                <span>{balanceSheet.isBalanced ? 'معادله ترازنامه کاملاً متعادل و تراز است' : `ترازنامه نامتعادل است (اختلاف: ${formatCurrency(balanceSheet.discrepancy, project.currency)})`}</span>
              </div>
              <span className="font-mono font-bold">دارایی‌ها = بدهی‌ها + سرمایه</span>
            </div>

            {/* Standard 2-Column Balance Sheet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* سمت راست: دارایی‌ها (Assets) */}
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b-2 border-slate-900">
                    دارایی‌ها (Assets)
                  </h3>

                  {/* دارایی‌های جاری */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700">دارایی‌های جاری:</div>
                    {balanceSheet.currentAssets.map(a => (
                      <div key={a.code} className="flex justify-between text-slate-600 pr-3">
                        <span>{a.name}</span>
                        <span className="font-mono font-medium">{formatNumberOnly(a.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200">
                      <span>جمع دارایی‌های جاری</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.totalCurrentAssets, project.currency)}</span>
                    </div>
                  </div>

                  {/* دارایی‌های غیرجاری (ثابت) */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700">دارایی‌های غیرجاری (ثابت):</div>
                    {balanceSheet.nonCurrentAssets.map(a => (
                      <div key={a.code} className="space-y-0.5 pr-3 text-slate-600">
                        <div className="flex justify-between">
                          <span>{a.name}</span>
                          <span className="font-mono">{formatNumberOnly(a.gross)}</span>
                        </div>
                        {a.contra > 0 && (
                          <div className="flex justify-between text-[11px] text-slate-500 pr-2">
                            <span>کسر می‌شود: استهلاک انباشته</span>
                            <span className="font-mono text-rose-700">({formatNumberOnly(a.contra)})</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200">
                      <span>جمع دارایی‌های غیرجاری</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.totalNonCurrentAssets, project.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* جمع کل دارایی‌ها */}
                <div className="flex justify-between font-black text-sm pt-3 border-t-2 border-slate-800 mt-4 text-slate-900">
                  <span>جمع کل دارایی‌ها</span>
                  <span className="font-mono text-emerald-800 text-base">{formatCurrency(balanceSheet.totalAssets, project.currency)}</span>
                </div>
              </div>

              {/* سمت چپ: بدهی‌ها و سرمایه (Liabilities & Equity) */}
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b-2 border-slate-900">
                    بدهی‌ها و حقوق صاحبان سهام
                  </h3>

                  {/* بدهی‌های جاری */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700">بدهی‌های جاری:</div>
                    {balanceSheet.currentLiabilities.length === 0 ? (
                      <div className="text-[11px] text-slate-400 pr-3">- فاقد بدهی جاری -</div>
                    ) : (
                      balanceSheet.currentLiabilities.map(l => (
                        <div key={l.code} className="flex justify-between text-slate-600 pr-3">
                          <span>{l.name}</span>
                          <span className="font-mono font-medium">{formatNumberOnly(l.amount)}</span>
                        </div>
                      ))
                    )}
                    <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200">
                      <span>جمع بدهی‌های جاری</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.totalCurrentLiabilities, project.currency)}</span>
                    </div>
                  </div>

                  {/* بدهی‌های بلندمدت */}
                  {balanceSheet.longTermLiabilities.length > 0 && (
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="font-bold text-slate-700">بدهی‌های بلندمدت:</div>
                      {balanceSheet.longTermLiabilities.map(l => (
                        <div key={l.code} className="flex justify-between text-slate-600 pr-3">
                          <span>{l.name}</span>
                          <span className="font-mono font-medium">{formatNumberOnly(l.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* حقوق صاحبان سهام / سرمایه */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700">حقوق صاحبان سهام و سرمایه:</div>
                    {balanceSheet.equityItems.map((eq, i) => (
                      <div key={i} className="flex justify-between text-slate-600 pr-3">
                        <span>{eq.name}</span>
                        <span className={`font-mono font-medium ${eq.amount < 0 ? 'text-rose-700' : ''}`}>
                          {eq.amount < 0 ? `(${formatNumberOnly(eq.amount)})` : formatNumberOnly(eq.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200">
                      <span>جمع حقوق صاحبان سهام</span>
                      <span className="font-mono">{formatCurrency(balanceSheet.totalEquity, project.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* جمع بدهی‌ها و حقوق صاحبان سهام */}
                <div className="flex justify-between font-black text-sm pt-3 border-t-2 border-slate-800 mt-4 text-slate-900">
                  <span>جمع بدهی‌ها و سرمایه</span>
                  <span className="font-mono text-slate-900 text-base">{formatCurrency(balanceSheet.totalLiabilitiesAndEquity, project.currency)}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= 4. STATEMENT OF EQUITY VIEW ================= */}
        {activeReport === 'equity_statement' && (
          <div className="max-w-md mx-auto space-y-3 text-xs">
            <div className="flex justify-between py-1.5 font-bold text-slate-800">
              <span>سرمایه اولیه دوره</span>
              <span className="font-mono">{formatCurrency(balanceSheet.equityItems[0]?.amount || 0, project.currency)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 pr-3">
              <span>اضافه می‌شود: سود خالص دوره</span>
              <span className="font-mono text-emerald-700">+{formatCurrency(incomeStatement.netIncome, project.currency)}</span>
            </div>
            <div className="flex justify-between font-black text-sm py-2.5 bg-emerald-50 px-3 rounded-xl border border-emerald-200 mt-2 text-emerald-950">
              <span>سرمایه در پایان سال مالی {project.fiscalYear}</span>
              <span className="font-mono text-emerald-900">{formatCurrency(balanceSheet.totalEquity, project.currency)}</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
