import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Briefcase, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Clock
} from 'lucide-react';
import { useNotificationStore, AppNotification } from '../../store/notificationStore';
import { useMarketStore } from '../../store/marketStore';
import { useSettingsStore } from '../../store/settingsStore';

interface NotificationCenterModalProps {
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ onClose }) => {
  const { alerts, markAlertAsRead, markAllAsRead, clearAlerts } = useNotificationStore();
  const { selectTicker } = useMarketStore();
  const { setActiveTab } = useSettingsStore();

  const handleStockClick = (ticker: string, id: string) => {
    markAlertAsRead(id);
    selectTicker(ticker);
    setActiveTab('stockDetail');
    onClose();
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'STRONG_BUY':
      case 'BUY':
        return 'text-growth-400 bg-growth-500/10 border-growth-500/30';
      case 'TRIM':
        return 'text-gold-400 bg-gold-500/10 border-gold-500/30';
      case 'STRONG_SELL':
        return 'text-loss-400 bg-loss-500/10 border-loss-500/30';
      default:
        return 'text-slate-300 bg-navy-800 border-navy-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-navy-900 border border-navy-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-growth-500/15 border border-growth-500/30 flex items-center justify-center text-growth-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Alerts & Notifications</h3>
              <p className="text-[11px] text-slate-400">
                Timing signals for holdings & watched stocks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        {alerts.length > 0 && (
          <div className="px-4 py-2 bg-navy-950/40 border-b border-navy-850 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              {alerts.filter(a => !a.isRead).length} unread alerts
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-growth-400 hover:text-growth-300 flex items-center gap-1 font-medium transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={clearAlerts}
                className="text-[11px] text-slate-400 hover:text-loss-400 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-navy-850/50">
          {alerts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-navy-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-white">No alerts yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                When your personal holdings or watched stocks trigger a timing signal change (Buy Window, Strong Buy, Trim Profit, or Sell), notifications will appear here.
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isHolding = alert.category === 'HOLDING';
              return (
                <div
                  key={alert.id}
                  onClick={() => handleStockClick(alert.ticker, alert.id)}
                  className={`pt-2.5 first:pt-0 p-3 rounded-2xl transition cursor-pointer group border ${
                    alert.isRead 
                      ? 'bg-navy-950/40 border-navy-850/60 hover:border-navy-700' 
                      : 'bg-navy-800/50 border-growth-500/30 hover:border-growth-500/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-growth-400 transition">
                        {alert.ticker}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold border ${getActionColor(
                          alert.signalAction
                        )}`}
                      >
                        {alert.title}
                      </span>
                      {isHolding ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-0.5">
                          <Briefcase className="w-2.5 h-2.5" />
                          <span>Holding</span>
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-300 border border-gold-500/30 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" />
                          <span>Watchlist</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-navy-800/50">
                    <span className="font-mono">
                      Price at alert: <strong className="text-slate-200">${alert.price.toFixed(2)}</strong>
                    </span>
                    <span className="text-growth-400 group-hover:underline flex items-center gap-0.5 text-[10px] font-semibold">
                      <span>View analysis</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-navy-950 border-t border-navy-850 text-center text-[10px] text-slate-500">
          Alert preferences can be customized in App Settings.
        </div>
      </div>
    </div>
  );
};
