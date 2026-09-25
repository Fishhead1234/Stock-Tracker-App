import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<Props> = ({ children }) => {
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  return (
    <div 
      data-theme={isLight ? 'light' : 'dark'}
      className={`w-full min-h-screen flex justify-center items-stretch transition-colors duration-200 ${
        isLight ? 'bg-[#F2F2F7] text-[#000000]' : 'bg-[#070D1E] text-slate-100'
      }`}
    >
      {/* Native App Container: 100% width on mobile devices, max-w-md on desktop */}
      <div 
        className={`w-full max-w-md min-h-screen flex-1 flex flex-col relative transition-colors ${
          isLight ? 'bg-[#F2F2F7]' : 'bg-[#070D1E]'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

