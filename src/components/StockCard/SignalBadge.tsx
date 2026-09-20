import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, ChevronsUp, AlertTriangle } from 'lucide-react';
import { SignalAction } from '../../types/signal';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  action: SignalAction;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SignalBadge: React.FC<Props> = ({ action, size = 'sm', showIcon = true }) => {
  const { t } = useLanguageStore();

  const configs: Record<SignalAction, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    STRONG_BUY: {
      bg: 'bg-growth-500/15',
      text: 'text-growth-400',
      border: 'border-growth-500/40',
      icon: <ChevronsUp className="w-3.5 h-3.5" />
    },
    BUY: {
      bg: 'bg-growth-600/15',
      text: 'text-growth-400',
      border: 'border-growth-600/30',
      icon: <ArrowUpCircle className="w-3.5 h-3.5" />
    },
    HOLD: {
      bg: 'bg-slate-700/30',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      icon: <MinusCircle className="w-3.5 h-3.5" />
    },
    TRIM: {
      bg: 'bg-gold-500/15',
      text: 'text-gold-400',
      border: 'border-gold-500/40',
      icon: <ArrowDownCircle className="w-3.5 h-3.5" />
    },
    STRONG_SELL: {
      bg: 'bg-loss-600/15',
      text: 'text-loss-500',
      border: 'border-loss-600/40',
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    }
  };

  const getLabel = (act: SignalAction) => {
    switch (act) {
      case 'STRONG_BUY': return t('signal_strong_buy', 'STRONG BUY');
      case 'BUY': return t('signal_buy', 'BUY WINDOW');
      case 'HOLD': return t('signal_hold', 'HOLD / WAIT');
      case 'TRIM': return t('signal_trim', 'TRIM PROFIT');
      case 'STRONG_SELL': return t('signal_strong_sell', 'HIGH RISK / SELL');
      default: return t('signal_hold', 'HOLD / WAIT');
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
      <span>{getLabel(action)}</span>
    </span>
  );
};
