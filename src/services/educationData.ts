import { EducationLesson, GlossaryItem, QuizQuestion } from '../types/education';

export const LESSONS: EducationLesson[] = [
  {
    id: 'lesson-rsi',
    title: 'RSI: The Rubber Band Indicator',
    category: 'Technical Timing',
    readTime: '3 min',
    summary: 'Learn how the Relative Strength Index helps you avoid buying at the absolute peak and spot bargain oversold zones.',
    content: [
      'The Relative Strength Index (RSI) measures the speed and magnitude of recent price moves on a scale from 0 to 100.',
      'Think of RSI like stretching a rubber band. If you stretch it too high (above 70), sellers usually step in to pull it back down — this is called "Overbought".',
      'If the rubber band is stretched down too hard (below 30), sellers become exhausted and value buyers look for bargains — this is called "Oversold".',
      'Rule of Thumb for Beginners: Never rush to buy when RSI is above 75. Wait for a slight pullback to enter with lower risk.'
    ],
    beginnerTakeaway: 'Buy when value is unloved (RSI < 35), and be cautious when euphoria is at a peak (RSI > 70).',
    iconName: 'Activity'
  },
  {
    id: 'lesson-macd',
    title: 'MACD: Riding the Wave of Momentum',
    category: 'Technical Timing',
    readTime: '4 min',
    summary: 'Discover how Moving Average Convergence Divergence acts like a momentum speedometer for stock prices.',
    content: [
      'MACD tracks the relationship between two moving averages: a fast-moving 12-day average and a slower 26-day average.',
      'When the fast line crosses ABOVE the slow signal line, it is a "Bullish Crossover" — like a sports car accelerating past traffic.',
      'When the fast line drops BELOW the signal line, it is a "Bearish Crossover" — momentum is decaying and caution is advised.',
      'MACD helps answer: "Are buyers gaining strength today, or are they running out of steam?"'
    ],
    beginnerTakeaway: 'A bullish MACD crossover after a period of decline is one of the clearest signs that buyers are regaining control.',
    iconName: 'TrendingUp'
  },
  {
    id: 'lesson-moving-averages',
    title: 'Moving Averages: The Institutional Floor',
    category: 'Technical Timing',
    readTime: '4 min',
    summary: 'Why Wall Street hedge funds and pension funds watch the 50-day and 200-day moving averages closely.',
    content: [
      'A Simple Moving Average (SMA) smooths out day-to-day noise by calculating the average closing price over a set period (e.g. 50 or 200 days).',
      'The 50-Day SMA represents intermediate trend support. When healthy stocks pull back during an uptrend, they frequently bounce right off this line.',
      'The 200-Day SMA is the grand dividing line: stocks above it are in a macro bull trend; stocks below it are struggling in a bear trend.',
      'Golden Cross: When the 50-day crosses ABOVE the 200-day, it signals long-term positive momentum. Death Cross is the opposite.'
    ],
    beginnerTakeaway: 'Always know where the 50-day and 200-day averages are. Buying near dynamic support offers the best risk-to-reward ratio.',
    iconName: 'LineChart'
  },
  {
    id: 'lesson-risk-management',
    title: 'Rule #1: Capital Preservation & DCA',
    category: 'Risk Management',
    readTime: '3 min',
    summary: 'How Dollar-Cost Averaging and proper position sizing protect you from emotionally panic-selling.',
    content: [
      'The biggest enemy of beginner investors is emotion: buying when hyped up (FOMO) and selling when frightened during a red day.',
      'Dollar-Cost Averaging (DCA): Instead of putting 100% of your cash in at once, break it into smaller tranches (e.g. 25% each month or on dips).',
      'Position Sizing Rule: Never put more than 5% to 10% of your total net worth into any single speculative stock.',
      'Stop-Loss Orders: Decide ahead of time how much loss you are willing to accept (e.g. -7% to -10%) to prevent a small mistake from wiping out your account.'
    ],
    beginnerTakeaway: 'Survival in investing comes first. Never let a single bad trade damage your long-term confidence.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'lesson-volume',
    title: 'Volume: Confirming True Market Conviction',
    category: 'Fundamentals',
    readTime: '3 min',
    summary: 'Price moves without volume are traps. Learn how volume reveals big institutional accumulation.',
    content: [
      'Volume is simply the total number of shares traded during a given day or time period.',
      'If a stock jumps +4% on heavy volume (e.g. 2x its 20-day average), big institutions and hedge funds are likely buying.',
      'If a stock moves up on tiny volume, it may be a weak, unsustainable bounce that can easily reverse tomorrow.',
      'Look for volume surges at key support levels as proof that buyers are putting real money on the line.'
    ],
    beginnerTakeaway: 'High volume confirms price direction; low volume warns of indecision or lack of real institutional backing.',
    iconName: 'BarChart2'
  }
];

