import React from 'react';
import { X, BookOpen, Lightbulb, Compass, ArrowRight } from 'lucide-react';
import { getLocalizedGlossary, getLocalizedLessons } from '../../services/educationData';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  termOrId: string;
  onClose: () => void;
}

export const EducationModal: React.FC<Props> = ({ termOrId, onClose }) => {
  const { language, t } = useLanguageStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
                {t('edu_academy', 'Investor Education')}
              </span>
              <h3 className="text-base font-bold text-white">
                {glossaryItem ? glossaryItem.term : lessonItem ? lessonItem.title : termOrId}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-300">
          {glossaryItem && (
            <>
              {/* Short Definition */}
              <div className="p-3 bg-navy-800/80 rounded-xl border border-navy-700">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  {language === 'ko' ? '핵심 정의' : language === 'ja' ? '用語の定義' : language.startsWith('zh') ? '核心定義' : 'Definition'}
                </span>
                <p className="text-slate-100 font-medium">{glossaryItem.shortDef}</p>
              </div>

              {/* Analogy Card */}
              <div className="p-3.5 bg-gold-950/20 border border-gold-600/30 rounded-xl">
                <div className="flex items-center gap-1.5 text-gold-400 font-semibold text-xs mb-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>{t('edu_plain_analogy', 'Beginner Analogy')}</span>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{glossaryItem.analogy}"
                </p>
              </div>

              {/* In-depth explanation */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">
                  {language === 'ko' ? '실전 투자 활용법' : language === 'ja' ? 'トレードでの活用法' : language.startsWith('zh') ? '實戰投資應用' : 'How to use this in your trading'}
                </span>
                <p className="text-xs leading-relaxed text-slate-300">
                  {glossaryItem.fullExplanation}
                </p>
              </div>
            </>
          )}

          {lessonItem && !glossaryItem && (
            <>
              <p className="text-xs text-slate-300">{lessonItem.summary}</p>
              <div className="space-y-2.5">
                {lessonItem.content.map((p, idx) => (
                  <p key={idx} className="text-xs text-slate-300 leading-relaxed bg-navy-800/50 p-2.5 rounded-lg border border-navy-800">
                    {p}
                  </p>
                ))}
              </div>
              <div className="p-3 bg-growth-950/30 border border-growth-600/30 rounded-xl text-xs text-growth-300">
                <span className="font-bold block mb-1">
                  {language === 'ko' ? '초보 핵심 원칙:' : language === 'ja' ? '初心者の最重要原則:' : language.startsWith('zh') ? '新手核心原則:' : 'Key Beginner Rule:'}
                </span>
                {lessonItem.beginnerTakeaway}
              </div>
            </>
          )}

          {!glossaryItem && !lessonItem && (
            <div className="text-center py-6 text-slate-400">
              <Compass className="w-10 h-10 mx-auto mb-2 text-gold-400 opacity-60" />
              <p className="text-sm">Information for this indicator is being updated in the educational database.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-navy-800 bg-navy-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {language === 'ko' ? '하나씩 확실히 익혀보세요' : 'Master one concept at a time'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-growth-600 hover:bg-growth-500 text-white text-xs font-semibold rounded-lg transition"
          >
            {language === 'ko' ? '확인' : language === 'ja' ? '了解' : language.startsWith('zh') ? '確認' : 'Got It'}
          </button>
        </div>
      </div>
    </div>
  );
};
