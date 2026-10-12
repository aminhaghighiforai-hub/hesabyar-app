import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface XiaomiDeviceFrameProps {
  children: React.ReactNode;
  isSimulatedDevice: boolean;
  onToggleSimulatedDevice: () => void;
}

export const XiaomiDeviceFrame: React.FC<XiaomiDeviceFrameProps> = ({
  children,
  isSimulatedDevice,
  onToggleSimulatedDevice
}) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start py-0 sm:py-4 px-0 sm:px-2 selection:bg-emerald-600 selection:text-white">
      
      {/* Top Device Switcher Toolbar (Hidden in Print) */}
      <div className="no-print hidden sm:flex items-center justify-between w-full max-w-md px-3 py-1.5 mb-2 text-xs text-slate-400 bg-slate-800/80 rounded-2xl border border-slate-700/60 backdrop-blur-md">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-200 font-bold">Xiaomi 11T Pro (20:9 AMOLED)</span>
        </div>
        <button
          onClick={onToggleSimulatedDevice}
          className="flex items-center gap-1 bg-slate-700/80 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-slate-600/50 transition-all active:scale-95"
        >
          {isSimulatedDevice ? (
            <>
              <Monitor className="w-3 h-3" />
              <span>حالت تمام‌صفحه</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3" />
              <span>قاب گوشی شیائومی</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      {isSimulatedDevice ? (
        /* Xiaomi 11T Pro simulated phone frame with 20:9 ratio */
        <div className="relative w-full max-w-[420px] rounded-[44px] p-2.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-slate-950/80 border-4 border-slate-600/50">
          
          {/* Subtle volume / power buttons on the edge */}
          <div className="absolute -right-2 top-28 w-1 h-12 bg-slate-600 rounded-r-md"></div>
          <div className="absolute -right-2 top-44 w-1 h-20 bg-slate-600 rounded-r-md"></div>

          {/* Screen Chassis with curved corners */}
          <div className="relative w-full rounded-[36px] overflow-hidden bg-slate-100 min-h-[840px] max-h-[890px] flex flex-col shadow-inner">
            
            {/* Top Punch-hole camera of Xiaomi 11T Pro */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner"></div>
            </div>

            {/* Scrollable screen content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
              {children}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Responsive Mobile-First Full Viewport */
        <div className="w-full max-w-lg min-h-screen bg-slate-100 flex flex-col shadow-2xl relative overflow-x-hidden">
          {children}
        </div>
      )}

    </div>
  );
};
