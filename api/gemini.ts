export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { prompt, messages, stockContext, customApiKey, model = 'gemini-2.5-flash' } = req.body || {};

  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(400).json({
      error: 'NO_API_KEY',
      message: 'No Gemini API key provided. Please configure a key in Settings or contact the administrator.'
    });
  }

  const systemPrompt = `You are the InvestLearn AI Market Tutor, a friendly, patient, and knowledgeable educational assistant for beginner stock market investors.
Your mission is to demystify investing: explain stock charts, translate technical indicators (RSI, MACD, Moving Averages) into plain English using real-world analogies, explain news catalysts, and teach risk management.

CRITICAL COMPLIANCE AND SAFETY RULES:
1. STRICTLY EDUCATIONAL: You are NOT a licensed financial advisor. You MUST NOT give direct buy, sell, or hold recommendations (never say "You should buy this stock now").
2. SCENARIO ANALYSIS: Always balance perspectives into Bullish Scenarios (what positive momentum looks like) vs. Bearish Risks (what could go wrong).
3. TEACH CONCEPTS: Explain *why* an indicator behaves the way it does (e.g., RSI over 70 is like a stretched rubber band, MACD crossovers show shifts in acceleration).
4. EMPHASIZE PRUDENCE: Mention Dollar-Cost Averaging (DCA), diversification, position sizing, and never investing money one cannot afford to lose.
5. FORMATTING: Use clean markdown with clear bullet points, bold highlights, and short paragraphs suitable for mobile reading.`;

  // Build conversational contents array
  const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Context injection for the current stock
  let contextPrefix = '';
  if (stockContext) {
    contextPrefix = `[LIVE STOCK DATA & CONTEXT]
Company: ${stockContext.name || ''} (${stockContext.ticker || ''})
Exchange: ${stockContext.exchange || ''} | Country: ${stockContext.country || ''}
Current Price: ${stockContext.currencySymbol || '$'}${stockContext.price ?? 'N/A'} (Day Change: ${stockContext.changePercent ?? 0}%)
Day Range: ${stockContext.currencySymbol || '$'}${stockContext.low ?? 'N/A'} - ${stockContext.currencySymbol || '$'}${stockContext.high ?? 'N/A'}
Valuation: Market Cap: ${stockContext.marketCap || 'N/A'} | P/E: ${stockContext.peRatio ? stockContext.peRatio + 'x' : 'N/A'}
Technical Indicators:
- RSI (14): ${stockContext.indicators?.rsi ?? 'N/A'}
- MACD Line: ${stockContext.indicators?.macd?.macdLine ?? 'N/A'}, Signal: ${stockContext.indicators?.macd?.signalLine ?? 'N/A'}, Crossover: ${stockContext.indicators?.macd?.crossover ?? 'N/A'}
- 20-Day SMA: ${stockContext.indicators?.sma20 ?? 'N/A'}, 50-Day SMA: ${stockContext.indicators?.sma50 ?? 'N/A'}, 200-Day SMA: ${stockContext.indicators?.sma200 ?? 'N/A'}
- Volume Surge: ${stockContext.indicators?.volumeSurgeRatio ? stockContext.indicators.volumeSurgeRatio.toFixed(2) + 'x avg' : 'Normal'}
Active System Timing Signal: ${stockContext.signal?.type || 'Neutral'} (Action: ${stockContext.signal?.action || 'HOLD'}, Risk: ${stockContext.signal?.riskLevel || 'Moderate'})
${stockContext.newsHeadlines && stockContext.newsHeadlines.length > 0 ? `Recent News Catalysts:\n${stockContext.newsHeadlines.map((h: string) => '- ' + h).join('\n')}` : ''}
${stockContext.userPosition ? `User's Portfolio: Owns ${stockContext.userPosition.shares} shares @ avg cost ${stockContext.currencySymbol || '$'}${stockContext.userPosition.avgPrice}` : 'User does not currently hold shares in portfolio.'}
[END CONTEXT]\n\n`;
  }

  if (Array.isArray(messages) && messages.length > 0) {
    messages.forEach((msg: { role: string; content: string }, index: number) => {
      const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
      let text = msg.content || '';
      // Prepend context to the first user message if present
      if (index === 0 && role === 'user' && contextPrefix) {
        text = contextPrefix + text;
      }
      formattedContents.push({
        role,
        parts: [{ text }]
      });
    });
  } else if (prompt) {
    formattedContents.push({
      role: 'user',
      parts: [{ text: contextPrefix + prompt }]
    });
  } else {
    return res.status(400).json({ error: 'Missing prompt or messages in request body.' });
  }

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: formattedContents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1200,
      topP: 0.95
    }
  };

  const targetModel = model.trim() || 'gemini-2.5-flash';

  try {
    let googleRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    // If target model returns 404 (not yet enabled in region/account), fallback to gemini-2.5-flash-lite or gemini-3.8-flash
    if (googleRes.status === 404 && targetModel !== 'gemini-3.8-flash') {
      console.warn(`Model ${targetModel} returned 404, falling back to gemini-3.8-flash`);
      googleRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
    }

    if (!googleRes.ok) {
      const errorText = await googleRes.text();
      let parsedErr: any = null;
      try {
        parsedErr = JSON.parse(errorText);
      } catch (e) {
        // raw text
      }
      const errMessage = parsedErr?.error?.message || `Google API error (${googleRes.status})`;
      return res.status(googleRes.status).json({
        error: 'GOOGLE_API_ERROR',
        status: googleRes.status,
        message: errMessage
      });
    }

    const data = await googleRes.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({
      text: candidateText,
      model: targetModel,
      usage: data?.usageMetadata
    });
  } catch (error: any) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: error.message || 'Internal error contacting Gemini service'
    });
  }
}
