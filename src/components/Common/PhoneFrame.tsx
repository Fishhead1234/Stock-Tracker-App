import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Sun, Moon } from 'lucide-react';
import { useSettingsStore, DevicePreset } from '../../store/settingsStore';

interface Props {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({ children }) => {
  const { 
    isPhoneFrameView, 
    setPhoneFrameView, 
    themeMode, 
    setThemeMode,
    devicePreset,
    setDevicePreset 
  } = useSettingsStore();

  const isLight = themeMode === 'neutral-light';

  // Device dimensions from design specs
  const getDeviceDimensions = (preset: DevicePreset) => {
    switch (preset) {
      case 'android':
        return {
          width: 'w-[360px]',
          maxWidth: 'max-w-[360px]',
          height: 'sm:h-[800px]',
          radius: 'sm:rounded-[40px]',
          label: 'Android (360×800)'
        };
      case 'iphone':
      default:
        return {
          width: 'w-[375px]',
          maxWidth: 'max-w-[375px]',
          height: 'sm:h-[812px]',
          radius: 'sm:rounded-[48px]',
          label: 'iPhone (375×812)'
        };
    }
  };

  const dim = getDeviceDimensions(devicePreset);

  return (
    <div 
      data-theme={isLight ? 'light' : 'dark'}
      className={`min-h-screen flex flex-col items-center justify-start relative transition-colors duration-200 ${
        isLight ? 'bg-[#E5E5EA] text-[#000000]' : 'bg-[#040814] text-slate-100'
      }`}
    >
      {/* Top Universal Control Bar for Desktop Users */}
      <header 
        className={`w-full px-4 py-2 flex flex-wrap items-center justify-between z-50 text-xs backdrop-blur-md gap-2 border-b transition-colors ${
          isLight ? 'bg-white/90 border-[#D1D1D6] text-[#000000]' : 'bg-navy-950/80 border-navy-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#007AFF] flex items-center justify-center font-bold text-white text-xs shadow-xs">
            IL
          </div>
          <span className="font-bold tracking-tight">InvestLearn</span>
          <span className="opacity-40 hidden sm:inline">|</span>
          <span className="opacity-70 text-[11px] hidden sm:inline">Mobile Wireframe Architecture (375×812)</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Theme Switcher Toggle (Neutral Light vs Dark) */}
          <div className={`flex items-center rounded-lg p-0.5 border ${
            isLight ? 'bg-[#F2F2F7] border-[#D1D1D6]' : 'bg-navy-900 border-navy-700/80'
          }`}>
            <button
              type="button"
              onClick={() => setThemeMode('neutral-light')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                isLight 
                  ? 'bg-white text-[#007AFF] shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>iOS Neutral</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                !isLight 
                  ? 'bg-navy-700 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-black'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>

          {/* Device Dimension Preset Switcher */}
          <div className={`hidden sm:flex items-center rounded-lg p-0.5 border ${
            isLight ? 'bg-[#F2F2F7] border-[#D1D1D6]' : 'bg-navy-900 border-navy-700/80'
          }`}>
            <button
              type="button"
              onClick={() => {
                setPhoneFrameView(true);
                setDevicePreset('iphone');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                isPhoneFrameView && devicePreset === 'iphone'
                  ? isLight ? 'bg-white text-black font-semibold shadow-xs' : 'bg-navy-700 text-white font-semibold shadow-xs'
                  : isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone (375×812)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPhoneFrameView(true);
                setDevicePreset('android');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                isPhoneFrameView && devicePreset === 'android'
                  ? isLight ? 'bg-white text-black font-semibold shadow-xs' : 'bg-navy-700 text-white font-semibold shadow-xs'
                  : isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android (360×800)</span>
            </button>
            <button
              type="button"
              onClick={() => setPhoneFrameView(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                !isPhoneFrameView
                  ? isLight ? 'bg-white text-black font-semibold shadow-xs' : 'bg-navy-700 text-white font-semibold shadow-xs'
                  : isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'
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
          <div 
            className={`w-full ${dim.maxWidth} ${dim.height} sm:border-[10px] sm:border-slate-800 ${dim.radius} sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative sm:ring-1 sm:ring-black/10 transition-all ${
              isLight ? 'bg-[#F2F2F7]' : 'bg-[#070D1E]'
            }`}
          >
            {/* Realistic Mobile Status Bar (Safe Area Top: 47px) */}
            <div className={`pt-2 pb-1 px-6 flex items-center justify-between z-30 shrink-0 select-none ${
              isLight ? 'bg-[#F2F2F7] text-black' : 'bg-[#070D1E] text-slate-200'
            }`}>
              {/* Left: Clock */}
              <span className="font-mono font-bold text-xs tracking-tight">9:41</span>

              {/* Center: Dynamic Island on iOS */}
              {devicePreset === 'iphone' ? (
                <div className="w-24 h-4 bg-black rounded-full flex items-center justify-between px-2.5 shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <div className="w-1 h-1 rounded-full bg-blue-900" />
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-black mx-auto" />
              )}

              {/* Right: Signal, Wifi, Battery */}
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 flex flex-col overflow-y-auto relative safe-bottom">
              {children}
            </div>

            {/* Simulated Home Indicator bar (Safe Area Bottom: 34px) */}
            <div className={`hidden sm:flex justify-center pb-2 pt-1 shrink-0 z-50 ${
              isLight ? 'bg-white/80' : 'bg-navy-950/80'
            }`}>
              <div className={`w-32 h-1 rounded-full ${
                isLight ? 'bg-black/30' : 'bg-slate-600/60'
              }`} />
            </div>
          </div>
        ) : (
          <div className={`w-full max-w-md min-h-[calc(100vh-48px)] flex flex-col border-x relative ${
            isLight ? 'bg-[#F2F2F7] border-[#D1D1D6]' : 'bg-[#070D1E] border-navy-900/50'
          }`}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
