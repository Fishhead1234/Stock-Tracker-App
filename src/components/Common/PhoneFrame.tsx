import React, { useState, useEffect } from 'react';
import { Signal, Wifi } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({ children }) => {
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  // Live time for realistic top phone panel
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      data-theme={isLight ? 'light' : 'dark'}
      className={`min-h-screen w-full flex justify-center items-start sm:py-6 sm:px-4 transition-colors duration-200 ${
        isLight ? 'bg-[#E5E5EA] text-[#000000]' : 'bg-[#040814] text-slate-100'
      }`}
    >
      {/* Phone App Chassis Container */}
      <div 
        className={`w-full max-w-[420px] min-h-screen sm:min-h-[890px] flex-1 flex flex-col relative sm:rounded-[44px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] sm:border-[8px] sm:border-slate-800 overflow-hidden sm:ring-1 sm:ring-black/10 transition-all ${
          isLight ? 'bg-[#F2F2F7]' : 'bg-[#070D1E]'
        }`}
      >
        {/* TOP PHONE PANEL & STATUS BAR */}
        <div 
          className={`w-full pt-2.5 pb-2 px-6 flex items-center justify-between z-40 shrink-0 select-none border-b transition-colors ${
            isLight 
              ? 'bg-[#F2F2F7] text-black border-black/5' 
              : 'bg-[#070D1E] text-slate-100 border-white/5'
          }`}
        >
          {/* Left: Clock */}
          <span className="font-semibold text-xs tracking-tight min-w-[36px]">
            {timeStr}
          </span>

          {/* Center: Dynamic Island / Camera Notch Capsule */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-between px-2.5 shadow-xs border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="w-1 h-1 rounded-full bg-blue-950" />
          </div>

          {/* Right: Cellular Signal, Wifi, Battery */}
          <div className="flex items-center gap-1.5 min-w-[36px] justify-end">
            <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <div className="flex items-center gap-0.5">
              <div className={`w-5 h-2.5 rounded-[3px] border px-0.5 flex items-center ${
                isLight ? 'border-black' : 'border-white'
              }`}>
                <div className={`h-1.5 w-3 rounded-[1px] ${
                  isLight ? 'bg-black' : 'bg-white'
                }`} />
              </div>
              <div className={`w-0.5 h-1 rounded-r-xs ${
                isLight ? 'bg-black' : 'bg-white'
              }`} />
            </div>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto relative safe-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};
