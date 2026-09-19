import { StockQuote } from '../types/stock';
import { StockSignal, SignalAction, SignalReason } from '../types/signal';

export function generateTimingSignal(stock: StockQuote): StockSignal {
  const { price, indicators, name, ticker } = stock;
  const { rsi, macd, sma20, sma50, sma200, volumeSurgeRatio } = indicators;

  const reasons: SignalReason[] = [];
  let bullishScore = 50; // Starting baseline

  // 1. Evaluate RSI
  if (rsi <= 30) {
    bullishScore += 25;
    reasons.push({
      indicator: 'RSI',
      summary: `RSI is deeply oversold at ${rsi.toFixed(1)}`,
      detail: `The stock has dropped sharply in recent sessions. Values below 30 suggest severe selling fatigue where bargain hunters typically step in.`,
      plainEnglishAnalogy: `Like a rubber band pulled all the way back — when released, it has strong snap-back potential.`,
      bullish: true
    });
  } else if (rsi <= 45) {
    bullishScore += 10;
    reasons.push({
      indicator: 'RSI',
      summary: `RSI is moderate-low at ${rsi.toFixed(1)}`,
      detail: `Trading below the neutral 50 level, presenting a healthier risk/reward entry without chasing highs.`,
      plainEnglishAnalogy: `Like buying sneakers on a seasonal discount rather than at full retail price.`,
      bullish: true
    });
  } else if (rsi >= 75) {
    bullishScore -= 30;
    reasons.push({
      indicator: 'RSI',
      summary: `RSI is critically overbought at ${rsi.toFixed(1)}`,
      detail: `The price has surged too fast in a short period. Statistically, stocks with RSI > 75 experience sharp cooling-off periods or pullbacks.`,
      plainEnglishAnalogy: `Like a runner sprinting at top speed for 2 miles — eventually they must pause to catch their breath.`,
      bullish: false
    });
  } else if (rsi >= 65) {
    bullishScore -= 10;
    reasons.push({
      indicator: 'RSI',
      summary: `RSI is approaching hot zone at ${rsi.toFixed(1)}`,
      detail: `Entering elevated territory. New positions here have lower margin of safety.`,
      plainEnglishAnalogy: `Approaching yellow traffic light: you can proceed, but prepare to brake.`,
      bullish: false
    });
  } else {
    reasons.push({
      indicator: 'RSI',
      summary: `RSI is balanced at ${rsi.toFixed(1)}`,
      detail: `Price is in equilibrium between buyers and sellers with no extreme pressure in either direction.`,
      plainEnglishAnalogy: `Cruising comfortably in the middle lane on the highway.`,
      bullish: true
    });
  }

  // 2. Evaluate MACD
  if (macd.crossover === 'bullish' && macd.histogram > 0) {
    bullishScore += 20;
    reasons.push({
      indicator: 'MACD',
      summary: `Bullish momentum crossover confirmed`,
      detail: `The short-term moving average has crossed above the longer-term signal line. Upward momentum is accelerating.`,
      plainEnglishAnalogy: `Like a speedboat accelerating: the wake is getting bigger and forward thrust is rising.`,
      bullish: true
    });
  } else if (macd.crossover === 'bearish' && macd.histogram < 0) {
    bullishScore -= 20;
    reasons.push({
      indicator: 'MACD',
      summary: `Bearish momentum crossover detected`,
      detail: `Short-term momentum has weakened beneath the longer-term baseline, warning that selling pressure is taking over.`,
      plainEnglishAnalogy: `Like throwing a ball in the air: it has reached peak height and gravity is pulling it down.`,
      bullish: false
    });
  } else {
    reasons.push({
      indicator: 'MACD',
      summary: `MACD momentum is consolidating`,
      detail: `Histogram is relatively flat (${macd.histogram.toFixed(2)}), suggesting a consolidation pause before the next directional break.`,
      plainEnglishAnalogy: `A tug-of-war where both teams are holding equal ground.`,
      bullish: true
    });
  }

  // 3. Evaluate Moving Averages (Trend & Support)
  const isAboveSma50 = price >= sma50;
  const isAboveSma200 = price >= sma200;
  const isGoldenCross = sma50 > sma200;

  if (isAboveSma50 && isAboveSma200) {
    bullishScore += 15;
    reasons.push({
      indicator: 'SMA',
      summary: `Trading above 50-day ($${sma50}) and 200-day ($${sma200}) SMAs`,
      detail: `Price is trading above key institutional baselines. When price is above these averages, institutional buyers often defend the trend.`,
      plainEnglishAnalogy: `Building a house on solid bedrock foundations rather than shifting sand.`,
      bullish: true
    });
  } else if (!isAboveSma50 && isAboveSma200) {
    bullishScore -= 5;
    reasons.push({
      indicator: 'SMA',
      summary: `Pulling back below 50-day SMA ($${sma50}) toward 200-day support ($${sma200})`,
      detail: `Short-term weakness inside a broader long-term bull market. Watching for support bounce at the 200-day average.`,
      plainEnglishAnalogy: `A minor detour during a road trip, but heading in the right general direction.`,
      bullish: false
    });
  } else if (!isAboveSma50 && !isAboveSma200) {
    bullishScore -= 20;
    reasons.push({
      indicator: 'SMA',
      summary: `Trading below both 50-day ($${sma50}) and 200-day ($${sma200}) SMAs`,
      detail: `The stock is in a macro downtrend. Historically, buying stocks beneath their 200-day average has higher risk of continued slide.`,
      plainEnglishAnalogy: `Swimming upstream against a strong river current.`,
      bullish: false
    });
  }

  // 4. Evaluate Volume
  if (volumeSurgeRatio >= 1.4) {
    const isUpDay = stock.change >= 0;
    if (isUpDay) {
      bullishScore += 10;
      reasons.push({
        indicator: 'VOLUME',
        summary: `Institutional volume surge (${(volumeSurgeRatio * 100).toFixed(0)}% of average)`,
        detail: `Heavy trading volume accompanying price gain indicates major institutional funds and hedge funds are accumulating shares.`,
        plainEnglishAnalogy: `A packed concert venue: huge crowds rushing to get tickets at once.`,
        bullish: true
      });
    } else {
      bullishScore -= 10;
      reasons.push({
        indicator: 'VOLUME',
        summary: `Elevated sell-off volume (${(volumeSurgeRatio * 100).toFixed(0)}% of average)`,
        detail: `Higher-than-normal volume on a down day signals institutional distribution or liquidation.`,
        plainEnglishAnalogy: `A crowded room where everyone is walking toward the emergency exits.`,
        bullish: false
      });
    }
  }

  // Clamp score 0 to 100
  const finalScore = Math.max(5, Math.min(95, bullishScore));

  let action: SignalAction = 'HOLD';
  let title = 'Neutral / Hold Signal';
  let summary = 'Current indicators show mixed signals. Best approach is to hold existing positions and wait for clearer trend definition.';
  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE';
  let recommendedAction = 'Hold current position. Monitor key support level at $' + (sma50 > 0 ? sma50 : price * 0.95).toFixed(2);
  let educationalTip = 'When signals are conflicting, the most profitable move is often doing nothing. Patience prevents unnecessary trading fee drag.';

  if (finalScore >= 80) {
    action = 'STRONG_BUY';
    title = 'High Probability Entry (Strong Buy)';
    summary = 'Multiple indicators align: oversold conditions combined with key moving average support create favorable asymmetric upside.';
    riskLevel = 'LOW';
    recommendedAction = 'Favorable entry point. Consider initiating or dollar-cost averaging into position with stop-loss below support.';
    educationalTip = 'Even on strong buy setups, avoid investing your entire budget at once. Divide your capital into 2-3 installments to smooth your average entry.';
  } else if (finalScore >= 65) {
    action = 'BUY';
    title = 'Constructive Buying Window';
    summary = 'Healthy technical setup with positive momentum indicators and solid trend structure.';
    riskLevel = 'MODERATE';
    recommendedAction = 'Accumulate on dips. Set upside target near recent resistance and maintain disciplined risk limits.';
    educationalTip = 'Notice how positive momentum aligns with moving average support. This is what technical traders call "confluence".';
  } else if (finalScore <= 25) {
    action = 'STRONG_SELL';
    title = 'High Risk / Severe Bearish Momentum';
    summary = 'Extreme overbought exhaustion or major breakdown below critical long-term moving averages.';
    riskLevel = 'HIGH';
    recommendedAction = 'Consider locking in profits or cutting losses to protect remaining capital. Avoid new long entries.';
    educationalTip = 'Preserving your principal capital is rule #1. It takes a 100% gain to recover from a 50% loss.';
  } else if (finalScore <= 40) {
    action = 'TRIM';
    title = 'Caution / Consider Trimming Profit';
    summary = 'Momentum is deteriorating or RSI is stretched into excessive greed territory.';
    riskLevel = 'MODERATE';
    recommendedAction = 'Take partial profits (e.g. 20-30% of shares) to lock in gains and reduce overall portfolio risk.';
    educationalTip = 'Trimming is not all-or-nothing: taking a small slice of profits off the table guarantees you walk away with green cash in hand.';
  }

  return {
    ticker,
    companyName: name,
    currentPrice: price,
    action,
    score: finalScore,
    title,
    summary,
    reasons,
    riskLevel,
    recommendedAction,
    educationalTip,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
