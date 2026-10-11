import React from 'react';
import { LayoutDashboard, Sparkles, Newspaper, GraduationCap, Settings } from 'lucide-react';
import { useSettingsStore, AppTab } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  signalsCount?: number;
}

export const BottomNav: React.FC<Props> = ({ signalsCount = 0 }) => {
  const { activeTab, setActiveTab, themeMode } = useSettingsStore();
  const { t } = useLanguageStore();

  const isLight = themeMode === 'neutral-light';

  const tabs: Array<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: t('nav_dashboard', 'Portfolio'), icon: LayoutDashboard },
    { id: 'aiAdvisor', label: t('nav_ai_advisor', 'AI Coach'), icon: Sparkles },
    { id: 'news', label: t('nav_news', 'News'), icon: Newspaper },
    { id: 'education', label: t('nav_education', 'Learn'), icon: GraduationCap },
    { id: 'settings', label: t('nav_settings', 'Settings'), icon: Settings },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg safe-bottom w-full sm:max-w-md mx-auto transition-colors border-t ${
        isLight 
          ? 'bg-white/95 border-[rgba(0,0,0,0.1)] shadow-[0_-2px_8px_rgba(0,0,0,0.04)]' 
          : 'bg-navy-950/95 border-navy-800/80 shadow-[0_-2px_10px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="h-[56px] flex items-center justify-around px-1 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              data-touch-target="true"
              data-target-size="48x48px min"
              aria-label={tab.label}
              className={`flex-1 min-h-[48px] min-w-[48px] flex flex-col items-center justify-center rounded-xl transition-all relative select-none active:scale-95 focus:outline-none cursor-pointer ${
                isActive
                  ? isLight ? 'text-[#007AFF] font-bold' : 'text-growth-400 font-semibold'
                  : isLight ? 'text-[#8E8E93] hover:text-[#000000]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive 
                      ? isLight ? 'scale-110 text-[#007AFF]' : 'scale-110 text-growth-400'
                      : ''
                  }`}
                />
                {tab.id === 'aiAdvisor' && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span
                className={`text-[11px] leading-tight mt-1 tracking-tight ${
                  isActive ? 'font-bold' : 'font-normal'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className={`absolute bottom-1 w-6 h-[2.5px] rounded-full transition-all ${
                  isLight ? 'bg-[#007AFF]' : 'bg-growth-400'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
