export interface DirectoryStockItem {
  ticker: string;
  name: string;
  exchange: string;
  country: string;
  countryCode: 'US' | 'TW' | 'KR' | 'UK' | 'NZ' | 'AU' | 'JP';
  currency: string;
  currencySymbol: string;
  basePrice: number;
  sector: string;
  marketCap?: string;
  peRatio?: number;
}

export const STOCK_DIRECTORY: DirectoryStockItem[] = [
  // --- US MEGA TECH & MAGNIFICENT 7 ---
  { ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 222.27, sector: 'Technology & AI', marketCap: '$5.4T', peRatio: 52.0 },
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 336.13, sector: 'Consumer Technology', marketCap: '$5.1T', peRatio: 36.5 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 493.78, sector: 'Software & Cloud', marketCap: '$3.7T', peRatio: 36.2 },
  { ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 364.27, sector: 'Automotive & Clean Energy', marketCap: '$1.1T', peRatio: 88.0 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 253.71, sector: 'E-Commerce & AWS Cloud', marketCap: '$2.6T', peRatio: 44.0 },
  { ticker: 'GOOGL', name: 'Alphabet Inc. (Class A)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 349.54, sector: 'Search & Generative AI', marketCap: '$2.4T', peRatio: 24.8 },
  { ticker: 'GOOG', name: 'Alphabet Inc. (Class C)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 351.20, sector: 'Search & Generative AI', marketCap: '$2.4T', peRatio: 24.8 },
  { ticker: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 665.75, sector: 'Social Media & AI', marketCap: '$1.7T', peRatio: 27.5 },

  // --- AI, BIG DATA & SEMICONDUCTORS ---
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 177.64, sector: 'Enterprise AI & Big Data', marketCap: '$390B', peRatio: 115.0 },
  { ticker: 'AMD', name: 'Advanced Micro Devices, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 559.82, sector: 'Semiconductors & AI', marketCap: '$900B', peRatio: 120.0 },
  { ticker: 'AVGO', name: 'Broadcom Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 357.61, sector: 'AI Silicon & Infrastructure', marketCap: '$1.6T', peRatio: 58.0 },
  { ticker: 'ARM', name: 'Arm Holdings plc', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 275.61, sector: 'Semiconductor IP & Architecture', marketCap: '$285B', peRatio: 140.0 },
  { ticker: 'TSM', name: 'Taiwan Semiconductor (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 248.50, sector: 'Advanced Semiconductor Foundry', marketCap: '$1.2T', peRatio: 30.0 },
  { ticker: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 28.90, sector: 'Foundry & Microprocessors', marketCap: '$130B', peRatio: 45.0 },
  { ticker: 'QCOM', name: 'Qualcomm Incorporated', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 195.40, sector: 'Mobile Chips & Wireless', marketCap: '$215B', peRatio: 21.0 },
  { ticker: 'MU', name: 'Micron Technology, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 135.80, sector: 'HBM & Memory Solutions', marketCap: '$150B', peRatio: 32.0 },
  { ticker: 'SMCI', name: 'Super Micro Computer, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 39.09, sector: 'AI Server Infrastructure', marketCap: '$22B', peRatio: 15.0 },
  { ticker: 'ASML', name: 'ASML Holding N.V.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 785.40, sector: 'EUV Lithography Systems', marketCap: '$310B', peRatio: 38.0 },
  { ticker: 'AMAT', name: 'Applied Materials, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 212.30, sector: 'Semiconductor Equipment', marketCap: '$175B', peRatio: 25.0 },
  { ticker: 'LRCX', name: 'Lam Research Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 89.40, sector: 'Wafer Fab Equipment', marketCap: '$116B', peRatio: 26.0 },
  { ticker: 'KLAC', name: 'KLA Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 720.50, sector: 'Process Control & Inspection', marketCap: '$96B', peRatio: 29.0 },
  { ticker: 'MRVL', name: 'Marvell Technology, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 94.20, sector: 'Data Center Custom Silicon', marketCap: '$81B', peRatio: 48.0 },
  { ticker: 'DELL', name: 'Dell Technologies Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 142.10, sector: 'AI Servers & Hardware', marketCap: '$98B', peRatio: 22.0 },
  { ticker: 'HPE', name: 'Hewlett Packard Enterprise', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 22.80, sector: 'Enterprise Hybrid Cloud', marketCap: '$30B', peRatio: 14.0 },

  // --- POPULAR RETAIL, GROWTH & MEME STOCKS ---
  { ticker: 'SOFI', name: 'SoFi Technologies, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 16.96, sector: 'Digital Banking & Fintech', marketCap: '$18.5B', peRatio: 42.0 },
  { ticker: 'HOOD', name: 'Robinhood Markets, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 119.82, sector: 'Retail Trading & Crypto', marketCap: '$105B', peRatio: 55.0 },
  { ticker: 'COIN', name: 'Coinbase Global, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 194.25, sector: 'Crypto Exchange & Web3', marketCap: '$48B', peRatio: 36.0 },
  { ticker: 'MSTR', name: 'MicroStrategy Incorporated', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 153.92, sector: 'Enterprise Analytics & Bitcoin', marketCap: '$38B', peRatio: 65.0 },
  { ticker: 'RDDT', name: 'Reddit, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 150.85, sector: 'Social Media & AI Licensing', marketCap: '$26B', peRatio: 75.0 },
  { ticker: 'DJT', name: 'Trump Media & Technology Group', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 8.85, sector: 'Digital Media & Streaming', marketCap: '$1.8B', peRatio: -12.0 },
  { ticker: 'ASTS', name: 'AST SpaceMobile, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 58.52, sector: 'Space-Based Cellular Broadband', marketCap: '$16B', peRatio: -18.0 },
  { ticker: 'GME', name: 'GameStop Corp.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 22.64, sector: 'Gaming & Collectibles', marketCap: '$9.6B', peRatio: 120.0 },
  { ticker: 'AMC', name: 'AMC Entertainment Holdings', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 4.25, sector: 'Theatrical Exhibition', marketCap: '$1.6B', peRatio: -3.0 },
  { ticker: 'PLUG', name: 'Plug Power Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 2.35, sector: 'Hydrogen Fuel Cells', marketCap: '$2.1B', peRatio: -2.8 },
  { ticker: 'RIVN', name: 'Rivian Automotive, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 14.50, sector: 'Electric Vehicles', marketCap: '$14.8B', peRatio: -4.5 },
  { ticker: 'LCID', name: 'Lucid Group, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 3.10, sector: 'Luxury Electric Vehicles', marketCap: '$7.5B', peRatio: -3.2 },
  { ticker: 'NIO', name: 'NIO Inc. (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 5.90, sector: 'Smart Electric Vehicles', marketCap: '$12.2B', peRatio: -4.0 },
  { ticker: 'XPEV', name: 'XPeng Inc. (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 12.80, sector: 'Smart AI Mobility', marketCap: '$12.0B', peRatio: -7.0 },
  { ticker: 'LI', name: 'Li Auto Inc. (ADR)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 24.50, sector: 'Extended-Range EVs', marketCap: '$25.0B', peRatio: 19.0 },
  { ticker: 'SOUN', name: 'SoundHound AI, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 8.45, sector: 'Voice & Conversational AI', marketCap: '$3.2B', peRatio: -25.0 },
  { ticker: 'BBAI', name: 'BigBear.ai Holdings, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 3.80, sector: 'Mission-Critical Defense AI', marketCap: '$950M', peRatio: -8.0 },
  { ticker: 'AI', name: 'C3.ai, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 32.10, sector: 'Enterprise Generative AI', marketCap: '$4.1B', peRatio: -15.0 },
  { ticker: 'IONQ', name: 'IonQ, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 28.40, sector: 'Quantum Computing Hardware', marketCap: '$6.5B', peRatio: -35.0 },
  { ticker: 'RGTI', name: 'Rigetti Computing, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 2.15, sector: 'Superconducting Quantum', marketCap: '$450M', peRatio: -5.0 },
  { ticker: 'QBTS', name: 'D-Wave Quantum Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 2.40, sector: 'Commercial Quantum Annealing', marketCap: '$520M', peRatio: -6.0 },

  // --- BITCOIN & CRYPTO MINERS ---
  { ticker: 'MARA', name: 'MARA Holdings, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 21.80, sector: 'Digital Asset Compute', marketCap: '$6.8B', peRatio: 22.0 },
  { ticker: 'RIOT', name: 'Riot Platforms, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 12.40, sector: 'Bitcoin Mining Infrastructure', marketCap: '$3.8B', peRatio: 18.0 },
  { ticker: 'CLSK', name: 'CleanSpark, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 14.90, sector: 'Sustainable Bitcoin Mining', marketCap: '$3.6B', peRatio: 16.0 },
  { ticker: 'BITF', name: 'Bitfarms Ltd.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 2.65, sector: 'Global Data Centers & Mining', marketCap: '$1.2B', peRatio: 14.0 },
  { ticker: 'IREN', name: 'IREN Limited', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 11.20, sector: 'Next-Gen Data Centers & AI', marketCap: '$2.1B', peRatio: 15.0 },
  { ticker: 'WULF', name: 'TeraWulf Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 6.80, sector: 'Zero-Carbon Energy & Computing', marketCap: '$2.6B', peRatio: -12.0 },
  { ticker: 'CIFR', name: 'Cipher Mining Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 5.40, sector: 'Industrial Bitcoin Mining', marketCap: '$1.7B', peRatio: 19.0 },

  // --- SOFTWARE, CLOUD & CYBERSECURITY ---
  { ticker: 'CRWD', name: 'CrowdStrike Holdings, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 382.40, sector: 'Endpoint AI Cybersecurity', marketCap: '$93B', peRatio: 85.0 },
  { ticker: 'PANW', name: 'Palo Alto Networks, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 395.20, sector: 'Enterprise Network Security', marketCap: '$128B', peRatio: 52.0 },
  { ticker: 'FTNT', name: 'Fortinet, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 94.60, sector: 'SecOps & Firewalls', marketCap: '$72B', peRatio: 44.0 },
  { ticker: 'NET', name: 'Cloudflare, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 118.50, sector: 'Edge Cloud & Web Security', marketCap: '$40B', peRatio: 98.0 },
  { ticker: 'DDOG', name: 'Datadog, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 145.20, sector: 'Cloud Observability & Security', marketCap: '$49B', peRatio: 72.0 },
  { ticker: 'ZS', name: 'Zscaler, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 205.10, sector: 'Zero Trust Cloud Architecture', marketCap: '$31B', peRatio: 68.0 },
  { ticker: 'SNOW', name: 'Snowflake Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 168.30, sector: 'Data Cloud & AI Warehousing', marketCap: '$57B', peRatio: -38.0 },
  { ticker: 'ORCL', name: 'Oracle Corporation', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 188.40, sector: 'Database Systems & AI Cloud', marketCap: '$520B', peRatio: 40.0 },
  { ticker: 'CRM', name: 'Salesforce, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 342.10, sector: 'Agentforce & CRM Cloud', marketCap: '$330B', peRatio: 56.0 },
  { ticker: 'ADBE', name: 'Adobe Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 512.40, sector: 'Creative Cloud & Firefly AI', marketCap: '$230B', peRatio: 41.0 },
  { ticker: 'NOW', name: 'ServiceNow, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 1045.00, sector: 'Enterprise AI Workflows', marketCap: '$215B', peRatio: 78.0 },
  { ticker: 'APP', name: 'AppLovin Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 325.40, sector: 'AI Marketing & Software', marketCap: '$110B', peRatio: 62.0 },
  { ticker: 'SHOP', name: 'Shopify Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 112.50, sector: 'Global E-Commerce Engine', marketCap: '$145B', peRatio: 74.0 },
  { ticker: 'SPOT', name: 'Spotify Technology S.A.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 485.60, sector: 'Audio Streaming & Podcasts', marketCap: '$98B', peRatio: 70.0 },
  { ticker: 'UBER', name: 'Uber Technologies, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 84.50, sector: 'Autonomous Mobility & Delivery', marketCap: '$178B', peRatio: 38.0 },
  { ticker: 'ABNB', name: 'Airbnb, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 142.30, sector: 'Global Travel Marketplace', marketCap: '$90B', peRatio: 32.0 },

  // --- CONSUMER & RETAIL INNOVATION ---
  { ticker: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 94.20, sector: 'Omnichannel Retail & Grocery', marketCap: '$760B', peRatio: 35.0 },
  { ticker: 'COST', name: 'Costco Wholesale Corp.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 998.50, sector: 'Membership Warehouse Club', marketCap: '$442B', peRatio: 56.0 },
  { ticker: 'TGT', name: 'Target Corporation', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 138.40, sector: 'General Merchandise Retail', marketCap: '$64B', peRatio: 16.0 },
  { ticker: 'CAVA', name: 'CAVA Group, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 148.90, sector: 'Fast-Casual Mediterranean', marketCap: '$17B', peRatio: 130.0 },
  { ticker: 'CELH', name: 'Celsius Holdings, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 34.50, sector: 'Functional Fitness Energy', marketCap: '$8.2B', peRatio: 34.0 },
  { ticker: 'DUOL', name: 'Duolingo, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 342.50, sector: 'Gamified AI Education', marketCap: '$15B', peRatio: 90.0 },
  { ticker: 'ELF', name: 'e.l.f. Beauty, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 132.40, sector: 'Clean Cosmetics & Beauty', marketCap: '$7.4B', peRatio: 42.0 },
  { ticker: 'HIMS', name: 'Hims & Hers Health, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 28.50, sector: 'Telehealth & Personalized Care', marketCap: '$6.2B', peRatio: 48.0 },
  { ticker: 'NKE', name: 'NIKE, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 84.10, sector: 'Athletic Footwear & Apparel', marketCap: '$126B', peRatio: 26.0 },
  { ticker: 'LULU', name: 'Lululemon Athletica Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 388.20, sector: 'Technical Athletic Apparel', marketCap: '$48B', peRatio: 28.0 },
  { ticker: 'SBUX', name: 'Starbucks Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 102.50, sector: 'Specialty Coffee & Roasteries', marketCap: '$116B', peRatio: 29.0 },
  { ticker: 'MCD', name: "McDonald's Corporation", exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 298.40, sector: 'Global Quick Service Restaurants', marketCap: '$214B', peRatio: 25.0 },
  { ticker: 'CMG', name: 'Chipotle Mexican Grill', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 62.40, sector: 'Fast-Casual Dining', marketCap: '$85B', peRatio: 52.0 },
  { ticker: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 114.80, sector: 'Entertainment, Parks & Disney+', marketCap: '$208B', peRatio: 28.0 },
  { ticker: 'NFLX', name: 'Netflix, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 915.00, sector: 'Streaming Entertainment & Ads', marketCap: '$395B', peRatio: 46.0 },

  // --- HEALTHCARE & BIOPHARMA GIANTS ---
  { ticker: 'LLY', name: 'Eli Lilly and Company', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 842.50, sector: 'Metabolic & Weight Loss Care', marketCap: '$800B', peRatio: 64.0 },
  { ticker: 'NVO', name: 'Novo Nordisk A/S (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 112.40, sector: 'Diabetes & GLP-1 Therapies', marketCap: '$505B', peRatio: 36.0 },
  { ticker: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 156.20, sector: 'Pharmaceuticals & MedTech', marketCap: '$375B', peRatio: 24.0 },
  { ticker: 'ABBV', name: 'AbbVie Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 188.50, sector: 'Immunology & Oncology', marketCap: '$332B', peRatio: 18.0 },
  { ticker: 'MRK', name: 'Merck & Co., Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 104.20, sector: 'Keytruda & Therapeutics', marketCap: '$264B', peRatio: 17.0 },
  { ticker: 'UNH', name: 'UnitedHealth Group Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 582.40, sector: 'Managed Healthcare & Optum', marketCap: '$535B', peRatio: 28.0 },
  { ticker: 'ISRG', name: 'Intuitive Surgical, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 535.80, sector: 'Da Vinci Robotic Surgery', marketCap: '$190B', peRatio: 78.0 },

  // --- WALL STREET FINANCIALS & BANKING ---
  { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc. (Class B)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 472.50, sector: 'Insurance & Diverse Holdings', marketCap: '$1.0T', peRatio: 21.0 },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 245.80, sector: 'Global Investment & Commercial Bank', marketCap: '$698B', peRatio: 14.0 },
  { ticker: 'BAC', name: 'Bank of America Corp.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 46.20, sector: 'Retail & Consumer Banking', marketCap: '$360B', peRatio: 13.5 },
  { ticker: 'GS', name: 'The Goldman Sachs Group, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 585.00, sector: 'Global Trading & Mergers', marketCap: '$190B', peRatio: 17.0 },
  { ticker: 'MS', name: 'Morgan Stanley', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 124.50, sector: 'Wealth Management & Capital', marketCap: '$200B', peRatio: 18.0 },
  { ticker: 'V', name: 'Visa Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 325.40, sector: 'Global Payments Network', marketCap: '$665B', peRatio: 32.0 },
  { ticker: 'MA', name: 'Mastercard Incorporated', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 538.20, sector: 'Digital Transaction Technology', marketCap: '$500B', peRatio: 36.0 },

  // --- MAJOR BENCHMARK & SECTOR ETFS ---
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 761.69, sector: 'US Large-Cap Benchmark', marketCap: '$640B', peRatio: 26.5 },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 721.45, sector: 'Top 100 Tech Leaders', marketCap: '$325B', peRatio: 32.0 },
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 698.40, sector: 'Low-Cost S&P 500 Index', marketCap: '$540B', peRatio: 26.5 },
  { ticker: 'IWM', name: 'iShares Russell 2000 ETF', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 228.40, sector: 'US Small-Cap Benchmark', marketCap: '$72B', peRatio: 18.5 },
  { ticker: 'DIA', name: 'SPDR Dow Jones Industrial Average', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 442.10, sector: 'Blue-Chip 30 Leaders', marketCap: '$38B', peRatio: 22.0 },
  { ticker: 'SMH', name: 'VanEck Semiconductor ETF', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 285.20, sector: 'Leading Semiconductor Index', marketCap: '$28B', peRatio: 38.0 },
  { ticker: 'SOXL', name: 'Direxion Daily Semiconductor Bull 3X', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 38.50, sector: '3x Leveraged Semiconductor', marketCap: '$12B', peRatio: 0 },
  { ticker: 'TQQQ', name: 'ProShares UltraPro QQQ (3x)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 88.40, sector: '3x Leveraged Nasdaq 100', marketCap: '$24B', peRatio: 0 },
  { ticker: 'SQQQ', name: 'ProShares UltraPro Short QQQ (-3x)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 6.85, sector: '-3x Inverse Nasdaq 100', marketCap: '$4.2B', peRatio: 0 },
  { ticker: 'XLF', name: 'Financial Select Sector SPDR', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 48.90, sector: 'US Financial Sector', marketCap: '$45B', peRatio: 16.0 },
  { ticker: 'XLE', name: 'Energy Select Sector SPDR', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 91.20, sector: 'US Oil & Gas Energy', marketCap: '$38B', peRatio: 12.0 },

  // --- TAIWAN (TWSE) ---
  { ticker: '2330.TW', name: 'Taiwan Semiconductor (TSMC)', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 1045.00, sector: 'Semiconductor Foundry', marketCap: 'NT$27.1T', peRatio: 28.5 },
  { ticker: '2317.TW', name: 'Hon Hai Precision (Foxconn)', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 212.50, sector: 'Electronics & AI Servers', marketCap: 'NT$2.94T', peRatio: 17.0 },
  { ticker: '2454.TW', name: 'MediaTek Inc.', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 1320.00, sector: 'Mobile SoC & AI Silicon', marketCap: 'NT$2.11T', peRatio: 22.0 },
  { ticker: '0050.TW', name: 'Yuanta Taiwan Top 50 ETF', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 198.50, sector: 'Taiwan Benchmark ETF', marketCap: 'NT$440B', peRatio: 25.0 },
  { ticker: '2881.TW', name: 'Fubon Financial Holding', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 91.80, sector: 'Financial Banking & Life', marketCap: 'NT$1.22T', peRatio: 11.0 },
  { ticker: '2382.TW', name: 'Quanta Computer Inc.', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 318.00, sector: 'AI Server & Cloud ODM', marketCap: 'NT$1.23T', peRatio: 21.0 },

  // --- SOUTH KOREA (KRX / KOSPI) ---
  { ticker: '005930.KS', name: 'Samsung Electronics', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 58400, sector: 'Semiconductor & Displays', marketCap: '₩390T', peRatio: 13.5 },
  { ticker: '000660.KS', name: 'SK Hynix', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 198000, sector: 'HBM3e Memory Leader', marketCap: '₩144T', peRatio: 18.0 },
  { ticker: '373220.KS', name: 'LG Energy Solution', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 412000, sector: 'EV Lithium Batteries', marketCap: '₩96T', peRatio: 54.0 },
  { ticker: '005380.KS', name: 'Hyundai Motor', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 245000, sector: 'Global Automotive & Robotics', marketCap: '₩51T', peRatio: 5.8 },
  { ticker: '035420.KS', name: 'NAVER Corporation', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 178500, sector: 'Search, E-Commerce & AI', marketCap: '₩29T', peRatio: 24.0 },

  // --- JAPAN (TSE) ---
  { ticker: '7203.T', name: 'Toyota Motor Corp.', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 2850, sector: 'Global Automotive & Hybrids', marketCap: '¥45T', peRatio: 10.2 },
  { ticker: '6758.T', name: 'Sony Group Corporation', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 14800, sector: 'PlayStation, CMOS & Music', marketCap: '¥18.5T', peRatio: 18.0 },
  { ticker: '9984.T', name: 'SoftBank Group Corp.', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 9450, sector: 'AI Investment & Arm Holdings', marketCap: '¥13.8T', peRatio: 36.0 },
  { ticker: '8035.T', name: 'Tokyo Electron Limited', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 24600, sector: 'Semiconductor Fabrication Tools', marketCap: '¥11.6T', peRatio: 26.0 },
  { ticker: '7974.T', name: 'Nintendo Co., Ltd.', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 8400, sector: 'Gaming Consoles & Franchises', marketCap: '¥9.8T', peRatio: 24.0 },

  // --- UNITED KINGDOM (LSE) ---
  { ticker: 'AZN.L', name: 'AstraZeneca plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 118.50, sector: 'Biopharmaceuticals & Oncology', marketCap: '£184B', peRatio: 35.0 },
  { ticker: 'SHEL.L', name: 'Shell plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 26.40, sector: 'Integrated Energy & LNG', marketCap: '£168B', peRatio: 11.5 },
  { ticker: 'HSBA.L', name: 'HSBC Holdings plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 7.15, sector: 'Global Banking & Wealth', marketCap: '£132B', peRatio: 7.5 },
  { ticker: 'ULVR.L', name: 'Unilever plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 47.80, sector: 'Consumer Packaged Goods', marketCap: '£119B', peRatio: 20.5 },
  { ticker: 'BP.L', name: 'BP p.l.c.', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 3.92, sector: 'Oil, Gas & Biofuels', marketCap: '£64B', peRatio: 9.8 },

  // --- AUSTRALIA (ASX) ---
  { ticker: 'BHP.AX', name: 'BHP Group Limited', exchange: 'ASX', country: 'Australia', countryCode: 'AU', currency: 'AUD', currencySymbol: 'A$', basePrice: 42.10, sector: 'Iron Ore & Copper Mining', marketCap: 'A$214B', peRatio: 12.0 },
  { ticker: 'CBA.AX', name: 'Commonwealth Bank of Australia', exchange: 'ASX', country: 'Australia', countryCode: 'AU', currency: 'AUD', currencySymbol: 'A$', basePrice: 154.20, sector: 'Retail & Commercial Banking', marketCap: 'A$258B', peRatio: 24.5 },
  { ticker: 'CSL.AX', name: 'CSL Limited', exchange: 'ASX', country: 'Australia', countryCode: 'AU', currency: 'AUD', currencySymbol: 'A$', basePrice: 295.00, sector: 'Biotechnology & Blood Plasma', marketCap: 'A$142B', peRatio: 38.0 },
  { ticker: 'NAB.AX', name: 'National Australia Bank', exchange: 'ASX', country: 'Australia', countryCode: 'AU', currency: 'AUD', currencySymbol: 'A$', basePrice: 38.40, sector: 'Business Banking', marketCap: 'A$118B', peRatio: 16.0 },

  // --- NEW ZEALAND (NZX) ---
  { ticker: 'FPH.NZ', name: 'Fisher & Paykel Healthcare', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 37.20, sector: 'Respiratory & Sleep Apnea Devices', marketCap: 'NZ$21.5B', peRatio: 45.0 },
  { ticker: 'AIR.NZ', name: 'Air New Zealand', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 0.56, sector: 'Passenger & Cargo Aviation', marketCap: 'NZ$1.9B', peRatio: 11.5 },
  { ticker: 'SPK.NZ', name: 'Spark New Zealand', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 3.12, sector: 'Mobile, Fiber & Data Centers', marketCap: 'NZ$5.8B', peRatio: 17.5 },
  { ticker: 'MEL.NZ', name: 'Meridian Energy', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 6.20, sector: '100% Renewable Electricity', marketCap: 'NZ$16.0B', peRatio: 35.0 }
];

export const DIRECTORY_MAP = new Map<string, DirectoryStockItem>(
  STOCK_DIRECTORY.map(s => [s.ticker.toUpperCase(), s])
);
