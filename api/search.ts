export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const q = req.query.q || req.query.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://finance.yahoo.com/'
    };

    let response = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&newsCount=0`, { headers });
    
    // Fallback to query2 if query1 fails
    if (!response.ok) {
      response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&newsCount=0`, { headers });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Financial search gateway error' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal gateway error' });
  }
}
