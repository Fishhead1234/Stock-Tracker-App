import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { useSettingsStore } from '../../store/settingsStore';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';

interface Props {
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<Props> = ({ onClose }) => {
  const { language, setLanguage, t } = useLanguageStore();
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-sm border rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-colors duration-200 ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000]' 
            : 'bg-navy-900 border-navy-800 text-white'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <div className="flex items-center gap-2">
            <Globe className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
            <h3 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
              {t('language_section_title', 'Select Language')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition ${
              isLight ? 'text-[#8E8E93] hover:text-[#000000] hover:bg-[#E5E5EA]' : 'text-slate-400 hover:text-white hover:bg-navy-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-4 grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-[#34C759]/15 border-[#34C759] shadow-xs ring-1 ring-[#34C759]/40'
                      : 'bg-growth-600/20 border-growth-500 shadow-sm ring-1 ring-growth-500/40'
                    : isLight
                      ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] hover:border-[#007AFF]/30 hover:bg-[#E8E8ED]'
                      : 'bg-navy-950/60 border-navy-850 hover:border-navy-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{item.flag}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${
                      isSelected 
                        ? isLight ? 'text-[#248A3D]' : 'text-white'
                        : isLight ? 'text-[#000000]' : 'text-slate-200'
                    }`}>
                      {item.nativeName}
                    </p>
                    <p className={`text-[10px] truncate ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                      {item.name}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <Check className={`w-4 h-4 shrink-0 ml-1 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
                )}
              </button>
            );
          })}
        </div>

        <div className={`p-3 border-t text-center text-[10px] ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)] text-[#8E8E93]' : 'bg-navy-950 border-navy-850 text-slate-500'
        }`}>
          {t('language_section_desc', 'Choose your preferred display language.')}
        </div>
      </div>
    </div>
  );
};
