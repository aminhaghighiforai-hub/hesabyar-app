import React from 'react';
import { Home, BookOpen, Layers, BarChart3, Plus } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'journal' | 'ledger' | 'reports' | 'tools';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenQuickAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenQuickAction,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto pointer-events-none px-4 pb-3">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-900/10 px-3 py-2 flex items-center justify-between">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 whitespace-nowrap">میز کار</span>
        </button>

        {/* Tab 2: Journal */}
        <button
          onClick={() => onChangeTab('journal')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'journal' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'journal' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 whitespace-nowrap">دفتر روزنامه</span>
        </button>

        {/* Center Raised Emerald Floating Button (Fintech style from uploaded image) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenQuickAction}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 hover:scale-105 active:scale-95 transition-all border-4 border-white"
            title="ثبت سریع سند حسابداری"
            aria-label="افزودن سند جدید"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Tab 3: Ledger */}
        <button
          onClick={() => onChangeTab('ledger')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'ledger' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === 'ledger' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 whitespace-nowrap">دفاتر کل (T)</span>
        </button>

        {/* Tab 4: Reports */}
        <button
          onClick={() => onChangeTab('reports')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'reports' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${activeTab === 'reports' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 whitespace-nowrap">صورت‌های مالی</span>
        </button>
      </div>
    </div>
  );
};
