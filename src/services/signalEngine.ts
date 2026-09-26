import { StockQuote } from '../types/stock';
import { StockSignal, SignalAction, SignalReason } from '../types/signal';
import { SupportedLanguage } from '../i18n/translations';
import { getLocalizedSignalTexts, getLocalizedReasonTexts } from './localizedSignalData';

export function generateTimingSignal(stock: StockQuote, lang: SupportedLanguage = 'en'): StockSignal {
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

  // Clamp score 0 to 100
  const finalScore = Math.max(5, Math.min(95, bullishScore));

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

  const localized = getLocalizedSignalTexts(action, finalScore, price, sma50, lang);

  return {
    ticker,
    companyName: name,
    currentPrice: price,
    action,
    score: finalScore,
    title: localized.title,
    summary: localized.summary,
    reasons,
    riskLevel,
    recommendedAction: localized.recommendedAction,
    educationalTip: localized.educationalTip,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
