import { InvestorProfile, StockRecommendationCard, AdvisorMessage } from '../types/advisor';
import { StockQuote } from '../types/stock';
import { Position } from '../types/portfolio';
import { STOCK_DIRECTORY } from './stockDirectory';
import { useSettingsStore } from '../store/settingsStore';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { VoicePersona } from './speechService';

export const INITIAL_GREETING_MESSAGE: AdvisorMessage = {
  id: 'msg_welcome',
  role: 'assistant',
  content: `Hey there! 👋 I'm **Nova**, your personal AI Investment Coach & Portfolio Roaster.

Looking for stocks or ETFs that actually make sense? Want an honest, unfiltered reality check on your portfolio? I'm here to give it to you straight—with a clear **"Why"**, a sound **"Next Step"**, and zero corporate fluff.

To get started, what should we look at?`,
  timestamp: Date.now(),
  quickReplies: [
    { id: 'goal_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and give me an honest, spicy reality check on my holdings.' },
    { id: 'goal_safe', label: '🛡️ Safe & Steady Long-Term', prompt: 'I want safe and steady long-term wealth without stressing over daily market dips.' },
    { id: 'goal_tech', label: '🚀 High-Growth Tech & AI', prompt: 'I want higher growth and want to participate in AI and mega tech trends.' },
    { id: 'goal_new', label: '❓ I am completely new, guide me', prompt: 'I have never invested before and have no idea where to start. Walk me through the basics step-by-step.' }
  ]
};

class AIAdvisorService {

  /**
   * Main responder: Calls Gemini if API key is configured, or generates an intelligent
   * grounded educational response tailored to the user's profile, market quotes, tone, and holdings.
   */
  public async generateAdvisorResponse(
    messages: AdvisorMessage[],
    profile: InvestorProfile,
    quotes: Record<string, StockQuote>,
    lang: string = 'en',
    tone: VoicePersona = 'spicy_sarcastic',
    positions: Position[] = []
  ): Promise<{ content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> }> {
    const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
    const lower = lastUserMsg.toLowerCase();

    // Check if custom Gemini key is configured
    const settings = useSettingsStore.getState();
    const apiKey = settings.geminiApiKey?.trim();

    if (apiKey) {
      try {
        const geminiResult = await this.callGeminiAdvisor(apiKey, messages, profile, quotes, lang, tone, positions);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini advisor call failed, falling back to local intelligent engine:', err);
      }
    }

    // Local Intelligent Grounded Advisor Engine
    return this.generateLocalAdvisorResponse(lower, profile, quotes, lang, tone, positions);
  }

