import { StockQuote } from '../types/stock';
import { StockSignal, SignalAction, SignalReason, HoldingContext } from '../types/signal';
import { SupportedLanguage } from '../i18n/translations';
import { 
  getLocalizedSignalTexts, 
  getLocalizedReasonTexts, 
  getLocalizedHoldingTexts, 
  HoldingStrategy 
} from './localizedSignalData';

export function generateTimingSignal(
  stock: StockQuote, 
  lang: SupportedLanguage = 'en',
  holdingContext?: HoldingContext
): StockSignal {
  const { price, indicators, name, ticker } = stock;
  const { rsi, macd, sma20, sma50, sma200, volumeSurgeRatio } = indicators;

  const reasons: SignalReason[] = [];
  let bullishScore = 50; // Starting baseline

  // 1. Evaluate RSI
  if (rsi <= 30) {
    bullishScore += 25;
    const t = getLocalizedReasonTexts('rsi_oversold', { val: rsi }, lang);
    reasons.push({
      indicator: 'RSI',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: true
    });
  } else if (rsi <= 45) {
    bullishScore += 10;
    const t = getLocalizedReasonTexts('rsi_low', { val: rsi }, lang);
    reasons.push({
      indicator: 'RSI',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: true
    });
  } else if (rsi >= 75) {
    bullishScore -= 30;
    const t = getLocalizedReasonTexts('rsi_overbought', { val: rsi }, lang);
    reasons.push({
      indicator: 'RSI',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: false
    });
  } else if (rsi >= 65) {
    bullishScore -= 10;
    const t = getLocalizedReasonTexts('rsi_hot', { val: rsi }, lang);
    reasons.push({
      indicator: 'RSI',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: false
    });
  } else {
    const t = getLocalizedReasonTexts('rsi_balanced', { val: rsi }, lang);
    reasons.push({
      indicator: 'RSI',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: true
    });
  }

  // 2. Evaluate MACD
  if (macd.crossover === 'bullish' && macd.histogram > 0) {
    bullishScore += 20;
    const t = getLocalizedReasonTexts('macd_bullish', {}, lang);
    reasons.push({
      indicator: 'MACD',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: true
    });
  } else if (macd.crossover === 'bearish' && macd.histogram < 0) {
    bullishScore -= 20;
    const t = getLocalizedReasonTexts('macd_bearish', {}, lang);
    reasons.push({
      indicator: 'MACD',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: false
    });
  } else {
    const t = getLocalizedReasonTexts('macd_flat', {}, lang);
    reasons.push({
      indicator: 'MACD',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: true
    });
  }

  // 3. Evaluate Moving Averages (Trend & Support)
  const isAboveSma50 = price >= sma50;
  const isAboveSma200 = price >= sma200;

  if (isAboveSma50 && isAboveSma200) {
    bullishScore += 15;
    const t = getLocalizedReasonTexts('sma_above_both', { sma50, sma200 }, lang);
    reasons.push({
      indicator: 'SMA',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: true
    });
  } else if (!isAboveSma50 && isAboveSma200) {
    bullishScore -= 5;
    const t = getLocalizedReasonTexts('sma_pullback_50', { sma50, sma200 }, lang);
    reasons.push({
      indicator: 'SMA',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: false
    });
  } else if (!isAboveSma50 && !isAboveSma200) {
    bullishScore -= 20;
    const t = getLocalizedReasonTexts('sma_below_both', { sma50, sma200 }, lang);
    reasons.push({
      indicator: 'SMA',
      summary: t.summary,
      detail: t.detail,
      plainEnglishAnalogy: t.analogy,
      bullish: false
    });
  }

  // 4. Evaluate Volume
  if (volumeSurgeRatio >= 1.4) {
    const isUpDay = stock.change >= 0;
    const pct = Math.round(volumeSurgeRatio * 100);
    if (isUpDay) {
      bullishScore += 10;
      const t = getLocalizedReasonTexts('vol_surge_up', { pct }, lang);
      reasons.push({
        indicator: 'VOLUME',
        summary: t.summary,
        detail: t.detail,
        plainEnglishAnalogy: t.analogy,
        bullish: true
      });
    } else {
      bullishScore -= 10;
      const t = getLocalizedReasonTexts('vol_surge_down', { pct }, lang);
      reasons.push({
        indicator: 'VOLUME',
        summary: t.summary,
        detail: t.detail,
        plainEnglishAnalogy: t.analogy,
        bullish: false
      });
    }
  }

  // Base Technical Action
  let finalScore = Math.max(5, Math.min(95, bullishScore));
  let action: SignalAction = 'HOLD';
  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE';

  if (finalScore >= 80) {
    action = 'STRONG_BUY';
    riskLevel = 'LOW';
  } else if (finalScore >= 65) {
    action = 'BUY';
    riskLevel = 'MODERATE';
  } else if (finalScore <= 25) {
    action = 'STRONG_SELL';
    riskLevel = 'HIGH';
  } else if (finalScore <= 40) {
    action = 'TRIM';
    riskLevel = 'MODERATE';
  }

  const defaultLocalized = getLocalizedSignalTexts(action, finalScore, price, sma50, lang);

  // If this stock is a personal portfolio holding, calibrate based on user's average buy price
  if (holdingContext && holdingContext.averageBuyPrice > 0) {
    const costBasis = holdingContext.averageBuyPrice;
    const pnlPercent = ((price - costBasis) / costBasis) * 100;
    const pnlAmount = (price - costBasis) * (holdingContext.shares || 1);
    const curr = holdingContext.currencySymbol || stock.currencySymbol || '$';

    let strategy: HoldingStrategy = 'ACCUMULATE';
    let holdingAction: SignalAction = action;

    // A. Target Sell Price reached or Big Profit (+18%+ or +10% with overbought RSI)
    const isTargetHit = !!(holdingContext.targetSellPrice && price >= holdingContext.targetSellPrice);
    if (isTargetHit || pnlPercent >= 18 || (pnlPercent >= 10 && rsi >= 65)) {
      strategy = 'TRIM_PROFIT';
      holdingAction = pnlPercent >= 35 && rsi >= 75 ? 'STRONG_SELL' : 'TRIM';
      riskLevel = 'LOW'; // Low risk because user is sitting on large profits
      finalScore = Math.min(finalScore, 35);
    }
    // B. Stop-Loss breached or Severe Loss (-10% or more below cost basis)
    else if (
      (holdingContext.stopLossPrice && price <= holdingContext.stopLossPrice) ||
      (pnlPercent <= -10 && (rsi < 50 || !isAboveSma50))
    ) {
      strategy = 'STOP_LOSS';
      holdingAction = pnlPercent <= -16 ? 'STRONG_SELL' : 'TRIM';
      riskLevel = 'HIGH';
      finalScore = Math.min(finalScore, 25);
    }
    // C. DCA Opportunity (Stock is -3% to -14% below cost, but RSI is oversold or bouncing on 200 SMA)
    else if (pnlPercent <= -3 && (rsi <= 45 || isAboveSma200 || macd.crossover === 'bullish')) {
      strategy = 'DCA_DIP';
      holdingAction = rsi <= 32 ? 'STRONG_BUY' : 'BUY';
      riskLevel = 'MODERATE';
      finalScore = Math.max(finalScore, 75);
    }
    // D. Holding Winner (+3% to +18% gain, constructive trend)
    else if (pnlPercent >= 3) {
      strategy = 'HOLD_PROFIT';
      holdingAction = 'HOLD';
      riskLevel = 'LOW';
      finalScore = Math.max(50, Math.min(65, finalScore));
    }
    // E. Flat / Consolidating near cost basis (-3% to +3%)
    else {
      strategy = 'ACCUMULATE';
      // keep action from technical indicators
    }

    const holdingTexts = getLocalizedHoldingTexts(
      strategy,
      ticker,
      costBasis,
      price,
      pnlPercent,
      curr,
      lang
    );

    // Prepend cost basis reason to the top of reasons list
    reasons.unshift({
      indicator: 'COST_BASIS',
      summary: holdingTexts.reasonSummary,
      detail: holdingTexts.reasonDetail,
      plainEnglishAnalogy: holdingTexts.reasonAnalogy,
      bullish: pnlPercent >= 0 || strategy === 'DCA_DIP'
    });

    return {
      ticker,
      companyName: name,
      currentPrice: price,
      action: holdingAction,
      score: finalScore,
      title: holdingTexts.title,
      summary: holdingTexts.summary,
      reasons,
      riskLevel,
      recommendedAction: holdingTexts.recommendedAction,
      educationalTip: holdingTexts.educationalTip,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHolding: true,
      averageBuyPrice: costBasis,
      pnlPercent,
      pnlAmount,
      costBasisFeedback: holdingTexts.costBasisFeedback,
      holdingStrategyAction: strategy
    };
  }

  // Standard Watchlist / Unowned Stock Signal
  return {
    ticker,
    companyName: name,
    currentPrice: price,
    action,
    score: finalScore,
    title: defaultLocalized.title,
    summary: defaultLocalized.summary,
    reasons,
    riskLevel,
    recommendedAction: defaultLocalized.recommendedAction,
    educationalTip: defaultLocalized.educationalTip,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isHolding: false
  };
}

