import React from 'react';
import { stockService } from '../../services/stockService';
import { useSettingsStore } from '../../store/settingsStore';

export const DataStatusBadge: React.FC = () => {
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';
  const sourceName = stockService.getDataSourceName();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm shrink-0 border transition-colors ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#666666]' 
        : 'bg-navy-950/80 border-navy-800/80 text-slate-300'
    }`}>
      <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse-subtle ${
        isLight ? 'bg-[#34C759]' : 'bg-growth-500'
      }`} />
      <span className={`font-semibold ${isLight ? 'text-[#000000]' : 'text-white'}`}>Live</span>
      <span className={isLight ? 'text-black/20' : 'text-slate-600'}>|</span>
      <span className="truncate max-w-[110px]">{sourceName}</span>
      <span className={isLight ? 'text-black/20' : 'text-slate-600'}>|</span>
      <span className={`font-mono ${isLight ? 'text-[#8E8E93]' : 'text-slate-400'}`}>{timeStr}</span>
    </div>
  );
};

