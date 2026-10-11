import { InvestorProfile, StockRecommendationCard, AdvisorMessage } from '../types/advisor';
import { StockQuote } from '../types/stock';
import { STOCK_DIRECTORY, DirectoryStockItem } from './stockDirectory';
import { generateTimingSignal } from './signalEngine';
import { useSettingsStore } from '../store/settingsStore';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

export const INITIAL_GREETING_MESSAGE: AdvisorMessage = {
  id: 'msg_welcome',
  role: 'assistant',
  content: `Hey there! 👋 I'm **Nova**, your personal AI Investment Coach.

If you don't know what stocks or ETFs to focus on, you're in the right place! My job is to learn about **you**—your goals, timeline, and comfort with risk—and recommend what actually fits your life, with a clear **"Why"** and **"Next Step"**.

To get started, what's your primary goal right now?`,
  timestamp: Date.now(),
  quickReplies: [
    { id: 'goal_safe', label: '🛡️ Safe & Steady Long-Term', prompt: 'I want safe and steady long-term wealth without stressing over daily market dips.' },
    { id: 'goal_tech', label: '🚀 High-Growth Tech & AI', prompt: 'I want higher growth and want to participate in AI and mega tech trends.' },
    { id: 'goal_div', label: '💰 Dividend Income Cash Flow', prompt: 'I want reliable dividend income that pays me cash flow regularly.' },
    { id: 'goal_new', label: '❓ I am completely new, guide me', prompt: 'I have never invested before and have no idea where to start. Walk me through the basics step-by-step.' }
  ]
};

class AIAdvisorService {

  /**
   * Main responder: Calls Gemini if API key is configured, or generates an intelligent
   * grounded educational response tailored to the user's profile and market quotes.
   */
  public async generateAdvisorResponse(
    messages: AdvisorMessage[],
    profile: InvestorProfile,
    quotes: Record<string, StockQuote>,
    lang: string = 'en'
  ): Promise<{ content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> }> {
    const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
    const lower = lastUserMsg.toLowerCase();

    // Check if custom Gemini key is configured
    const settings = useSettingsStore.getState();
    const apiKey = settings.geminiApiKey?.trim();

    if (apiKey) {
      try {
        const geminiResult = await this.callGeminiAdvisor(apiKey, messages, profile, quotes, lang);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini advisor call failed, falling back to local intelligent engine:', err);
      }
    }

    // Local Intelligent Grounded Advisor Engine
    return this.generateLocalAdvisorResponse(lower, profile, quotes, lang);
  }