  /**
   * Direct Gemini API Call with grounded system prompt for investment coaching & roasts
   */
  private async callGeminiAdvisor(
    apiKey: string,
    messages: AdvisorMessage[],
    profile: InvestorProfile,
    quotes: Record<string, StockQuote>,
    lang: string,
    tone: VoicePersona,
    positions: Position[]
  ): Promise<{ content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> } | null> {
    const isSpicy = tone === 'spicy_sarcastic';

    const systemPrompt = isSpicy
      ? `You are "Nova", a witty, spicy, sarcastic, and sharp Wall Street AI mentor and portfolio roaster in the InvestLearn mobile app.
Your personality:
- Sarcastic, sassy, sharp, and brutally honest about retail trading mistakes (FOMOing at the peak, bagholding loser stocks, panic selling dips, zero diversification, meme gambling).
- Highly entertaining and witty, but ALWAYS financially grounded in solid investment principles (Dollar-Cost Averaging, broad Index ETFs like VOO/USF, stop losses, position sizing).
- If the user asks to roast their portfolio, inspect their actual holdings: ${JSON.stringify(positions)} and deliver a hilarious, spicy roast of their asset allocation, bad timing, or lack of holdings!
- When recommending specific stocks, include a structured tag at the end in the format:
RECOMMENDATION: TICKER | MATCH_PERCENT | TIER(FOUNDATION/GROWTH/DIVIDEND) | WHY_FITS_YOU | ACTION_STEP_1; ACTION_STEP_2

Current User Profile: ${JSON.stringify(profile)}
Active Stock Quotes: ${Object.keys(quotes).slice(0, 15).join(', ')}
Respond in language: ${lang}.`
      : `You are "Nova", an elite, empathetic, and encouraging AI Investment Mentor for beginner and retail investors in the InvestLearn mobile app.
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
        { id: 'q_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
        { id: 'q_why', label: '💡 Why these picks?', prompt: 'Can you break down why you picked these over individual tech stocks?' },
        { id: 'q_how_much', label: '💵 How much to start?', prompt: 'How much money should I start with, and how often should I buy?' }
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
    lang: string,
    tone: VoicePersona = 'spicy_sarcastic',
    positions: Position[] = []
  ): { content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> } {

    const isSpicy = tone === 'spicy_sarcastic';

    // Scenario 0: User asks for a Portfolio Roast
    if (lower.includes('roast') || lower.includes('critique') || lower.includes('rate my portfolio')) {
      return this.generatePortfolioRoast(positions, quotes, isSpicy);
    }

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

      const content = isSpicy
        ? `Look at you, making a sensible life choice for once! 🛡️ While everyone else is busy buying meme coins at 3 AM, **broad Index ETFs are how real fortunes are actually built** without losing your hair.

Here is the unfiltered truth: Picking single stocks as a beginner is usually just donating your hard-earned cash to Wall Street hedge funds. With an index ETF, you own a sliver of hundreds of giant corporations simultaneously. When one trips, the others carry it.

Here are your two rock-solid foundation anchors:`
        : `Great choice! 🛡️ For long-term peace of mind, **broad Index ETFs are the undisputed gold standard** for beginner wealth building.

Here is why: When you buy single stocks, you take on "company risk"—if a CEO resigns or a product flops, your portfolio drops. But with an Index ETF, you own a tiny slice of hundreds of top corporations simultaneously. If one dips, the others support it.

Here are your two top customized matches:`;

      return {
        content,
        recommendations: [voov, usf],
        quickReplies: [
          { id: 'q_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
          { id: 'q_dca', label: '🔄 What is DCA?', prompt: 'Can you explain Dollar-Cost Averaging in simple terms?' },
          { id: 'q_tech_add', label: '🚀 Can I add a little Tech too?', prompt: 'Can I combine this safe ETF with a high-growth tech stock like Nvidia or Apple?' }
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

      const content = isSpicy
        ? `Ah, tech and AI. Let me guess—you saw a green candle on social media and now you want to go all-in at the peak? 🚀

Listen up: Artificial intelligence is a genuine revolution, but buying overextended momentum when RSI is 75 is the classic retail trap. If you want tech gains without checking the market 40 times a day in a cold sweat, use the **Core & Satellite strategy**.

Anchor 50% in a Growth ETF like **VOOG**, and keep individual rockets like **NVDA** capped at 15%–20%. That way, when tech takes a 15% breather, your portfolio doesn't look like a war zone.`
        : `Tech & AI represent massive generational growth trends! 🚀 

However, as your coach, here is the golden rule: **"Core & Satellite Strategy."** 
Never put 100% of your money into a single volatile tech stock. Instead, pair a Growth ETF (like **VOOG**) with high-conviction leaders (like **NVDA**). That way, you capture huge AI upside without risking devastating drawdowns.

Check out these tailored matches:`;

      return {
        content,
        recommendations: [voog, nvda],
        quickReplies: [
          { id: 'q_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
          { id: 'q_nvda_risk', label: '⚠️ Is Nvidia too expensive?', prompt: 'Is Nvidia currently too expensive to buy, or should I wait for a dip?' },
          { id: 'q_tesla_fit', label: '🚗 What about Tesla (TSLA)?', prompt: 'Is Tesla (TSLA) a good fit alongside Nvidia?' }
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

      const content = isSpicy
        ? `Oh, Tesla! ⚡ The favorite stock of adrenaline junkies and Elon tweet watchers everywhere.

Let's be completely real: Tesla doesn't trade like a traditional company—it trades like a roller coaster with no seatbelts. It can surge 20% on robotaxi hype or dump 25% on a price cut before lunch.

If you enjoy sleeping at night, **never make Tesla your biggest holding**. Cap it at 5%–10% as your speculative fun allocation, and let boring index funds carry the rest of your future retirement.`
        : `Here is an honest, objective breakdown on **Tesla (TSLA)**: ⚡

Tesla is a **polarizing, high-beta stock**. It behaves more like a high-speed roller coaster than a steady ship:
- **The Upside**: Autonomous AI (FSD), robotaxis, energy storage, and massive brand loyalty.
- **The Risk**: Fierce EV price competition, sensitive to interest rates, and high valuation multiples.

If you are a beginner, **do not make Tesla your primary holding**. If you love the company, treat it as a small "spice" in your portfolio (5%–10% max) while keeping the majority in broad index funds.`;

      return {
        content,
        recommendations: [tsla],
        quickReplies: [
          { id: 'q_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
          { id: 'q_balance_tsla', label: '⚖️ Balance with ETFs?', prompt: 'How should I balance Tesla with safe index ETFs?' },
          { id: 'q_other_picks', label: '🔍 What else do you suggest?', prompt: 'What other stocks or ETFs would you suggest for me?' }
        ]
      };
    }

    // Scenario 4: User asks about Dollar-Cost Averaging (DCA) or How much to start with
    if (lower.includes('dca') || lower.includes('dollar-cost') || lower.includes('how much') || lower.includes('start with') || lower.includes('budget')) {
      const content = isSpicy
        ? `**Dollar-Cost Averaging (DCA)**: The single greatest antidote to retail trader panic! 💡

Here is the secret: You are NOT a psychic. Neither am I, and neither is that guy on Twitter claiming he predicted the exact market bottom. Trying to time the perfect entry is a fool's errand.

With DCA, you invest a fixed amount (say $50 or $100) on the same day every month. When the market is euphoric and expensive, your money automatically buys fewer shares. When the market crashes and everyone is crying on Reddit, your money automatically scoops up shares on discount!

Start with whatever won't hurt your weekend plans—even **$30 a month** in an index ETF creates serious compound wealth.`
        : `**Dollar-Cost Averaging (DCA)** is the single most powerful habit in investing! 💡

### What is it?
Instead of stressing over whether today is the "perfect time" to buy, you invest a **fixed amount of money at regular intervals** (e.g. $50 every month or every payday).

### Why it works like magic:
1. When stock prices are **high**, your $50 automatically buys **fewer** shares.
2. When stock prices **drop**, your $50 automatically buys **more** shares on sale!
3. Over time, your average purchase price smooths out, completely removing emotional stress and the fear of "buying at the top."

**Recommendation**: Start with whatever doesn't hurt your monthly budget—even **$25 or $50 a month** in an index ETF like **VOOV** or **USF.NZ** builds massive long-term compound momentum.`;

      return {
        content,
        quickReplies: [
          { id: 'q_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
          { id: 'q_rec_etf', label: '🎯 Best ETF for DCA', prompt: 'Which specific ETF is best for my monthly DCA plan?' },
          { id: 'q_compound', label: '📈 Compound Growth', prompt: 'Explain how compound interest turns small monthly investments into large wealth.' }
        ]
      };
    }

    // Scenario 5: General fallback / Conversation continuer
    const content = isSpicy
      ? `I hear you! But let's cut through the noise and talk real strategy. 

Every dollar you throw into the market should have a specific job, not just a prayer. Tell me:
1. **How long can you leave this money untouched?** (1–2 years vs 5–10+ years)
2. **What happens to your heart rate when a stock drops 10% in a week?** (Do you panic-sell, or do you buy the dip like a pro?)`
      : `I hear you! As your investment mentor, my goal is to make sure every dollar you put to work has a clear purpose.

To give you the most tailored stock and ETF recommendations, tell me:
1. **How many years** can you leave your investments alone to grow? (e.g. 1–2 yrs vs 5–10+ yrs)
2. **What's your risk comfort?** (Do you prefer stability, or are you comfortable with roller coasters for higher gains?)`;

    return {
      content,
      quickReplies: [
        { id: 'goal_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
        { id: 'resp_long_safe', label: '🛡️ 5+ years, prefer low risk', prompt: 'I have a 5+ year timeline and prefer low risk with broad index ETFs.' },
        { id: 'resp_long_growth', label: '🚀 5+ years, love tech growth', prompt: 'I have a 5+ year timeline and want aggressive tech and AI growth.' }
      ]
    };
  }

  /**
   * Generates a witty, spicy, sarcastic portfolio roast based on actual user holdings
   */
  private generatePortfolioRoast(
    positions: Position[],
    quotes: Record<string, StockQuote>,
    isSpicy: boolean
  ): { content: string; recommendations?: StockRecommendationCard[]; quickReplies?: Array<{ id: string; label: string; prompt: string }> } {
    if (!positions || positions.length === 0) {
      return {
        content: `You want me to roast your portfolio? Darling, you don't even HAVE a portfolio yet! 💀

Right now, your asset allocation is **100% Cash** and **100% Procrastination**. You're watching inflation chew through your purchasing power while standing on the sidelines like a deer in the headlights!

Here is your spicy reality check: Stop waiting for the 'perfect dip' that never arrives. Put your first $50 into a broad index ETF like **VOOV** or **USF.NZ**, set up monthly Dollar-Cost Averaging, and actually start building wealth instead of dreaming about it! 🍿`,
        quickReplies: [
          { id: 'q_get_started', label: '🚀 How do I start my portfolio?', prompt: 'What is the very first stock or ETF I should buy today?' },
          { id: 'q_dca_plan', label: '🔄 Show me a DCA plan', prompt: 'Give me a simple $50 monthly DCA plan.' }
        ]
      };
    }

    if (positions.length === 1) {
      const p = positions[0];
      const quote = quotes[p.ticker] || this.getDirectoryStock(p.ticker);
      const currentPrice = quote.price || p.averageBuyPrice;
      const pnlPct = ((currentPrice - p.averageBuyPrice) / p.averageBuyPrice) * 100;
      const pnlStr = (pnlPct >= 0 ? '+' : '') + pnlPct.toFixed(1) + '%';

      return {
        content: `Alright, let's inspect this masterpiece... You have literally put everything into **${p.ticker}**! 🎢

You bought at **$${p.averageBuyPrice.toFixed(2)}**, current price is **$${currentPrice.toFixed(2)}** (${pnlStr}).

Putting 100% of your money into one single ticker is not an investment strategy—it's a high-stakes lottery ticket with a ticker symbol! If that company's CEO trips over their shoelaces tomorrow, your entire net worth takes a nosedive.

**The Fix**: Balance this lone wolf with a solid 50% foundation in an S&P 500 ETF (like **VOOV**). You can still keep ${p.ticker}, but without risking cardiac arrest every earnings season! 🛡️`,
        quickReplies: [
          { id: 'q_balance_etf', label: '🛡️ Best ETF to balance this', prompt: `What index ETF should I pair with ${p.ticker} to protect myself?` },
          { id: 'q_trim_rule', label: '💰 Should I take profits or cut losses?', prompt: `Given my entry at $${p.averageBuyPrice.toFixed(2)}, should I trim or hold?` }
        ]
      };
    }

    // Multiple positions roast
    let worstPosition = positions[0];
    let worstPnl = 999;
    let bestPosition = positions[0];
    let bestPnl = -999;

    positions.forEach((pos) => {
      const quote = quotes[pos.ticker] || this.getDirectoryStock(pos.ticker);
      const curPrice = quote.price || pos.averageBuyPrice;
      const pnl = ((curPrice - pos.averageBuyPrice) / pos.averageBuyPrice) * 100;
      if (pnl < worstPnl) {
        worstPnl = pnl;
        worstPosition = pos;
      }
      if (pnl > bestPnl) {
        bestPnl = pnl;
        bestPosition = pos;
      }
    });

    const tickerList = positions.map(p => p.ticker).join(', ');
    const worstStr = (worstPnl >= 0 ? '+' : '') + worstPnl.toFixed(1) + '%';
    const bestStr = (bestPnl >= 0 ? '+' : '') + bestPnl.toFixed(1) + '%';

    let roastBody = '';
    if (worstPnl < -8) {
      roastBody = `I see you're holding **${worstPosition.ticker}** down **${worstStr}** from your **$${worstPosition.averageBuyPrice.toFixed(2)}** cost basis. Let me guess: you saw a green candle on social media, thought 'this is going to the moon', bought the exact peak, and suddenly became an accidental 'long-term investor'? 🍿

Rule number one of not going broke: Never marry a losing stock without a stop-loss. Either dollar-cost average down if the company's fundamentals are actually intact, or stop holding bags out of pure pride!`;
    } else if (bestPnl > 15) {
      roastBody = `On the bright side, **${bestPosition.ticker}** is carrying the team up **${bestStr}**! Enjoy that dopamine hit, but remember: paper gains aren't real money until you lock them in. If it hits your target sell price, trim 20% to take your chips off the table.`;
    } else {
      roastBody = `Your portfolio (${tickerList}) is currently floating in limbo. Nothing is catastrophic, but you're probably checking the charts 15 times a day waiting for excitement. Stick to your DCA rules and stop staring at the 1-minute chart!`;
    }

    return {
      content: `🔥 **Nova's Spicy Portfolio Roast:**

You are currently juggling **${positions.length} positions**: [${tickerList}].

${roastBody}

**The Diagnosis**: You have courage, but discipline is what actually buys yachts. Keep broad index ETFs as at least 50% of your total balance so your individual stock bets don't ruin your sleep! ☕`,
      quickReplies: [
        { id: 'q_fix_worst', label: `⚠️ What should I do with ${worstPosition.ticker}?`, prompt: `Give me an action plan for ${worstPosition.ticker} which is currently ${worstStr}.` },
        { id: 'q_lock_profit', label: `💰 Lock gains on ${bestPosition.ticker}?`, prompt: `Should I trim ${bestPosition.ticker} to lock in ${bestStr}?` },
        { id: 'q_etf_anchor', label: '🛡️ Recommend safe ETFs for balance', prompt: 'Which index ETFs should I add to anchor this portfolio?' }
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
