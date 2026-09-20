export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ 
      error: 'FINNHUB_API_KEY is not configured on Vercel environment variables',
      configured: false 
    });
  }

  const action = req.query.action || 'quote';
  const symbol = req.query.symbol || req.query.ticker || 'AAPL';
  const cleanSymbol = typeof symbol === 'string' ? symbol.trim().toUpperCase() : 'AAPL';

  try {
    let url = '';
    if (action === 'quote') {
      url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cleanSymbol)}&token=${apiKey}`;
    } else if (action === 'profile') {
      url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(cleanSymbol)}&token=${apiKey}`;
    } else if (action === 'news') {
      url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
    } else if (action === 'search') {
      const q = req.query.q || cleanSymbol;
      url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${apiKey}`;
    } else {
      url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cleanSymbol)}&token=${apiKey}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Finnhub gateway responded with ${response.status}` });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    return res.status(200).json({
      success: true,
      configured: true,
      data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Finnhub gateway error' });
  }
}
