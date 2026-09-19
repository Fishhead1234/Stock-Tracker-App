import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, ChevronsUp, AlertTriangle } from 'lucide-react';
import { SignalAction } from '../../types/signal';

interface Props {
  action: SignalAction;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SignalBadge: React.FC<Props> = ({ action, size = 'sm', showIcon = true }) => {
  const configs: Record<SignalAction, { bg: string; text: string; border: string; label: string; icon: React.ReactNode }> = {
    STRONG_BUY: {
      bg: 'bg-growth-500/15',
      text: 'text-growth-400',
      border: 'border-growth-500/40',
      label: 'STRONG BUY',
      icon: <ChevronsUp className="w-3.5 h-3.5" />
    },
    BUY: {
      bg: 'bg-growth-600/15',
      text: 'text-growth-400',
      border: 'border-growth-600/30',
      label: 'BUY WINDOW',
      icon: <ArrowUpCircle className="w-3.5 h-3.5" />
    },
    HOLD: {
      bg: 'bg-slate-700/30',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      label: 'HOLD / WAIT',
      icon: <MinusCircle className="w-3.5 h-3.5" />
    },
    TRIM: {
      bg: 'bg-gold-500/15',
      text: 'text-gold-400',
      border: 'border-gold-500/40',
      label: 'TRIM PROFIT',
      icon: <ArrowDownCircle className="w-3.5 h-3.5" />
    },
    STRONG_SELL: {
      bg: 'bg-loss-600/15',
      text: 'text-loss-500',
      border: 'border-loss-600/40',
      label: 'HIGH RISK / SELL',
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    }
  };

  const c = configs[action] || configs.HOLD;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  };

  return (
    <span className={`inline-flex items-center font-mono font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]}`}>
      {showIcon && c.icon}
      <span>{c.label}</span>
    </span>
  );
};
