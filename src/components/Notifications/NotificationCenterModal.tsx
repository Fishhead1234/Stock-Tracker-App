import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Briefcase, 
  Star, 
  Clock
} from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useMarketStore } from '../../store/marketStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface NotificationCenterModalProps {
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ onClose }) => {
  const { alerts, markAlertAsRead, markAllAsRead, clearAlerts } = useNotificationStore();
  const { selectTicker } = useMarketStore();
  const { setActiveTab, themeMode } = useSettingsStore();
  const { t } = useLanguageStore();

  const isLight = themeMode === 'neutral-light';

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
        return isLight 
          ? 'text-[#248A3D] bg-[#34C759]/15 border-[#34C759]/35' 
          : 'text-growth-400 bg-growth-500/10 border-growth-500/30';
      case 'TRIM':
        return isLight 
          ? 'text-[#B25E00] bg-[#FF9500]/15 border-[#FF9500]/35' 
          : 'text-gold-400 bg-gold-500/10 border-gold-500/30';
      case 'STRONG_SELL':
        return isLight 
          ? 'text-[#D70015] bg-[#FF3B30]/15 border-[#FF3B30]/35' 
          : 'text-loss-400 bg-loss-500/10 border-loss-500/30';
      default:
        return isLight 
          ? 'text-[#666666] bg-[#F2F2F7] border-[rgba(0,0,0,0.1)]' 
          : 'text-slate-300 bg-navy-800 border-navy-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-md border rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden transition-colors duration-200 ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000] shadow-[0_20px_50px_rgba(0,0,0,0.25)]' 
            : 'bg-navy-900 border-navy-800 text-white shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              isLight ? 'bg-[#34C759]/15 border-[#34C759]/30 text-[#34C759]' : 'bg-growth-500/15 border-growth-500/30 text-growth-400'
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                {t('alerts_title', 'Alerts & Notifications')}
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('alerts_subtitle', 'Timing signals for holdings & watched stocks')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition ${
              isLight 
                ? 'text-[#8E8E93] hover:text-[#000000] hover:bg-[#E5E5EA]' 
                : 'text-slate-400 hover:text-white hover:bg-navy-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        {alerts.length > 0 && (
          <div className={`px-4 py-2 border-b flex items-center justify-between text-xs transition-colors ${
            isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/40 border-navy-850'
          }`}>
            <span className={`text-[11px] font-medium ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              {alerts.filter(a => !a.isRead).length} {t('unread_alerts', 'unread alerts')}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className={`text-[11px] flex items-center gap-1 font-semibold transition ${
                  isLight ? 'text-[#34C759] hover:text-[#248A3D]' : 'text-growth-400 hover:text-growth-300'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t('mark_all_read', 'Mark all read')}</span>
              </button>
              <button
                onClick={clearAlerts}
                className={`text-[11px] flex items-center gap-1 transition ${
                  isLight ? 'text-[#8E8E93] hover:text-[#FF3B30]' : 'text-slate-400 hover:text-loss-400'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('clear_all', 'Clear')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Alerts list */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-2.5 divide-y ${
          isLight ? 'divide-[rgba(0,0,0,0.06)]' : 'divide-navy-850/50'
        }`}>
          {alerts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                isLight ? 'bg-[#F2F2F7] text-[#8E8E93]' : 'bg-navy-800/80 text-slate-400'
              }`}>
                <Bell className={`w-6 h-6 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`} />
              </div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                {t('no_alerts_title', 'No alerts yet')}
              </h4>
              <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('no_alerts_desc', 'When your personal holdings or watched stocks trigger a timing signal change (Buy Window, Strong Buy, Trim Profit, or Sell), notifications will appear here.')}
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
                      ? isLight
                        ? 'bg-white border-[rgba(0,0,0,0.08)] hover:border-[#007AFF]/40 hover:bg-[#F8F9FA]'
                        : 'bg-navy-950/40 border-navy-850/60 hover:border-navy-700' 
                      : isLight
                        ? 'bg-[#F2FBF5] border-[#34C759]/40 hover:border-[#34C759]/70 shadow-xs'
                        : 'bg-navy-800/50 border-growth-500/30 hover:border-growth-500/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-xs transition ${
                        isLight 
                          ? 'text-[#000000] group-hover:text-[#007AFF]' 
                          : 'text-white group-hover:text-growth-400'
                      }`}>
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
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 font-medium ${
                          isLight 
                            ? 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/25' 
                            : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        }`}>
                          <Briefcase className="w-2.5 h-2.5" />
                          <span>{t('holding_alert_label', 'Holding')}</span>
                        </span>
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 font-medium ${
                          isLight 
                            ? 'bg-[#FF9500]/10 text-[#B25E00] border-[#FF9500]/25' 
                            : 'bg-gold-500/15 text-gold-300 border border-gold-500/30'
                        }`}>
                          <Star className="w-2.5 h-2.5" />
                          <span>{t('watchlist_alert_label', 'Watchlist')}</span>
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono flex items-center gap-1 shrink-0 ${
                      isLight ? 'text-[#8E8E93]' : 'text-slate-500'
                    }`}>
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>

                  <p className={`text-xs mt-1.5 leading-relaxed ${
                    isLight ? 'text-[#333333]' : 'text-slate-300'
                  }`}>
                    {alert.message}
                  </p>

                  <div className={`mt-2 flex items-center justify-between text-[11px] pt-1 border-t ${
                    isLight ? 'border-[rgba(0,0,0,0.06)] text-[#666666]' : 'border-navy-800/50 text-slate-400'
                  }`}>
                    <span className="font-mono">
                      {t('price_at_alert', 'Price at alert')}: <strong className={isLight ? 'text-black' : 'text-slate-200'}>${alert.price.toFixed(2)}</strong>
                    </span>
                    <span className={`group-hover:underline flex items-center gap-0.5 text-[10px] font-semibold ${
                      isLight ? 'text-[#007AFF]' : 'text-growth-400'
                    }`}>
                      <span>{t('view_analysis', 'View analysis')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className={`p-3 border-t text-center text-[10px] ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)] text-[#8E8E93]' : 'bg-navy-950 border-navy-850 text-slate-500'
        }`}>
          {t('settings_subtitle', 'Alert preferences can be customized in App Settings.')}
        </div>
      </div>
    </div>
  );
};
