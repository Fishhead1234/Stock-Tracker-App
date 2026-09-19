export interface EducationLesson {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Technical Timing' | 'Risk Management' | 'Psychology';
  readTime: string;
  summary: string;
  content: string[];
  beginnerTakeaway: string;
  iconName: string;
}

export interface GlossaryItem {
  term: string;
  shortDef: string;
  fullExplanation: string;
  analogy: string;
  relatedIndicators?: string[];
  tag: 'Technical' | 'Valuation' | 'Strategy' | 'General';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
