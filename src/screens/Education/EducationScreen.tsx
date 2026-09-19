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
import { LESSONS, GLOSSARY, QUIZ_QUESTIONS } from '../../services/educationData';
import { EducationLesson, GlossaryItem } from '../../types/education';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { EducationModal } from '../../components/EducationModal/EducationModal';

export const EducationScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary' | 'quiz'>('lessons');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<EducationLesson | null>(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredGlossary = GLOSSARY.filter(item => 
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
    QUIZ_QUESTIONS.forEach(q => {
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
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider font-mono">
            Investor Academy
          </span>
          <h2 className="text-xl font-extrabold text-white">Learn Trading & Timing</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Understand technical indicators, eliminate emotional trading, and protect your capital.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-navy-950 p-1 rounded-2xl border border-navy-800 text-xs font-semibold">
          {[
            { id: 'lessons', label: 'Core Lessons', icon: BookOpen },
            { id: 'glossary', label: 'Jargon Buster', icon: HelpCircle },
            { id: 'quiz', label: 'Knowledge Check', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                  isActive ? 'bg-navy-800 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
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
            {LESSONS.map(lesson => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="bg-navy-900/90 border border-navy-800 hover:border-navy-750 p-4 rounded-2xl cursor-pointer transition shadow-sm space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-navy-800 border border-navy-700/80">
                      {getLessonIcon(lesson.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-400 font-mono">
                        {lesson.category}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-growth-300 transition">
                        {lesson.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{lesson.readTime}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {lesson.summary}
                </p>

                <div className="pt-2 border-t border-navy-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] text-growth-400/90 italic truncate max-w-[240px]">
                    "{lesson.beginnerTakeaway}"
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition" />
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
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search financial terms (e.g. RSI, P/E, Golden Cross)..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500"
              />
            </div>

            <div className="space-y-2.5">
              {filteredGlossary.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGlossaryTerm(item.term)}
                  className="bg-navy-900/90 border border-navy-800 p-3.5 rounded-2xl cursor-pointer hover:border-navy-700 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{item.term}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-navy-800 text-slate-400 border border-navy-750">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.shortDef}</p>
                  <div className="pt-1 flex items-start gap-1 text-[11px] text-gold-300/90 italic">
                    <Lightbulb className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                    <span>Analogy: "{item.analogy}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE CHECK (QUIZ) */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-navy-950/60 p-3.5 rounded-2xl border border-navy-800">
              <h3 className="text-xs font-bold text-white mb-1">Interactive Trading Quiz</h3>
              <p className="text-xs text-slate-400">
                Test your understanding of indicator timing, overbought zones, and risk preservation.
              </p>
            </div>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const selected = selectedAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="bg-navy-900/90 border border-navy-800 p-4 rounded-2xl space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-navy-800 text-slate-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-relaxed">{q.question}</h4>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle = 'bg-navy-950 border-navy-800 text-slate-300 hover:bg-navy-850';

                        if (selected === optIndex) {
                          btnStyle = 'bg-navy-800 border-growth-500 text-white font-medium';
                        }

                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-growth-950/60 border-growth-500 text-growth-300 font-bold';
                          } else if (selected === optIndex && !isCorrect) {
                            btnStyle = 'bg-loss-950/60 border-loss-500 text-loss-300';
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, optIndex)}
                            className={`w-full p-2.5 rounded-xl border text-xs text-left transition flex items-start gap-2 ${btnStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect ? 'bg-growth-950/30 border border-growth-600/30' : 'bg-loss-950/30 border border-loss-600/30'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-growth-400" />
                              <span className="text-growth-400">Correct!</span>
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4 text-loss-400" />
                              <span className="text-loss-400">Review Needed</span>
                            </>
                          )}
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{q.explanation}</p>
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
                  disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    Object.keys(selectedAnswers).length === QUIZ_QUESTIONS.length
                      ? 'bg-growth-600 hover:bg-growth-500 text-white shadow-lg'
                      : 'bg-navy-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Submit & Check Answers</span>
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="w-full py-3 bg-navy-800 hover:bg-navy-750 text-white font-semibold text-xs rounded-xl transition"
                >
                  Try Again
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
