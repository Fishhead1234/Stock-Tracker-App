export interface GlobalMarket {
  id: string;
  labelKey: string;
  defaultLabel: string;
  country: string;
  countryCode: string;
  flag: string;
  exchange: string;
  tickers: string[];
  descriptionKey: string;
  defaultDescription: string;
}

export const GLOBAL_MARKETS: GlobalMarket[] = [
  {
    id: 'us',
    labelKey: 'market_us_label',
    defaultLabel: 'US Mega-Cap & Index ETFs',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    exchange: 'NYSE / NASDAQ',
    tickers: ['NVDA', 'AAPL', 'SPY', 'MSFT'],
    descriptionKey: 'market_us_desc',
    defaultDescription: 'S&P 500 benchmark ETFs and global tech giants.'
  },
  {
    id: 'tw',
    labelKey: 'market_tw_label',
    defaultLabel: 'Taiwan (TWSE) Semiconductor & Tech',
    country: 'Taiwan',
    countryCode: 'TW',
    flag: '🇹🇼',
    exchange: 'TWSE',
    tickers: ['2330.TW', '2454.TW', '0050.TW'],
    descriptionKey: 'market_tw_desc',
    defaultDescription: 'TSMC, MediaTek, and Taiwan top 50 index.'
  },
  {
    id: 'kr',
    labelKey: 'market_kr_label',
    defaultLabel: 'Korea (KRX) KOSPI Semiconductor & Auto',
    country: 'South Korea',
    countryCode: 'KR',
    flag: '🇰🇷',
    exchange: 'KRX',
    tickers: ['005930.KS', '000660.KS', '005380.KS'],
    descriptionKey: 'market_kr_desc',
    defaultDescription: 'Samsung Electronics, SK Hynix, and Hyundai Motor.'
  },
  {
    id: 'uk',
    labelKey: 'market_uk_label',
    defaultLabel: 'UK (LSE) & European Leaders',
    country: 'United Kingdom',
    countryCode: 'UK',
    flag: '🇬🇧',
    exchange: 'LSE',
    tickers: ['AZN.L', 'SHEL.L', 'HSBA.L'],
    descriptionKey: 'market_uk_desc',
    defaultDescription: 'AstraZeneca, Shell, and HSBC global banking.'
  },
  {
    id: 'nz',
    labelKey: 'market_nz_label',
    defaultLabel: 'New Zealand (NZX) & ASX Australia',
    country: 'New Zealand / AU',
    countryCode: 'NZ',
    flag: '🇳🇿',
    exchange: 'NZX / ASX',
    tickers: ['FPH.NZ', 'AIR.NZ', 'BHP.AX'],
    descriptionKey: 'market_nz_desc',
    defaultDescription: 'Fisher & Paykel Healthcare, Air New Zealand, and BHP Group.'
  },
  {
    id: 'jp',
    labelKey: 'market_jp_label',
    defaultLabel: 'Japan (TSE) Automotive & Tech Conglomerates',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    exchange: 'TSE',
    tickers: ['7203.T', '6758.T', '9984.T'],
    descriptionKey: 'market_jp_desc',
    defaultDescription: 'Toyota Motor, Sony Group, and SoftBank Group.'
  },
  {
    id: 'in',
    labelKey: 'market_in_label',
    defaultLabel: 'India (NSE) Tech, Banking & Energy Giants',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    exchange: 'NSE',
    tickers: ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'],
    descriptionKey: 'market_in_desc',
    defaultDescription: 'Reliance Industries, Tata Consultancy Services, and HDFC Bank.'
  },
  {
    id: 'hk',
    labelKey: 'market_hk_label',
    defaultLabel: 'Hong Kong (HKEX) Tech & Consumer Giants',
    country: 'Hong Kong',
    countryCode: 'HK',
    flag: '🇭🇰',
    exchange: 'HKEX',
    tickers: ['0700.HK', '9988.HK', '3690.HK', '1810.HK'],
    descriptionKey: 'market_hk_desc',
    defaultDescription: 'Tencent Holdings, Alibaba, Meituan, and Xiaomi Corporation.'
  },
  {
    id: 'cn',
    labelKey: 'market_cn_label',
    defaultLabel: 'China (SSE / SZSE) A-Shares & Clean-Tech',
    country: 'China',
    countryCode: 'CN',
    flag: '🇨🇳',
    exchange: 'SSE / SZSE',
    tickers: ['600519.SS', '300750.SZ', '601318.SS', '002594.SZ'],
    descriptionKey: 'market_cn_desc',
    defaultDescription: 'Kweichow Moutai, CATL (EV Battery Leader), and Ping An Insurance.'
  }
];
