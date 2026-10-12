import React, { useState } from 'react';
import { X, Delete, History, RotateCcw } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [history, setHistory] = useState<string[]>([]);
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op: string) => {
    const current = parseFloat(display);
    if (prevVal === null) {
      setPrevVal(current);
    } else if (operation) {
      const res = calculate(prevVal, current, operation);
      setPrevVal(res);
      setDisplay(String(res));
    }
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (prevVal === null || operation === null) return;
    const current = parseFloat(display);
    const result = calculate(prevVal, current, operation);
    const historyItem = `${prevVal.toLocaleString()} ${operation} ${current.toLocaleString()} = ${result.toLocaleString()}`;
    setHistory([historyItem, ...history.slice(0, 7)]);
    setDisplay(String(result));
    setPrevVal(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleVatAdd = () => {
    const current = parseFloat(display);
    const vat = current * 0.09;
    const total = current + vat;
    setHistory([`${current.toLocaleString()} + ۹٪ مالیات = ${total.toLocaleString()}`, ...history.slice(0, 7)]);
    setDisplay(String(Math.round(total)));
  };

  const handlePercentage = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between shrink-0">
          <span className="font-bold text-xs sm:text-sm">ماشین‌حساب محاسبات کلاسی</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-950 text-white p-4 text-left font-mono">
          <div className="text-[11px] text-emerald-400 h-5 text-right font-sans">
            {prevVal !== null && `${prevVal.toLocaleString()} ${operation}`}
          </div>
          <div className="text-3xl font-extrabold tracking-tight truncate">
            {parseFloat(display).toLocaleString('fa-IR')}
          </div>
        </div>

        {/* Quick Tax & Special Buttons */}
        <div className="p-2 bg-slate-50 grid grid-cols-3 gap-1.5 border-b border-slate-200">
          <button
            onClick={handleVatAdd}
            className="py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
          >
            + ۹٪ ارزش افزوده
          </button>
          <button
            onClick={handlePercentage}
            className="py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
          >
            محاسبه درصد (%)
          </button>
          <button
            onClick={handleClear}
            className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors"
          >
            پاک کردن (C)
          </button>
        </div>

        {/* Keypad */}
        <div className="p-3 grid grid-cols-4 gap-2 text-sm font-bold bg-white">
          <button onClick={() => handleDigit('7')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۷</button>
          <button onClick={() => handleDigit('8')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۸</button>
          <button onClick={() => handleDigit('9')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۹</button>
          <button onClick={() => handleOp('÷')} className="h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-base border border-emerald-100">÷</button>

          <button onClick={() => handleDigit('4')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۴</button>
          <button onClick={() => handleDigit('5')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۵</button>
          <button onClick={() => handleDigit('6')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۶</button>
          <button onClick={() => handleOp('×')} className="h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-base border border-emerald-100">×</button>

          <button onClick={() => handleDigit('1')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۱</button>
          <button onClick={() => handleDigit('2')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۲</button>
          <button onClick={() => handleDigit('3')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۳</button>
          <button onClick={() => handleOp('-')} className="h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-base border border-emerald-100">-</button>

          <button onClick={() => handleDigit('0')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-base">۰</button>
          <button onClick={() => handleDigit('000')} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs">۰۰۰</button>
          <button onClick={handleDecimal} className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-base">.</button>
          <button onClick={() => handleOp('+')} className="h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-base border border-emerald-100">+</button>

          <button 
            onClick={handleEqual} 
            className="col-span-4 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-600/25 text-base active:scale-98 transition-all"
          >
            = مساوی
          </button>
        </div>

        {/* History Strip */}
        {history.length > 0 && (
          <div className="bg-slate-50 p-2.5 border-t border-slate-200 max-h-24 overflow-y-auto text-[10px] space-y-1 text-slate-600">
            <span className="font-bold text-slate-800 block">تاریخچه محاسبات:</span>
            {history.map((h, i) => (
              <div key={i} className="font-mono">{h}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
