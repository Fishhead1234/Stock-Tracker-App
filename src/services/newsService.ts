import { NewsArticle, MarketPulse, NewsCategory } from '../types/news';

const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'news-nvda-blackwell',
    headline: 'NVIDIA Accelerates Blackwell AI Server Shipments as Hyperscaler Demand Surges',
    summary: 'Cloud titans (Microsoft, Amazon, Google, Meta) expanded capital expenditures for next-generation AI infrastructure, absorbing full Blackwell chip production for the next four quarters.',
    educationalTakeaway: 'When customers pre-purchase all available hardware supply for a year, it creates strong revenue visibility and pricing power. Datacenter hardware carries high 70%+ gross margins, directly boosting earnings-per-share (EPS).',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    category: 'TECH',
    sentiment: 'BULLISH',
    impact: 'HIGH',
    timestamp: '25m ago',
    source: 'Quarterly Supply Chain Wire'
  },
  {
    id: 'news-fed-rates-macro',
    headline: 'Federal Reserve Signals Measured Interest Rate Path as Inflation Moderates Near 2.5%',
    summary: 'Central bank officials noted that cooler labor data and stable consumer spending support gradual rate reductions, lowering benchmark borrowing costs across commercial credit markets.',
    educationalTakeaway: 'Lower interest rates reduce borrowing costs for corporations and make safe treasury bonds less competitive compared to equities. Growth stocks typically surge because their future cash flows are discounted at lower interest rates.',
    ticker: 'SPY',
    companyName: 'S&P 500 Benchmark',
    category: 'MACRO',
    sentiment: 'BULLISH',
    impact: 'HIGH',
    timestamp: '1h ago',
    source: 'Federal Reserve Policy Statement'
  },
  {
    id: 'news-pltr-aip-contracts',
    headline: 'Palantir Secures Multi-Year Enterprise AI Contracts Following S&P 500 Benchmark Inflow',
    summary: 'Commercial AIP bootcamps converted dozens of Fortune 500 enterprises into multi-million dollar annual recurring contracts, while index funds completed mandated balance sheet accumulation.',
    educationalTakeaway: 'When a stock joins the S&P 500, mutual funds and passive ETFs are legally required to buy shares regardless of price. Combined with accelerating commercial software margins, institutional accumulation drives sustained upward momentum.',
    ticker: 'PLTR',
    companyName: 'Palantir Technologies Inc.',
    category: 'EARNINGS',
    sentiment: 'BULLISH',
    impact: 'HIGH',
    timestamp: '2h ago',
    source: 'SEC Form 8-K Filing Analysis'
  },
  {
    id: 'news-aapl-intelligence',
    headline: 'Apple Expands Intelligence Features Across Global Locales, Boosting Upgrade Cycle',
    summary: 'Carrier promotions and new AI capabilities in iOS accelerated iPhone replacement rates across North America and Asia, increasing high-margin Services revenue from subscriptions.',
    educationalTakeaway: 'Hardware sales generate immediate revenue, but higher device active installations expand Apple\'s Services segment (App Store, iCloud, Apple Pay), which carries 74% gross margins and provides recurring cash flow stability.',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    category: 'TECH',
    sentiment: 'BULLISH',
    impact: 'MEDIUM',
    timestamp: '3h ago',
    source: 'Apple Investor Relations Brief'
  },
  {
    id: 'news-tsla-fsd-reg',
    headline: 'Tesla Submits Autonomous Ride-Hailing Regulatory Applications Across Southwestern States',
    summary: 'State transportation departments confirmed receipt of initial permitting filings for unsupervised vehicle testing ahead of targeted commercial ride-hailing pilot programs.',
    educationalTakeaway: 'Automakers trade at low price-to-earnings multiples (6-10x), whereas high-margin software & robotaxi network platforms trade at 30-50x multiples. Regulatory progress shifts investor perception from cyclical automaker to recurring software platform.',
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    category: 'REGULATION',
    sentiment: 'NEUTRAL',
    impact: 'HIGH',
    timestamp: '4h ago',
    source: 'State Regulatory Filing'
  },
  {
    id: 'news-msft-azure-cloud',
    headline: 'Microsoft Reports Cloud Revenue Acceleration Driven by Enterprise Copilot Adoptions',
    summary: 'Azure cloud infrastructure growth reaccelerated above 30% year-over-year as enterprises integrated generative AI models into everyday office productivity suites and workflows.',
    educationalTakeaway: 'Cloud infrastructure acts as a toll road for modern software. When enterprises commit to multi-year cloud consumption contracts, it creates predictable cash flow that protects the stock against general economic slowdowns.',
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    category: 'EARNINGS',
    sentiment: 'BULLISH',
    impact: 'HIGH',
    timestamp: '5h ago',
    source: 'SEC 10-Q Earnings Analysis'
  },
  {
    id: 'news-sofi-fintech',
    headline: 'SoFi Expands Technology Platform Revenue as Loan Origination Fees Diversify Business',
    summary: 'The digital banking platform reported record member additions and rising Galileo payment processing revenue, reducing reliance on personal lending interest margins.',
    educationalTakeaway: 'Banks that rely only on lending face severe headwinds when interest rates fluctuate. By converting into a technology provider for other financial apps, SoFi commands a higher tech-style valuation multiple.',
    ticker: 'SOFI',
    companyName: 'SoFi Technologies, Inc.',
    category: 'EARNINGS',
    sentiment: 'BULLISH',
    impact: 'MEDIUM',
    timestamp: '6h ago',
    source: 'Banking Sector Quarterly Report'
  },
  {
    id: 'news-googl-antitrust',
    headline: 'Department of Justice Submits Proposed Remedies in Search Monopoly Antitrust Case',
    summary: 'Government prosecutors outlined potential structural remedies including restrictions on default search exclusivity contracts and data sharing requirements.',
    educationalTakeaway: 'Regulatory overhang creates valuation discounts. Even if actual breakups or fines take years to resolve in appeals, headline risk can depress the price-to-earnings (P/E) multiple until legal uncertainty is settled.',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    category: 'REGULATION',
    sentiment: 'BEARISH',
    impact: 'HIGH',
    timestamp: '7h ago',
    source: 'DOJ Judicial Filing'
  },
  {
    id: 'news-rddt-ai-licensing',
    headline: 'Reddit Expands Machine Learning Data Licensing Partnerships with Global AI Labs',
    summary: 'Licensing agreements allowing large language models to train on real-time human conversation threads generated high-margin software royalties alongside double-digit ad growth.',
    educationalTakeaway: 'Pure data licensing has nearly zero incremental cost, meaning almost 90%+ of licensing revenue drops straight to operating profit, accelerating a young public company\'s path to GAAP profitability.',
    ticker: 'RDDT',
    companyName: 'Reddit, Inc.',
    category: 'TECH',
    sentiment: 'BULLISH',
    impact: 'MEDIUM',
    timestamp: '8h ago',
    source: 'Commercial Licensing Disclosure'
  },
  {
    id: 'news-semis-asml-orders',
    headline: 'ASML Confirms High-NA EUV Tool Bookings from Global Foundries for Next-Gen 2nm Nodes',
    summary: 'Foundry orders for extreme ultraviolet lithography systems rose sequentially, verifying that chipmakers are proceeding with planned factory buildouts in the US, Taiwan, and Europe.',
    educationalTakeaway: 'ASML makes the machines that manufacture chips. Rising tool orders are a reliable leading indicator: when chip manufacturers buy expensive lithography machines, it signals they expect massive semiconductor demand 18 to 24 months in advance.',
    ticker: 'ASML',
    companyName: 'ASML Holding N.V.',
    category: 'TECH',
    sentiment: 'BULLISH',
    impact: 'MEDIUM',
    timestamp: '10h ago',
    source: 'Semiconductor Equipment Digest'
  }
];

