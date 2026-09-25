import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { ComplianceModal } from './ComplianceModal';
import { useLanguageStore } from '../../store/languageStore';
import { useSettingsStore } from '../../store/settingsStore';

export const DisclaimerBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguageStore();
  const { themeMode } = useSettingsStore();

  const isLight = themeMode === 'neutral-light';

  return (
    <>
      <div className={`px-3 py-2 text-xs flex items-center justify-between backdrop-blur-md sticky top-0 z-30 shadow-xs border-b transition-colors safe-top ${
        isLight 
          ? 'bg-white/95 border-[rgba(0,0,0,0.08)] text-[#666666]' 
          : 'bg-navy-950/95 border-navy-800/80 text-slate-300'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1 mr-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            isLight ? 'bg-[#FF9500]' : 'bg-gold-400'
          }`} />
          <p className="truncate text-[11px] leading-tight">
            <strong className={`font-semibold ${isLight ? 'text-[#000000]' : 'text-gold-400'}`}>
              {t('strict_disclosure_title', 'Informational Only')}:
            </strong>{' '}
            {t('strict_disclosure_text', 'Educational tool only. No in-app trade execution.')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          data-touch-target="true"
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 ${
            isLight 
              ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] text-[#000000] border-[rgba(0,0,0,0.1)]' 
              : 'bg-navy-850 hover:bg-navy-750 text-slate-200 border-navy-700'
          }`}
        >
          <Info className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-gold-400'}`} />
          <span>{t('nav_education', 'Disclaimers')}</span>
        </button>
      </div>

      {showModal && <ComplianceModal onClose={() => setShowModal(false)} />}
    </>
  );
};
