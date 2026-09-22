import React from 'react';
import { LayoutDashboard, Zap, Newspaper, GraduationCap, Settings } from 'lucide-react';
import { useSettingsStore, AppTab } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  signalsCount?: number;
}

export const BottomNav: React.FC<Props> = ({ signalsCount = 0 }) => {
  const { activeTab, setActiveTab } = useSettingsStore();
  const { t } = useLanguageStore();

  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t('nav_dashboard', 'Portfolio'), icon: LayoutDashboard },
    { id: 'signals', label: t('nav_signals', 'Signals'), icon: Zap },
    { id: 'news', label: t('nav_news', 'News'), icon: Newspaper },
    { id: 'education', label: t('nav_education', 'Learn'), icon: GraduationCap },
    { id: 'settings', label: t('nav_settings', 'Settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 border-t border-navy-800/80 backdrop-blur-lg safe-bottom max-w-md mx-auto">
      <div className="flex items-center justify-around py-2 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-growth-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-growth-400' : ''}`} />
                {tab.id === 'signals' && signalsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gold-500 text-navy-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow">
                    {signalsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-growth-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
