import React from 'react';
import { Radio, Clock } from 'lucide-react';
import { stockService } from '../../services/stockService';

export const DataStatusBadge: React.FC = () => {
  const sourceName = stockService.getDataSourceName();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-navy-950/60 border border-navy-800/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
      <span className="w-2 h-2 rounded-full bg-growth-500 animate-pulse-subtle"></span>
      <span className="font-medium text-slate-300">Live Feed</span>
      <span className="text-slate-600">|</span>
      <span className="truncate max-w-[140px]">{sourceName}</span>
      <span className="text-slate-600">|</span>
      <span className="text-slate-400 font-mono">{timeStr}</span>
    </div>
  );
};
