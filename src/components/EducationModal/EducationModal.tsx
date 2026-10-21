import React from 'react';
import { X, BookOpen, Lightbulb, Compass, Shuffle, Check } from 'lucide-react';
import { getLocalizedGlossary, getLocalizedLessons } from '../../services/educationData';
import { useLanguageStore } from '../../store/languageStore';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  termOrId: string;
  onClose: () => void;
  onNextTip?: () => void;
}

export const EducationModal: React.FC<Props> = ({ termOrId, onClose, onNextTip }) => {
  const { language, t } = useLanguageStore();
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const glossary = getLocalizedGlossary(language);
  const lessons = getLocalizedLessons(language);

  // Look up in glossary or lessons
  const glossaryItem = glossary.find(g => 
    g.term.toLowerCase().includes(termOrId.toLowerCase()) || 
    termOrId.toLowerCase().includes(g.term.toLowerCase().split(' ')[0])
  );

  const lessonItem = lessons.find(l => 
    l.id.toLowerCase().includes(termOrId.toLowerCase()) || 
    l.title.toLowerCase().includes(termOrId.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-colors border ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000] shadow-[0_20px_50px_rgba(0,0,0,0.2)]' 
            : 'bg-navy-900 border-navy-700/80 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/70 border-navy-800'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
            }`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`text-[10px] uppercase tracking-wider font-bold block ${
                isLight ? 'text-[#FF9500]' : 'text-gold-400'
              }`}>
                {t('edu_academy', 'Investor Education')}
              </span>
              <h3 className={`text-base font-bold truncate ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                {glossaryItem ? glossaryItem.term : lessonItem ? lessonItem.title : termOrId}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onNextTip && (
              <button
                type="button"
                onClick={onNextTip}
                title="Next Tip"
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer active:scale-95 ${
                  isLight 
                    ? 'bg-[#E5E5EA] hover:bg-[#D1D1D6] text-[#007AFF]' 
                    : 'bg-white/10 hover:bg-white/15 text-gold-400'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Next</span>
              </button>
            )}

            <button 
              type="button"
              onClick={onClose}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                isLight 
                  ? 'bg-[#E5E5EA] hover:bg-[#D1D1D6] text-[#666666] hover:text-black' 
                  : 'bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-5 overflow-y-auto space-y-4 text-sm ${
          isLight ? 'text-[#333333]' : 'text-slate-300'
        }`}>
          {glossaryItem && (
            <>
              {/* Short Definition */}
              <div className={`p-3.5 rounded-xl border ${
                isLight 
                  ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' 
                  : 'bg-navy-800/80 border-navy-700'
              }`}>
                <span className={`text-xs font-semibold block mb-1 ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  {language === 'ko' ? '핵심 정의' : language === 'ja' ? '用語の定義' : language.startsWith('zh') ? '核心定義' : 'Definition'}
                </span>
                <p className={`font-medium ${isLight ? 'text-[#1C1C1E]' : 'text-slate-100'}`}>
                  {glossaryItem.shortDef}
                </p>
              </div>

              {/* Analogy Card */}
              <div className={`p-3.5 rounded-xl border ${
                isLight 
                  ? 'bg-[#FF9500]/10 border-[#FF9500]/30' 
                  : 'bg-gold-950/20 border-gold-600/30'
              }`}>
                <div className={`flex items-center gap-1.5 font-semibold text-xs mb-1 ${
                  isLight ? 'text-[#FF9500]' : 'text-gold-400'
                }`}>
                  <Lightbulb className="w-4 h-4" />
                  <span>{t('edu_plain_analogy', 'Beginner Analogy')}</span>
                </div>
                <p className={`text-xs italic leading-relaxed ${
                  isLight ? 'text-[#2C2C2E]' : 'text-slate-200'
                }`}>
                  "{glossaryItem.analogy}"
                </p>
              </div>

              {/* In-depth explanation */}
              <div className="space-y-1.5">
                <span className={`text-xs font-semibold block ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  {language === 'ko' ? '실전 투자 활용법' : language === 'ja' ? 'トレードでの活用法' : language.startsWith('zh') ? '實戰投資應用' : 'How to use this in your trading'}
                </span>
                <p className={`text-xs leading-relaxed ${
                  isLight ? 'text-[#3C3C43]' : 'text-slate-300'
                }`}>
                  {glossaryItem.fullExplanation}
                </p>
              </div>
            </>
          )}

          {lessonItem && !glossaryItem && (
            <>
              <p className={`text-xs leading-relaxed ${
                isLight ? 'text-[#3C3C43]' : 'text-slate-300'
              }`}>
                {lessonItem.summary}
              </p>
              <div className="space-y-2.5">
                {lessonItem.content.map((p, idx) => (
                  <p 
                    key={idx} 
                    className={`text-xs leading-relaxed p-3 rounded-xl border ${
                      isLight 
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] text-[#1C1C1E]' 
                        : 'bg-navy-800/50 border-navy-800 text-slate-300'
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className={`p-3.5 rounded-xl border text-xs ${
                isLight 
                  ? 'bg-[#34C759]/10 border-[#34C759]/30 text-[#248A3D]' 
                  : 'bg-growth-950/30 border-growth-600/30 text-growth-300'
              }`}>
                <span className="font-bold block mb-1">
                  {language === 'ko' ? '초보 핵심 원칙:' : language === 'ja' ? '初心者の最重要原則:' : language.startsWith('zh') ? '新手核心原則:' : 'Key Beginner Rule:'}
                </span>
                {lessonItem.beginnerTakeaway}
              </div>
            </>
          )}

          {!glossaryItem && !lessonItem && (
            <div className={`text-center py-6 ${isLight ? 'text-[#8E8E93]' : 'text-slate-400'}`}>
              <Compass className="w-10 h-10 mx-auto mb-2 opacity-60" />
              <p className="text-sm">Information for this indicator is being updated in the educational database.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-3.5 border-t flex items-center justify-between transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/70 border-navy-800'
        }`}>
          <div className="flex items-center gap-2">
            {onNextTip && (
              <button
                type="button"
                onClick={onNextTip}
                className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                  isLight ? 'text-[#007AFF] hover:underline' : 'text-gold-400 hover:underline'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{language.startsWith('zh') ? '換另一個技巧' : language === 'ko' ? '다른 팁 보기' : 'Explore Next Tip'}</span>
              </button>
            )}
            {!onNextTip && (
              <span className={`text-[11px] ${isLight ? 'text-[#8E8E93]' : 'text-slate-400'}`}>
                {language === 'ko' ? '하나씩 확실히 익혀보세요' : 'Master one concept at a time'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
              isLight 
                ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white' 
                : 'bg-growth-600 hover:bg-growth-500 text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{language === 'ko' ? '확인' : language === 'ja' ? '了解' : language.startsWith('zh') ? '確認' : 'Got It'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