  /**
   * Direct Gemini API Call with grounded system prompt for investment coaching
   */
  private async callGeminiAdvisor(
    apiKey: string,
    messages: AdvisorMessage[],
    profile: InvestorProfile,
    quotes: Record<string, StockQuote>,
    lang: string
  ): Promise<{ content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> } | null> {
    const systemPrompt = `You are "Nova", an elite, empathetic, and encouraging AI Investment Mentor for beginner and retail investors in the InvestLearn mobile app.
Your mission:
1. Help beginners choose stocks/ETFs that match their personal horizon, risk appetite, and interests.
2. Always explain "WHY THIS FITS YOU" in plain English without confusing jargon.
3. If recommending index ETFs (e.g. VOO, VOOV, USF.NZ), explain why broad diversification beats stock picking for beginners.
4. If recommending tech (e.g. NVDA, AAPL), outline the risk boundaries and dollar-cost averaging (DCA) rules.
5. Provide actionable next steps: allocation percentage, entry pace, and what to monitor.
6. When recommending specific stocks, include a structured tag at the end in the format:
RECOMMENDATION: TICKER | MATCH_PERCENT | TIER(FOUNDATION/GROWTH/DIVIDEND) | WHY_FITS_YOU | ACTION_STEP_1; ACTION_STEP_2

Current User Profile: ${JSON.stringify(profile)}
Active Stock Quotes: ${Object.keys(quotes).slice(0, 15).join(', ')}
Respond in language: ${lang}.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...messages.slice(-6).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const model = useSettingsStore.getState().geminiModel?.trim() || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let textResponse = '';
    if (Capacitor.isNativePlatform()) {
      const res = await CapacitorHttp.post({
        url,
        headers: { 'Content-Type': 'application/json' },
        data: { contents }
      });
      textResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });
      const data = await res.json();
      textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    if (!textResponse) return null;

    // Parse recommendations if any
    const recs: StockRecommendationCard[] = [];
    const lines = textResponse.split('\n');
    const cleanedLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('RECOMMENDATION:')) {
        const parts = line.replace('RECOMMENDATION:', '').split('|').map(s => s.trim());
        const ticker = parts[0];
        const matchScore = parseInt(parts[1]) || 90;
        const matchTier = (parts[2] || 'FOUNDATION') as any;
        const why = parts[3] || 'Fits your investment timeline and risk appetite.';
        const actions = (parts[4] || '').split(';').map(a => a.trim()).filter(Boolean);

        const quote = quotes[ticker] || this.getDirectoryStock(ticker);
        if (quote) {
          recs.push({
            ticker: quote.ticker,
            name: quote.name,
            exchange: quote.exchange,
            currentPrice: quote.price,
            currencySymbol: quote.currencySymbol,
            changePercent: quote.changePercent,
            matchScore,
            matchTier,
            whyFitsYou: why,
            actionPlan: actions.length > 0 ? actions : ['Start with small dollar amounts', 'Dollar-cost average monthly']
          });
        }
      } else {
        cleanedLines.push(line);
      }
    }

    return {
      content: cleanedLines.join('\n').trim(),
      recommendations: recs.length > 0 ? recs : undefined,
      quickReplies: [
        { id: 'q_why', label: '💡 Why these picks?', prompt: 'Can you break down why you picked these over individual tech stocks?' },
        { id: 'q_how_much', label: '💵 How much should I start with?', prompt: 'How much money should I start with, and how often should I buy?' },
        { id: 'q_tesla', label: '⚡ Is Tesla good for me?', prompt: 'What about Tesla (TSLA)? Is that a good fit for my profile?' }
      ]
    };
  }

  /**
   * Local grounded educational response generator for fast offline / mock experiences
   */
  private generateLocalAdvisorResponse(
    lower: string,
    profile: InvestorProfile,
    quotes: Record<string, StockQuote>,
    lang: string
  ): { content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> } {

    // Scenario 1: User mentions Safe / Long-Term / S&P 500 / ETFs / Beginner
    if (lower.includes('safe') || lower.includes('steady') || lower.includes('long-term') || lower.includes('etf') || lower.includes('new') || lower.includes('never')) {
      const voov = this.buildRecommendation('VOOV', quotes, 96, 'FOUNDATION',
        'Because you are starting out and want steady, stress-free compound growth, VOOV tracks the proven value bedrock of the S&P 500. Instead of gambling on a single company, you own hundreds of America\'s strongest dividend-paying businesses.',
        [
          'Core Foundation: Allocate 60%–70% of your initial funds here',
          'Set up recurring Dollar-Cost Averaging ($50–$100 monthly)',
          'Ignore daily market fluctuations—your timeline is 5+ years'
        ]
      );

      const usf = this.buildRecommendation('USF.NZ', quotes, 92, 'FOUNDATION',
        'Ideal if you trade in NZD or want foreign global index exposure. Holds the top 500 world companies with zero management stress.',
        [
          'Balanced anchor for international or dual-currency holdings',
          'Buy fractional shares whenever you save extra cash'
        ]
      );

      return {
        content: `Great choice! 🛡️ For long-term peace of mind, **broad Index ETFs are the undisputed gold standard** for beginner wealth building.

Here is why: When you buy single stocks, you take on "company risk"—if a CEO resigns or a product flops, your portfolio drops. But with an Index ETF, you own a tiny slice of hundreds of top corporations simultaneously. If one dips, the others support it.

Here are your two top customized matches:`,
        recommendations: [voov, usf],
        quickReplies: [
          { id: 'q_dca', label: '🔄 What is Dollar-Cost Averaging?', prompt: 'Can you explain Dollar-Cost Averaging in simple terms?' },
          { id: 'q_tech_add', label: '🚀 Can I add a little Tech too?', prompt: 'Can I combine this safe ETF with a high-growth tech stock like Nvidia or Apple?' },
          { id: 'q_how_start', label: '💵 How much $ should I put in?', prompt: 'How much money should I start with on my very first purchase?' }
        ]
      };
    }

    // Scenario 2: User mentions Tech / Growth / AI / Nvidia / Apple / High Return
    if (lower.includes('tech') || lower.includes('growth') || lower.includes('ai') || lower.includes('nvidia') || lower.includes('apple') || lower.includes('high')) {
      const nvda = this.buildRecommendation('NVDA', quotes, 91, 'GROWTH',
        'Matches your interest in Artificial Intelligence. Nvidia designs the essential AI accelerator chips for virtually all global tech giants.',
        [
          'Growth satellite: Keep allocation between 15%–25% of your portfolio',
          'Do NOT invest money you need in the next 12 months due to tech volatility',
          'Use pullbacks to average down your entry price'
        ]
      );

      const voog = this.buildRecommendation('VOOG', quotes, 94, 'GROWTH',
        'The best of both worlds: An S&P 500 ETF that specifically over-weights Apple, Microsoft, Nvidia, Amazon, and Google in one single basket.',
        [
          'Allows you to capture tech explosion while retaining index safety',
          'Ideal 50% core anchor for growth-focused investors'
        ]
      );

      return {
        content: `Tech & AI represent massive generational growth trends! 🚀 

However, as your coach, here is the golden rule: **"Core & Satellite Strategy."** 
Never put 100% of your money into a single volatile tech stock. Instead, pair a Growth ETF (like **VOOG**) with high-conviction leaders (like **NVDA**). That way, you capture huge AI upside without risking devastating drawdowns.

Check out these tailored matches:`,
        recommendations: [voog, nvda],
        quickReplies: [
          { id: 'q_nvda_risk', label: '⚠️ Is Nvidia too expensive right now?', prompt: 'Is Nvidia currently too expensive to buy, or should I wait for a dip?' },
          { id: 'q_tesla_fit', label: '🚗 What about Tesla (TSLA)?', prompt: 'Is Tesla (TSLA) a good fit alongside Nvidia?' },
          { id: 'q_safe_anchor', label: '🛡️ Show me safe ETFs instead', prompt: 'I want to see safer bedrock ETFs instead.' }
        ]
      };
    }

    // Scenario 3: User mentions Tesla (TSLA) specifically
    if (lower.includes('tsla') || lower.includes('tesla')) {
      const tsla = this.buildRecommendation('TSLA', quotes, 75, 'GROWTH',
        'High-volatility growth company combining autonomous driving, AI robotics, and electric vehicles. Expect wild price swings of 20%-40%.',
        [
          'High Risk Guardrail: Never allocate more than 5%–10% of total wealth',
          'Only invest if your emotional tolerance can handle 30% drawdowns without panicking',
          'Pair with a safe index ETF like VOOV to cushion volatility'
        ]
      );

      return {
        content: `Here is an honest, objective breakdown on **Tesla (TSLA)**: ⚡

Tesla is a **polarizing, high-beta stock**. It behaves more like a high-speed roller coaster than a steady ship:
- **The Upside**: Autonomous AI (FSD), robotaxis, energy storage, and massive brand loyalty.
- **The Risk**: Fierce EV price competition, sensitive to interest rates, and high valuation multiples.

If you are a beginner, **do not make Tesla your primary holding**. If you love the company, treat it as a small "spice" in your portfolio (5%–10% max) while keeping the majority in broad index funds.`,
        recommendations: [tsla],
        quickReplies: [
          { id: 'q_balance_tsla', label: '⚖️ How to balance Tesla with ETFs?', prompt: 'How should I balance Tesla with safe index ETFs?' },
          { id: 'q_dca_explain', label: '🔄 What is DCA?', prompt: 'What is dollar-cost averaging and how does it protect me?' },
          { id: 'q_other_picks', label: '🔍 What else do you suggest?', prompt: 'What other stocks or ETFs would you suggest for me?' }
        ]
      };
    }

    // Scenario 4: User asks about Dollar-Cost Averaging (DCA) or How much to start with
    if (lower.includes('dca') || lower.includes('dollar-cost') || lower.includes('how much') || lower.includes('start with') || lower.includes('budget')) {
      return {
        content: `**Dollar-Cost Averaging (DCA)** is the single most powerful habit in investing! 💡

### What is it?
Instead of stressing over whether today is the "perfect time" to buy, you invest a **fixed amount of money at regular intervals** (e.g. $50 every month or every payday).

### Why it works like magic:
1. When stock prices are **high**, your $50 automatically buys **fewer** shares.
2. When stock prices **drop**, your $50 automatically buys **more** shares on sale!
3. Over time, your average purchase price smooths out, completely removing emotional stress and the fear of "buying at the top."

**Recommendation**: Start with whatever doesn't hurt your monthly budget—even **$25 or $50 a month** in an index ETF like **VOOV** or **USF.NZ** builds massive long-term compound momentum.`,
        quickReplies: [
          { id: 'q_rec_etf', label: '🎯 Show me the best ETF for DCA', prompt: 'Which specific ETF is best for my monthly DCA plan?' },
          { id: 'q_compound', label: '📈 How does compound interest work?', prompt: 'Explain how compound interest turns small monthly investments into large wealth.' },
          { id: 'q_profile_reset', label: '🔄 Update my preferences', prompt: 'I want to re-evaluate my risk profile and goals.' }
        ]
      };
    }

    // Scenario 5: General fallback / Conversation continuer
    return {
      content: `I hear you! As your investment mentor, my goal is to make sure every dollar you put to work has a clear purpose.

To give you the most tailored stock and ETF recommendations, tell me:
1. **How many years** can you leave your investments alone to grow? (e.g. 1–2 yrs vs 5–10+ yrs)
2. **What's your risk comfort?** (Do you prefer stability, or are you comfortable with roller coasters for higher gains?)`,
      quickReplies: [
        { id: 'resp_long_safe', label: '🛡️ 5+ years, prefer low risk', prompt: 'I have a 5+ year timeline and prefer low risk with broad index ETFs.' },
        { id: 'resp_long_growth', label: '🚀 5+ years, love tech growth', prompt: 'I have a 5+ year timeline and want aggressive tech and AI growth.' },
        { id: 'resp_short', label: '⏳ 1-2 years short timeline', prompt: 'I might need this money in 1-2 years, what is safest?' }
      ]
    };
  }

  private buildRecommendation(
    ticker: string,
    quotes: Record<string, StockQuote>,
    matchScore: number,
    matchTier: 'FOUNDATION' | 'GROWTH' | 'DIVIDEND' | 'BALANCED',
    whyFitsYou: string,
    actionPlan: string[]
  ): StockRecommendationCard {
    const quote = quotes[ticker] || this.getDirectoryStock(ticker);
    return {
      ticker: quote.ticker,
      name: quote.name,
      exchange: quote.exchange,
      currentPrice: quote.price,
      currencySymbol: quote.currencySymbol || '$',
      changePercent: quote.changePercent || 0,
      matchScore,
      matchTier,
      whyFitsYou,
      actionPlan
    };
  }

  private getDirectoryStock(ticker: string): StockQuote {
    const item = STOCK_DIRECTORY.find(s => s.ticker.toUpperCase() === ticker.toUpperCase()) || STOCK_DIRECTORY[0];
    return {
      ticker: item.ticker,
      name: item.name,
      exchange: item.exchange,
      country: item.country,
      countryCode: item.countryCode,
      currency: item.currency,
      currencySymbol: item.currencySymbol,
      price: item.basePrice,
      change: 0,
      changePercent: 0,
      high: item.basePrice * 1.02,
      low: item.basePrice * 0.98,
      open: item.basePrice,
      previousClose: item.basePrice,
      volume: 1000000,
      marketCap: item.marketCap || '$100B',
      peRatio: item.peRatio || 25,
      sector: item.sector,
      indicators: {
        rsi: 48,
        macd: { macdLine: 0.5, signalLine: 0.4, histogram: 0.1, crossover: 'neutral' },
        sma20: item.basePrice * 0.99,
        sma50: item.basePrice * 0.98,
        sma200: item.basePrice * 0.95,
        volumeAverage20: 1000000,
        volumeSurgeRatio: 1.0,
        high52Week: item.basePrice * 1.2,
        low52Week: item.basePrice * 0.8
      },
      history: { '1D': [], '1W': [], '1M': [], '1Y': [], 'ALL': [] },
      lastUpdated: new Date().toISOString()
    };
  }
}

export const aiAdvisorService = new AIAdvisorService();