class NewsService {
  private articles: NewsArticle[] = INITIAL_ARTICLES;

  public getAllArticles(): NewsArticle[] {
    return this.articles;
  }

  public getMarketPulse(): MarketPulse {
    return {
      sentiment: 'Cautious Optimism (Greed)',
      sentimentScore: 64,
      keyThemes: [
        'AI Infrastructure Capex Expansion',
        'Fed Pivot & Rate Cut Trajectory',
        'Corporate Margin Resilience'
      ],
      fedWatchStatus: '78% likelihood of 25 bps rate adjustment'
    };
  }

  /**
   * Filter articles by category or user's tracked tickers (portfolio + watchlist)
   */
  public getArticlesByFilter(
    category: 'ALL' | 'MY_STOCKS' | 'EARNINGS' | 'MACRO' | 'TECH' | 'REGULATION',
    userTrackedTickers: string[] = []
  ): NewsArticle[] {
    const cleanTracked = new Set(userTrackedTickers.map(t => t.toUpperCase()));

    if (category === 'MY_STOCKS') {
      if (cleanTracked.size === 0) return [];
      return this.articles.filter(a => a.ticker && cleanTracked.has(a.ticker.toUpperCase()));
    }

    if (category === 'ALL') {
      return this.articles;
    }

    return this.articles.filter(a => a.category === category);
  }

  public getArticlesForStock(ticker: string): NewsArticle[] {
    const clean = ticker.toUpperCase();
    return this.articles.filter(a => a.ticker && a.ticker.toUpperCase() === clean);
  }
}

export const newsService = new NewsService();
