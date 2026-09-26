import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Clock, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Activity,
  LineChart,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLocalizedLessons, getLocalizedGlossary, getLocalizedQuiz } from '../../services/educationData';
import { EducationLesson, GlossaryItem } from '../../types/education';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { EducationModal } from '../../components/EducationModal/EducationModal';
import { useLanguageStore } from '../../store/languageStore';

export const EducationScreen: React.FC = () => {
  const { language, t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary' | 'quiz'>('lessons');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<EducationLesson | null>(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);

  // Localized data
  const lessons = getLocalizedLessons(language);
  const glossary = getLocalizedGlossary(language);
  const quizQuestions = getLocalizedQuiz(language);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredGlossary = glossary.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shortDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.analogy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount >= 2) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const getLessonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5 text-growth-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-growth-400" />;
      case 'LineChart': return <LineChart className="w-5 h-5 text-gold-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-growth-400" />;
      default: return <BarChart2 className="w-5 h-5 text-gold-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Top Header */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-[#FF9500] uppercase tracking-wider font-mono">
            {t('edu_academy', 'Investor Academy')}
          </span>
          <h2 className="text-xl font-extrabold text-[#000000] dark:text-white tracking-tight">
            {t('edu_title', 'Learn Trading & Timing')}
          </h2>
          <p className="text-[13px] text-[#666666] dark:text-slate-400 mt-0.5 leading-[1.6]">
            {t('edu_subtitle', 'Understand technical indicators, eliminate emotional trading, and protect your capital.')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#F2F2F7] dark:bg-navy-950 p-1.5 rounded-2xl border border-black/10 dark:border-navy-800 text-xs font-semibold">
          {[
            { id: 'lessons', label: t('edu_tab_lessons', 'Core Lessons'), icon: BookOpen },
            { id: 'glossary', label: t('edu_tab_glossary', 'Jargon Buster'), icon: HelpCircle },
            { id: 'quiz', label: t('edu_tab_quiz', 'Knowledge Check'), icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-h-[40px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                  isActive 
                    ? 'bg-white dark:bg-navy-800 text-[#000000] dark:text-white shadow-xs font-bold' 
                    : 'text-[#666666] dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CORE LESSONS */}
        {activeTab === 'lessons' && (
          <div className="space-y-3 animate-fadeIn">
            {lessons.map(lesson => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="bg-white dark:bg-navy-900/90 border border-black/10 dark:border-navy-800 hover:border-[#007AFF]/30 p-4 rounded-2xl cursor-pointer transition shadow-xs space-y-2 group min-h-[48px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#F2F2F7] dark:bg-navy-800 border border-black/5 dark:border-navy-700/80">
                      {getLessonIcon(lesson.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-bold text-[#FF9500] font-mono">
                        {lesson.category === 'Technical Timing' 
                          ? t('edu_tech_timing', 'TECHNICAL TIMING') 
                          : lesson.category === 'Risk Management' 
                          ? t('edu_risk_mgmt', 'RISK MANAGEMENT') 
                          : lesson.category}
                      </span>
                      <h4 className="text-base font-bold text-[#000000] dark:text-white group-hover:text-[#007AFF] transition">
                        {lesson.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#8E8E93] dark:text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.readTime}</span>
                  </div>
                </div>

                <p className="text-[13px] text-[#666666] dark:text-slate-300 leading-[1.6] line-clamp-2">
                  {lesson.summary}
                </p>

                <div className="pt-2 border-t border-black/10 dark:border-navy-800/60 flex items-center justify-between text-xs text-[#8E8E93]">
                  <span className="text-xs text-[#34C759] dark:text-growth-400 italic truncate max-w-[240px]">
                    "{lesson.beginnerTakeaway}"
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#8E8E93] group-hover:translate-x-1 group-hover:text-[#007AFF] transition" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: JARGON BUSTER (GLOSSARY) */}
        {activeTab === 'glossary' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-[#8E8E93] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('edu_search_glossary', 'Search financial terms (e.g. RSI, P/E, Golden Cross)...')}
                className="w-full min-h-[48px] bg-white dark:bg-navy-950 border border-black/10 dark:border-navy-800 rounded-xl pl-11 pr-3 py-3 text-[14px] text-[#000000] dark:text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#007AFF] shadow-xs"
              />
            </div>

            <div className="space-y-2.5">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGlossaryTerm(item.term)}
                  className="bg-white dark:bg-navy-900/90 border border-black/10 dark:border-navy-800 p-4 rounded-2xl cursor-pointer hover:border-[#007AFF]/30 transition space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#000000] dark:text-white">{item.term}</h4>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#F2F2F7] dark:bg-navy-800 text-[#666666] dark:text-slate-400 border border-black/5 dark:border-navy-750">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#666666] dark:text-slate-300 leading-[1.6]">{item.shortDef}</p>
                  <div className="pt-1 flex items-start gap-1.5 text-xs text-[#8F5B00] dark:text-gold-300/90 italic">
                    <Lightbulb className="w-4 h-4 text-[#FF9500] shrink-0 mt-0.5" />
                    <span>{t('edu_plain_analogy', 'Analogy')}: "{item.analogy}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE CHECK (QUIZ) */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-navy-950/60 p-4 rounded-2xl border border-black/10 dark:border-navy-800 shadow-xs">
              <h3 className="text-base font-bold text-[#000000] dark:text-white mb-1">
                {t('edu_quiz_title', 'Interactive Trading Quiz')}
              </h3>
              <p className="text-[13px] text-[#666666] dark:text-slate-400 leading-[1.6]">
                {t('edu_quiz_subtitle', 'Test your understanding of indicator timing, overbought zones, and risk preservation.')}
              </p>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q, qIndex) => {
                const selected = selectedAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="bg-white dark:bg-navy-900/90 border border-black/10 dark:border-navy-800 p-4 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#007AFF] text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-[14px] font-bold text-[#000000] dark:text-white leading-relaxed">{q.question}</h4>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'bg-[#F2F2F7] dark:bg-navy-950 border-black/10 dark:border-navy-800 text-[#000000] dark:text-slate-300 hover:bg-[#E8E8ED] dark:hover:bg-navy-850';

                        if (selected === optIndex) {
                          btnStyle = 'bg-[#007AFF]/10 border-[#007AFF] text-[#007AFF] font-semibold';
                        }

                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-[#34C759]/15 border-[#34C759] text-[#34C759] font-bold';
                          } else if (selected === optIndex && !isCorrect) {
                            btnStyle = 'bg-[#FF3B30]/15 border-[#FF3B30] text-[#FF3B30]';
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, optIndex)}
                            className={`w-full min-h-[48px] p-3 rounded-xl border text-[13px] text-left transition flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3.5 rounded-xl text-xs space-y-1 ${
                        isCorrect ? 'bg-[#34C759]/10 border border-[#34C759]/30' : 'bg-[#FF3B30]/10 border border-[#FF3B30]/30'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                              <span className="text-[#34C759]">Correct!</span>
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4 text-[#FF3B30]" />
                              <span className="text-[#FF3B30]">Review Needed</span>
                            </>
                          )}
                        </div>
                        <p className="text-[#666666] dark:text-slate-300 text-xs leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  className={`w-full min-h-[48px] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                    Object.keys(selectedAnswers).length === quizQuestions.length
                      ? 'bg-[#34C759] hover:bg-[#2EB04E] text-white shadow-xs'
                      : 'bg-[#E8E8ED] dark:bg-navy-800 text-[#8E8E93] dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  <span>{t('edu_submit_quiz', 'Submit Quiz')}</span>
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="w-full min-h-[48px] py-3.5 bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-sm rounded-xl transition shadow-xs"
                >
                  {t('edu_try_again', 'Retake Quiz')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedLesson && (
        <EducationModal termOrId={selectedLesson.id} onClose={() => setSelectedLesson(null)} />
      )}

      {selectedGlossaryTerm && (
        <EducationModal termOrId={selectedGlossaryTerm} onClose={() => setSelectedGlossaryTerm(null)} />
      )}
    </div>
  );
};
