export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const symbol = req.query.symbol || req.query.ticker || req.query.s;
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const cleanSymbol = symbol.trim().toUpperCase();
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://finance.yahoo.com/'
    };

    let response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cleanSymbol)}?interval=1d&range=1mo`, { headers });
    
    // Fallback to query2 if query1 fails
    if (!response.ok) {
      response = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cleanSymbol)}?interval=1d&range=1mo`, { headers });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Financial quote gateway error' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal gateway error' });
  }
}
