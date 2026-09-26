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
  }
];