export const GLOSSARY: GlossaryItem[] = [
  {
    term: 'RSI (Relative Strength Index)',
    shortDef: 'Momentum oscillator that measures speed and change of price moves on a 0-100 scale.',
    fullExplanation: 'Invented by J. Welles Wilder, RSI indicates whether a security is overbought (above 70) or oversold (below 30). For beginners, it prevents chasing prices that have already run up too far.',
    analogy: 'Imagine a pendulum swinging. When it swings too high to one side, gravity will inevitably pull it back toward center.',
    relatedIndicators: ['MACD', 'Stochastic'],
    tag: 'Technical'
  },
  {
    term: 'MACD',
    shortDef: 'Trend-following momentum indicator showing the relationship between two moving averages of prices.',
    fullExplanation: 'Calculated by subtracting the 26-period EMA from the 12-period EMA. A 9-day EMA called the "signal line" is plotted on top to trigger buy and sell signals.',
    analogy: 'Like two runners on a track. When the sprinter passes the marathon runner, speed is increasing dramatically.',
    relatedIndicators: ['RSI', 'Moving Averages'],
    tag: 'Technical'
  },
  {
    term: 'Dollar-Cost Averaging (DCA)',
    shortDef: 'Investing equal amounts of money at regular intervals regardless of stock price.',
    fullExplanation: 'By purchasing shares continuously across ups and downs, you automatically buy more shares when prices are cheap and fewer shares when prices are expensive, lowering your average cost.',
    analogy: 'Like buying groceries on a weekly grocery budget. When apples are on sale, your $20 gets you 20 apples. When pricey, you get 10. Your average price per apple stays low.',
    relatedIndicators: [],
    tag: 'Strategy'
  },
  {
    term: 'Golden Cross',
    shortDef: 'A bullish chart pattern where a short-term moving average (50 SMA) crosses above a long-term moving average (200 SMA).',
    fullExplanation: 'Signals a long-term bull market going forward. Many algorithmic funds and institutions systematically increase stock exposure when a Golden Cross forms.',
    analogy: 'Sunrise after a long winter: confirms that the warm upward trend is officially established.',
    relatedIndicators: ['Moving Averages', 'SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: 'Death Cross',
    shortDef: 'A bearish chart pattern where the 50 SMA crosses below the 200 SMA.',
    fullExplanation: 'Indicates that recent prices are falling faster than long-term historical trends, signaling potential prolonged downward pressure.',
    analogy: 'A warning siren that the prevailing weather has turned stormy.',
    relatedIndicators: ['Moving Averages', 'SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: 'P/E Ratio (Price-to-Earnings)',
    shortDef: 'The ratio of a company stock price to its per-share earnings.',
    fullExplanation: 'Tells you how many dollars investors are willing to pay for each $1 of current corporate profit. High P/E (e.g. 50+) means high growth expectations, while low P/E (e.g. 15) can indicate value or slow growth.',
    analogy: 'If a small bakery generates $10,000 profit a year and you buy it for $100,000, your P/E ratio is 10.',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: 'Market Capitalization',
    shortDef: 'Total dollar market value of a company outstanding shares.',
    fullExplanation: 'Calculated by multiplying total outstanding shares by current share price. Mega-cap: >$200B (Apple, Microsoft). Large-cap: >$10B. Mid-cap: $2B-$10B. Small-cap: <$2B.',
    analogy: 'The price tag to purchase every single brick and asset of the entire corporation today.',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: 'Stop-Loss Order',
    shortDef: 'An order placed with a broker to buy or sell once the stock reaches a certain price, limiting investor loss.',
    fullExplanation: 'A defensive risk management tool. If you buy at $100 and set a stop loss at $92, your shares will automatically sell if the price drops to $92, capping your loss at 8%.',
    analogy: 'An emergency brake on a runaway bicycle.',
    relatedIndicators: [],
    tag: 'Strategy'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'A stock has climbed rapidly and its RSI (Relative Strength Index) is now at 82. What does this indicate for a beginner?',
    options: [
      'The stock is a guaranteed buy because it has strong momentum.',
      'The stock is in the Overbought zone, meaning a short-term pullback is statistically common.',
      'The company has doubled its actual profit overnight.',
      'The market will shut down trading immediately.'
    ],
    correctIndex: 1,
    explanation: 'An RSI above 70 is classified as Overbought. While strong stocks can stay overbought for a while, buying when RSI is above 80 carries high risk of a sudden dip.'
  },
  {
    id: 'q2',
    question: 'What is a "Golden Cross" on a daily stock chart?',
    options: [
      'When gold commodity prices beat the stock market.',
      'When the 50-day moving average crosses above the 200-day moving average.',
      'When a stock price reaches exactly $100.00.',
      'When the company pays an extra dividend.'
    ],
    correctIndex: 1,
    explanation: 'A Golden Cross occurs when the 50-day simple moving average climbs above the 200-day moving average, signaling long-term bullish trend continuation.'
  },
  {
    id: 'q3',
    question: 'Why do disciplined investors use Dollar-Cost Averaging (DCA)?',
    options: [
      'It guarantees you always sell at the exact top of the market.',
      'It eliminates the need to pay taxes on profits.',
      'It removes emotional stress and avoids trying to predict impossible short-term market bottoms.',
      'It forces your broker to give you free shares.'
    ],
    correctIndex: 2,
    explanation: 'Dollar-Cost Averaging removes emotional guessing games. By investing a fixed amount regularly, you automatically buy more shares during dips and fewer when shares are expensive.'
  }
];

export { getLocalizedLessons, getLocalizedGlossary, getLocalizedQuiz } from './localizedEducationData';
