import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';

interface Props {
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<Props> = ({ onClose }) => {
  const { language, setLanguage, t } = useLanguageStore();

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-navy-900 border border-navy-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-growth-400" />
            <h3 className="text-sm font-bold text-white">
              {t('language_section_title', 'Select Language')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
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
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-growth-600/20 border-growth-500 shadow-sm ring-1 ring-growth-500/40'
                    : 'bg-navy-950/60 border-navy-850 hover:border-navy-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{item.flag}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.nativeName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{item.name}</p>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-growth-400 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-navy-950 border-t border-navy-850 text-center text-[10px] text-slate-500">
          {t('language_section_desc', 'Choose your preferred display language.')}
        </div>
      </div>
    </div>
  );
};
