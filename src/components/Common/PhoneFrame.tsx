import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({ children }) => {
  const { isPhoneFrameView, setPhoneFrameView } = useSettingsStore();

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col items-center justify-start relative">
      {/* Top Toggle Bar for Desktop Users */}
      <header className="w-full bg-navy-950/80 border-b border-navy-800/80 px-4 py-2 flex items-center justify-between z-50 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-navy-600 via-growth-500 to-gold-500 flex items-center justify-center font-bold text-white text-xs shadow">
            IL
          </div>
          <span className="font-bold text-slate-100 tracking-wide">InvestLearn</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">Beginner Investment Timing & Portfolio Tracker</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-navy-900 border border-navy-700/80 rounded-lg p-0.5">
            <button
              onClick={() => setPhoneFrameView(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                isPhoneFrameView ? 'bg-navy-700 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
            <button
              onClick={() => setPhoneFrameView(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                !isPhoneFrameView ? 'bg-navy-700 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className={`w-full flex-1 flex justify-center items-start ${isPhoneFrameView ? 'p-0 sm:py-6' : 'p-0'}`}>
        {isPhoneFrameView ? (
          <div className="w-full max-w-[420px] sm:h-[890px] sm:border-[10px] sm:border-slate-800/90 sm:rounded-[48px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col bg-[#070D1E] overflow-hidden relative sm:ring-1 sm:ring-white/10">
            {/* Dynamic Island / Notch on Phone Frame */}
            <div className="hidden sm:flex justify-center pt-2 pb-1 bg-[#070D1E] shrink-0 z-30">
              <div className="w-28 h-4 bg-black rounded-full flex items-center justify-between px-3 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-navy-900"></div>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 flex flex-col overflow-y-auto relative safe-bottom">
              {children}
            </div>

            {/* Simulated Home Indicator bar */}
            <div className="hidden sm:flex justify-center pb-2 pt-1 bg-navy-950/80 shrink-0 z-50">
              <div className="w-32 h-1 bg-slate-600/60 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl min-h-[calc(100vh-48px)] flex flex-col bg-[#070D1E] border-x border-navy-900/50 relative">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
