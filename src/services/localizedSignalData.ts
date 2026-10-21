import { SignalAction, SignalReason } from '../types/signal';
import { SupportedLanguage } from '../i18n/translations';
import { AssetClass } from '../types/stock';

export interface LocalizedSignalTexts {
  title: string;
  summary: string;
  recommendedAction: string;
  educationalTip: string;
}

export function getLocalizedSignalTexts(
  action: SignalAction,
  score: number,
  price: number,
  sma50: number,
  lang: SupportedLanguage
): LocalizedSignalTexts {
  if (lang === 'ko') {
    if (score >= 80) {
      return {
        title: '고확률 진입 신호 (강력 매수)',
        summary: '여러 지표가 일치합니다: 과매도 국면과 핵심 이동평균 지지선이 결합되어 손익비가 매우 유리한 비대칭 상승 구간입니다.',
        recommendedAction: '유리한 진입 자리입니다. 지지선 바로 아래 손절선을 설정하고 신규 매수 또는 분할 매수를 검토하세요.',
        educationalTip: '강력 매수 신호라도 자금을 한 번에 올인하지 마세요. 2~3회로 나누어 분할 매수하는 것이 평균 단가를 안정시킵니다.'
      };
    }
    if (score >= 65) {
      return {
        title: '건설적 분할 매수 구간',
        summary: '상승 모멘텀 지표와 견고한 추세 구조가 조화를 이루는 건강한 기술적 셋업입니다.',
        recommendedAction: '눌림목에서 분할 매집을 고려하세요. 최근 저항선 부근에 목표가를 설정하고 규율 있는 리스크 한도를 유지하세요.',
        educationalTip: '상승 모멘텀이 이동평균 지지선과 일치하는 현상을 기술적 분석에서는 \'다중 합치(Confluence)\'라고 부릅니다.'
      };
    }
    if (score <= 25) {
      return {
        title: '고위험 / 강한 하락 모멘텀',
        summary: '극단적 과매수 탈진이 나타났거나 핵심 장기 이동평균선 아래로 추세가 완전히 붕괴되었습니다.',
        recommendedAction: '남은 원금을 보호하기 위해 이익 실현 또는 과감한 손절을 검토하세요. 신규 매수는 절대 금물입니다.',
        educationalTip: '원금 보존이 투자의 제1원칙입니다. 50% 손실을 복구하려면 100%의 수익률이 필요합니다.'
      };
    }
    if (score <= 40) {
      return {
        title: '주의 / 차익 실현 분할 매도 고려',
        summary: '상승 모멘텀이 둔화되거나 RSI가 과도한 탐욕 구간으로 치솟았습니다.',
        recommendedAction: '수익을 확정하고 포트폴리오의 리스크를 줄이기 위해 일부 물량(예: 20~30%)의 차익 실현을 권장합니다.',
        educationalTip: '익절은 전부 파는 것이 아닙니다: 일부만 분할 매도해도 확실한 현금 수익을 손에 쥐게 됩니다.'
      };
    }
    return {
      title: '중립 / 관망 신호',
      summary: '현재 지표들이 엇갈린 신호를 보내고 있습니다. 기존 포지션을 유지하며 추세가 명확해질 때까지 관망하는 것이 현명합니다.',
      recommendedAction: `현재 보유 상태를 유지하세요. 핵심 지지선($${(sma50 > 0 ? sma50 : price * 0.95).toFixed(2)})을 주시하세요.`,
      educationalTip: '신호가 혼조세일 때는 아무것도 하지 않는 것이 가장 수익성이 높습니다. 인내심이 불필요한 매매 수수료 손실을 막아줍니다.'
    };
  }

  if (lang === 'ja') {
    if (score >= 80) {
      return {
        title: '高勝率エントリー（強い買い）',
        summary: '複数の指標が一致：売られすぎ水準と主要移動平均サポートが好都合な上昇余地を創出。',
        recommendedAction: '絶好のエントリー局面。サポート下に逆指値を設定し、打診買いや積立買いを検討してください。',
        educationalTip: '強い買いシグナルでも全額一括投資は避け、2〜3回に分けてエントリーしましょう。'
      };
    }
    if (score >= 65) {
      return {
        title: '買い場ウィンドウ（押し目買い）',
        summary: 'ポジティブなモメンタムと堅固なトレンド構造を持つ健全なテクニカルセットアップ。',
        recommendedAction: '押し目で買い増しを検討。直近のレジスタンスをターゲットに規律あるリスク管理を。',
        educationalTip: '移動平均のサポートと勢いが一致する状態をテクニカルでは「合流（コンフルエンス）」と呼びます。'
      };
    }
    if (score <= 25) {
      return {
        title: '高リスク / 強い下落モメンタム',
        summary: '極端な過熱感による息切れ、または長期主要移動平均線を下回る重大な下落トレンド。',
        recommendedAction: '元本保護のため利確または損切りを検討。新規の買いエントリーは控えてください。',
        educationalTip: '投資の第一原則は元本を守ることです。50%失った場合、元に戻すには100%の上昇が必要です。'
      };
    }
    if (score <= 40) {
      return {
        title: '警戒 / 一部利確を推奨',
        summary: '勢いが鈍化しているか、RSIが過度の買われすぎ圏に突入しています。',
        recommendedAction: '利益を確保し全体リスクを下げるため、保有株の20〜30%の部分利確を検討してください。',
        educationalTip: '利確は全売却ではありません。一部を利益確定することで手元に確実に現金を残せます。'
      };
    }
    return {
      title: '中立 / 様子見シグナル',
      summary: '現在のテクニカル指標はまちまちです。既存ポジションを維持し明確なトレンド発生を待ちましょう。',
      recommendedAction: `現行ポジションを維持。重要サポートライン（$${(sma50 > 0 ? sma50 : price * 0.95).toFixed(2)}）を注視してください。`,
      educationalTip: 'シグナルが混迷している時は「何もしない」ことが最も賢明です。無駄な売買手数料を防ぎます。'
    };
  }

  if (lang === 'zh-TW' || lang === 'zh-CN') {
    const isTW = lang === 'zh-TW';
    if (score >= 80) {
      return {
        title: isTW ? '高勝率進場點（強力買進）' : '高胜率进场点（强力买入）',
        summary: isTW ? '多項指標共振：超賣區域結合關鍵均線支撐，形成極具優勢的不對稱上行空間。' : '多项指标共振：超卖区域结合关键均线支撑，形成极具优势的不对称上行空间。',
        recommendedAction: isTW ? '優質進場區間。建議在支撐位下方設定停損，進行分批進場。' : '优质进场区间。建议在支撑位下方设定止损，进行分批进场。',
        educationalTip: isTW ? '即使是強力買進訊號，也請避免一次全額投入，分2-3批次能平滑成本。' : '即使是强力买入信号，也请避免一次全额投入，分2-3批次能平滑成本。'
      };
    }
    if (score >= 65) {
      return {
        title: isTW ? '建設性買進窗口' : '建设性买入窗口',
        summary: isTW ? '良好的技術面結構，具備正向動量指標與穩固的趨勢支撐。' : '良好的技术面结构，具备正向动量指标与稳固的趋势支撑。',
        recommendedAction: isTW ? '逢回調拉回建立部位。以近期阻力位為目標並落實風險控管。' : '逢回调拉回建立仓位。以近期阻力位为目标并落实风险管控。',
        educationalTip: isTW ? '正向動量與均線支撐重疊的現象，技術分析上稱為「多重共振」。' : '正向动量与均线支撑重叠的现象，技术分析上称为“多重共振”。'
      };
    }
    if (score <= 25) {
      return {
        title: isTW ? '高風險 / 強烈空頭動量' : '高风险 / 强烈空头动量',
        summary: isTW ? '極端超買後的動能衰竭，或跌破關鍵長期移動平均線。' : '极端超买后的动能衰竭，或跌破关键长期移动平均线。',
        recommendedAction: isTW ? '建議獲利了結或果斷停損以保護本金，避免新開多單。' : '建议获利了结或果断止损以保护本金，避免新开多单。',
        educationalTip: isTW ? '保全本金是投資的第一原則。虧損50%需要上漲100%才能回本。' : '保全本金是投资的第一原则。亏损50%需要上涨100%才能回本。'
      };
    }
    if (score <= 40) {
      return {
        title: isTW ? '謹慎 / 考慮分批獲利了結' : '谨慎 / 考虑分批获利了结',
        summary: isTW ? '動能正在減弱，或RSI指標已處於過度貪婪區間。' : '动能正在减弱，或RSI指标已处于过度贪婪区间。',
        recommendedAction: isTW ? '考慮部分停利（如20-30%持股）以鎖定利潤並降低整體風險。' : '考虑部分止盈（如20-30%持仓）以锁定利润并降低整体风险。',
        educationalTip: isTW ? '獲利了結不是非黑即白，分批入袋能確保把綠色利潤轉化為實質現金。' : '获利了结不是非黑即白，分批入袋能确保把绿色利润转化为实质现金。'
      };
    }
    return {
      title: isTW ? '中立 / 觀望訊號' : '中立 / 观望信号',
      summary: isTW ? '指標信號多空交織，最佳策略是持有現有部位並等待趨勢明朗。' : '指标信号多空交织，最佳策略是持有现有仓位并等待趋势明朗。',
      recommendedAction: isTW ? `維持現有部位，關注關鍵支撐位 $${(sma50 > 0 ? sma50 : price * 0.95).toFixed(2)}。` : `维持现有仓位，关注关键支撑位 $${(sma50 > 0 ? sma50 : price * 0.95).toFixed(2)}。`,
      educationalTip: isTW ? '當訊號不明確時，最有利可圖的做法往往是按兵不動，耐心能避免無謂交易成本。' : '当信号不明确时，最有利可图的做法往往是按兵不动，耐心能避免无谓交易成本。'
    };
  }

  // English fallback
  if (score >= 80) {
    return {
      title: 'High Probability Entry (Strong Buy)',
      summary: 'Multiple indicators align: oversold conditions combined with key moving average support create favorable asymmetric upside.',
      recommendedAction: 'Favorable entry point. Consider initiating or dollar-cost averaging into position with stop-loss below support.',
      educationalTip: 'Even on strong buy setups, avoid investing your entire budget at once. Divide your capital into 2-3 installments to smooth your average entry.'
    };
  }
  if (score >= 65) {
    return {
      title: 'Constructive Buying Window',
      summary: 'Healthy technical setup with positive momentum indicators and solid trend structure.',
      recommendedAction: 'Accumulate on dips. Set upside target near recent resistance and maintain disciplined risk limits.',
      educationalTip: 'Notice how positive momentum aligns with moving average support. This is what technical traders call "confluence".'
    };
  }
  if (score <= 25) {
    return {
      title: 'High Risk / Severe Bearish Momentum',
      summary: 'Extreme overbought exhaustion or major breakdown below critical long-term moving averages.',
      recommendedAction: 'Consider locking in profits or cutting losses to protect remaining capital. Avoid new long entries.',
      educationalTip: 'Preserving your principal capital is rule #1. It takes a 100% gain to recover from a 50% loss.'
    };
  }
  if (score <= 40) {
    return {
      title: 'Caution / Consider Trimming Profit',
      summary: 'Momentum is deteriorating or RSI is stretched into excessive greed territory.',
      recommendedAction: 'Take partial profits (e.g. 20-30% of shares) to lock in gains and reduce overall portfolio risk.',
      educationalTip: 'Trimming is not all-or-nothing: taking a small slice of profits off the table guarantees you walk away with green cash in hand.'
    };
  }
  return {
    title: 'Neutral / Hold Signal',
    summary: 'Current indicators show mixed signals. Best approach is to hold existing positions and wait for clearer trend definition.',
    recommendedAction: 'Hold current position. Monitor key support level at $' + (sma50 > 0 ? sma50 : price * 0.95).toFixed(2),
    educationalTip: 'When signals are conflicting, the most profitable move is often doing nothing. Patience prevents unnecessary trading fee drag.'
  };
}

export function getLocalizedReasonTexts(
  key: string,
  data: { val?: number; sma50?: number; sma200?: number; pct?: number },
  lang: SupportedLanguage
): { summary: string; detail: string; analogy: string } {
  if (lang === 'ko') {
    switch (key) {
      case 'rsi_oversold':
        return {
          summary: `RSI 심각한 과매도 (${data.val?.toFixed(1)})`,
          detail: '최근 주가가 급락했습니다. 30 이하의 수치는 매도세가 소진되어 저가 매수세가 유입되기 시작하는 구간입니다.',
          analogy: '고무줄을 끝까지 뒤로 당긴 상태 — 놓았을 때 강한 반탄력이 발생할 잠재력이 큽니다.'
        };
      case 'rsi_low':
        return {
          summary: `RSI 저점권 건전 구간 (${data.val?.toFixed(1)})`,
          detail: '중립선인 50 이하에서 거래되고 있어 고점 추격 매수 없이 안전마진을 확보할 수 있는 진입 자리입니다.',
          analogy: '운동화를 정가에 사지 않고 정기 세일 기간에 할인받아 사는 것과 같습니다.'
        };
      case 'rsi_overbought':
        return {
          summary: `RSI 극단적 과매수 경고 (${data.val?.toFixed(1)})`,
          detail: '단기간에 주가가 너무 급등했습니다. 통계적으로 RSI 75 초과 시 단기 차익 실현 급락이나 급격한 숨고르기 조정이 나타납니다.',
          analogy: '단거리 선수가 전속력으로 2마일을 질주한 상태 — 반드시 멈춰서 숨을 골라야 합니다.'
        };
      case 'rsi_hot':
        return {
          summary: `RSI 과열 주의 구간 진입 (${data.val?.toFixed(1)})`,
          detail: '상단 과열권에 진입하고 있습니다. 이 가격대에서의 신규 진입은 안전마진이 낮습니다.',
          analogy: '황색 신호등에 접근 중: 통과할 수는 있지만 언제든 멈출 준비를 하세요.'
        };
      case 'rsi_balanced':
        return {
          summary: `RSI 중립 균형 구간 (${data.val?.toFixed(1)})`,
          detail: '매수세와 매도세가 균형을 이루고 있으며 어느 한 방향으로의 극단적 압력은 없습니다.',
          analogy: '고속도로 중앙 차선에서 정속으로 편안하게 주행하는 상태.'
        };
      case 'macd_bullish':
        return {
          summary: '상승 모멘텀 골든 크로스 확인',
          detail: '단기 이동평균선이 장기 시그널선을 상향 돌파했습니다. 상승 추진력이 가속화되고 있습니다.',
          analogy: '쾌속정이 가속 페달을 밟는 것과 같습니다: 물살이 커지고 전진 출력이 상승합니다.'
        };
      case 'macd_bearish':
        return {
          summary: '하락 모멘텀 데드 크로스 포착',
          detail: '단기 추진력이 장기 기준선 아래로 꺾였으며 매도 압력이 점차 시장을 장악하고 있다는 경고입니다.',
          analogy: '공을 하늘로 던진 후 최고점에 도달해 중력에 의해 떨어지기 시작하는 순간.'
        };
      case 'macd_flat':
        return {
          summary: 'MACD 모멘텀 숨고르기 횡보',
          detail: '히스토그램이 평탄하여, 다음 방향성이 결정되기 전 에너지를 비축하는 구간입니다.',
          analogy: '줄다리기 경기에서 양 팀이 팽팽하게 힘을 겨루는 상태.'
        };
      case 'sma_above_both':
        return {
          summary: `50일선($${data.sma50}) 및 200일선($${data.sma200}) 위 안정적 주행`,
          detail: '기관 투자자의 핵심 지지선 위에서 거래 중입니다. 기관들은 이 이동평균선 부근에서 주가를 적극 방어합니다.',
          analogy: '모래성 대신 단단한 화강암 암반 위에 집을 짓는 것과 같습니다.'
        };
      case 'sma_pullback_50':
        return {
          summary: `50일선($${data.sma50}) 아래 일시적 눌림... 200일선($${data.sma200}) 지지 확인`,
          detail: '장기 상승장 내에서의 일시적 건강한 조정입니다. 200일선 부근에서의 지지 반등 여부를 관찰하세요.',
          analogy: '로드 트립 중 잠시 들른 휴게소이지만 올바른 방향으로 나아가는 중입니다.'
        };
      case 'sma_below_both':
        return {
          summary: `50일선($${data.sma50})과 200일선($${data.sma200}) 하회`,
          detail: '대세 하락 추세 국면입니다. 역사적으로 200일선 아래의 주식은 추가 하락 위험이 큽니다.',
          analogy: '거센 강물의 역방향으로 헤엄쳐 거슬러 올라가는 것과 같습니다.'
        };
      case 'vol_surge_up':
        return {
          summary: `기관급 대량 매수 거래량 폭증 (${data.pct}%)`,
          detail: '주가 상승과 함께 동반된 대량 거래량은 대형 기관과 헤지펀드가 주식을 적극 매집하고 있음을 나타냅니다.',
          analogy: '인기 콘서트장: 수많은 인파가 한꺼번에 표를 구하기 위해 몰려드는 모습.'
        };
      case 'vol_surge_down':
        return {
          summary: `투매성 대량 매도 거래량 포착 (${data.pct}%)`,
          detail: '주가 하락 시 거래량이 크게 실리는 것은 대형 기관의 물량 털기 또는 손절 청산 신호입니다.',
          analogy: '사람들로 가득 찬 방에서 일제히 비상구로 탈출하는 상황.'
        };
    }
  }

  // English default
  switch (key) {
    case 'rsi_oversold':
      return {
        summary: `RSI is deeply oversold at ${data.val?.toFixed(1)}`,
        detail: 'The stock has dropped sharply in recent sessions. Values below 30 suggest severe selling fatigue where bargain hunters typically step in.',
        analogy: 'Like a rubber band pulled all the way back — when released, it has strong snap-back potential.'
      };
    case 'rsi_low':
      return {
        summary: `RSI is moderate-low at ${data.val?.toFixed(1)}`,
        detail: 'Trading below the neutral 50 level, presenting a healthier risk/reward entry without chasing highs.',
        analogy: 'Like buying sneakers on a seasonal discount rather than at full retail price.'
      };
    case 'rsi_overbought':
      return {
        summary: `RSI is critically overbought at ${data.val?.toFixed(1)}`,
        detail: 'The price has surged too fast in a short period. Statistically, stocks with RSI > 75 experience sharp cooling-off periods or pullbacks.',
        analogy: 'Like a runner sprinting at top speed for 2 miles — eventually they must pause to catch their breath.'
      };
    case 'rsi_hot':
      return {
        summary: `RSI is approaching hot zone at ${data.val?.toFixed(1)}`,
        detail: 'Entering elevated territory. New positions here have lower margin of safety.',
        analogy: 'Approaching yellow traffic light: you can proceed, but prepare to brake.'
      };
    case 'rsi_balanced':
      return {
        summary: `RSI is balanced at ${data.val?.toFixed(1)}`,
        detail: 'Price is in equilibrium between buyers and sellers with no extreme pressure in either direction.',
        analogy: 'Cruising comfortably in the middle lane on the highway.'
      };
    case 'macd_bullish':
      return {
        summary: 'Bullish momentum crossover confirmed',
        detail: 'The short-term moving average has crossed above the longer-term signal line. Upward momentum is accelerating.',
        analogy: 'Like a speedboat accelerating: the wake is getting bigger and forward thrust is rising.'
      };
    case 'macd_bearish':
      return {
        summary: 'Bearish momentum crossover detected',
        detail: 'Short-term momentum has weakened beneath the longer-term baseline, warning that selling pressure is taking over.',
        analogy: 'Like throwing a ball in the air: it has reached peak height and gravity is pulling it down.'
      };
    case 'macd_flat':
      return {
        summary: 'MACD momentum is consolidating',
        detail: 'Histogram is relatively flat, suggesting a consolidation pause before the next directional break.',
        analogy: 'A tug-of-war where both teams are holding equal ground.'
      };
    case 'sma_above_both':
      return {
        summary: `Trading above 50-day ($${data.sma50}) and 200-day ($${data.sma200}) SMAs`,
        detail: 'Price is trading above key institutional baselines. When price is above these averages, institutional buyers often defend the trend.',
        analogy: 'Building a house on solid bedrock foundations rather than shifting sand.'
      };
    case 'sma_pullback_50':
      return {
        summary: `Pulling back below 50-day SMA ($${data.sma50}) toward 200-day support ($${data.sma200})`,
        detail: 'Short-term weakness inside a broader long-term bull market. Watching for support bounce at the 200-day average.',
        analogy: 'A minor detour during a road trip, but heading in the right general direction.'
      };
    case 'sma_below_both':
      return {
        summary: `Trading below both 50-day ($${data.sma50}) and 200-day ($${data.sma200}) SMAs`,
        detail: 'The stock is in a macro downtrend. Historically, buying stocks beneath their 200-day average has higher risk of continued slide.',
        analogy: 'Swimming upstream against a strong river current.'
      };
    case 'vol_surge_up':
      return {
        summary: `Institutional volume surge (${data.pct}% of average)`,
        detail: 'Heavy trading volume accompanying price gain indicates major institutional funds and hedge funds are accumulating shares.',
        analogy: 'A packed concert venue: huge crowds rushing to get tickets at once.'
      };
    case 'vol_surge_down':
      return {
        summary: `Elevated sell-off volume (${data.pct}% of average)`,
        detail: 'Higher-than-normal volume on a down day signals institutional distribution or liquidation.',
        analogy: 'A crowded room where everyone is walking toward the emergency exits.'
      };
    default:
      return {
        summary: 'Technical indicator balanced',
        detail: 'Moving in normal parameters.',
        analogy: 'Steady cruise.'
      };
  }
}

export interface LocalizedHoldingTexts {
  title: string;
  summary: string;
  recommendedAction: string;
  educationalTip: string;
  reasonSummary: string;
  reasonDetail: string;
  reasonAnalogy: string;
  costBasisFeedback: string;
}

export type HoldingStrategy = 
  | 'TRIM_PROFIT' 
  | 'DCA_DIP' 
  | 'STOP_LOSS' 
  | 'HOLD_PROFIT' 
  | 'ACCUMULATE'
  | 'DCA_INDEX_DIP'
  | 'HOLD_COMPOUNDER';

export function getLocalizedHoldingTexts(
  strategy: HoldingStrategy,
  ticker: string,
  costBasis: number,
  currentPrice: number,
  pnlPercent: number,
  curr: string,
  lang: SupportedLanguage
): LocalizedHoldingTexts {
  const pnlStr = (pnlPercent >= 0 ? '+' : '') + pnlPercent.toFixed(1) + '%';
  const costStr = `${curr}${costBasis.toFixed(2)}`;
  const priceStr = `${curr}${currentPrice.toFixed(2)}`;

  if (lang === 'ko') {
    switch (strategy) {
      case 'DCA_INDEX_DIP':
        return {
          title: `지수 ETF 분할 매수 적기 (${pnlStr} 평단가 할인)`,
          summary: `${ticker} 현재가 ${priceStr}로 회원님의 평균 매수가(${costStr}) 대비 ${pnlStr} 할인된 매력적인 가격대입니다. 대표 지수 ETF는 개별 기업 파산 위험이 없으므로 조정장은 역사상 가장 승률 높은 분할 매수(DCA) 기회입니다.`,
          recommendedAction: `공포에 투매하지 마세요. 대표 지수 ETF는 장기적으로 항상 전고점을 회복했습니다. 여유 자금으로 분할 매수하여 평단가를 낮추세요.`,
          educationalTip: '워런 버핏의 격언: "남들이 공포에 질려 있을 때 욕심을 내라." 지수 펀드의 -10%~-20% 조정은 경제 전체를 할인된 가격에 사는 축복입니다.',
          reasonSummary: `지수 ETF 평단가 할인 + 무(無)파산 안전성 (${pnlStr})`,
          reasonDetail: `개별 주식과 달리 수백 개 초우량 기업에 자동 분산되어 있으므로, 평단가 아래로 내려온 구간은 장기 복리 수익률을 극대화하는 매수 구간입니다.`,
          reasonAnalogy: '백화점 전체 명품관이 연말 정기 세일을 시작한 것과 같습니다.',
          costBasisFeedback: `대표 지수 ETF가 평단가 대비 ${pnlStr} 할인 중입니다. 공포 매도를 피하고 분할 매집 기회로 활용하세요.`
        };
      case 'HOLD_COMPOUNDER':
        return {
          title: `장기 복리 성장 보유 지속 (${pnlStr} 수익 쿠션)`,
          summary: `${ticker}가 평균 매수가(${costStr}) 대비 ${pnlStr} 상승하여 장기 복리 효과가 순항 중입니다. 지수 ETF는 잦은 단타 매매보다 수년간 묵묵히 보유할 때 가장 큰 부를 창출합니다.`,
          recommendedAction: `조급하게 매도하지 마시고 장기 복리 추세를 즐기세요. 전체 포트폴리오의 주식 비중을 리밸런싱하는 목적이 아니라면 꾸준히 보유하세요.`,
          educationalTip: '지수 ETF의 가장 큰 미덕은 "수수료와 세금을 아끼는 지루한 장기 보유"입니다. 시장의 상승 에너지를 온전히 누리세요.',
          reasonSummary: `지수 복리 엔진 순항 (${pnlStr})`,
          reasonDetail: `평균 매수가 ${costStr}를 훌륭히 방어하며 자본주의 경제 성장의 과실을 차곡차곡 누적하고 있습니다.`,
          reasonAnalogy: '눈사람을 굴릴 때 눈덩이가 저절로 불어나는 스노우볼 효과입니다.',
          costBasisFeedback: `지수 ETF가 평단가 대비 ${pnlStr} 수익 중입니다. 장기 복리를 위해 계속 보유하세요.`
        };
      case 'TRIM_PROFIT':
        return {
          title: `차익 실현 분할 매도 고려 (${pnlStr})`,
          summary: `${ticker} 현재가 ${priceStr}로, 회원님의 평균 매수가(${costStr}) 대비 ${pnlStr} 수익 구간입니다. 기술적 지표가 단기 과열권을 가리키고 있어 수익을 확정하기에 유리한 시점입니다.`,
          recommendedAction: `원금 회수 및 이익 확정을 위해 보유 수량의 25~50% 분할 매도를 권장합니다. 나머지 물량은 손절선을 평단가 위로 올려(익절선 상향) 추가 수익을 추구하세요.`,
          educationalTip: '수익은 계좌에 매도 입금되기 전까지는 단지 숫자에 불과합니다. 분할 매도로 확정 이익을 챙기는 것이 승률을 높입니다.',
          reasonSummary: `평균 단가 대비 높은 수익권 (${pnlStr})`,
          reasonDetail: `평균 매수가 ${costStr} 대비 주가가 급등하여 목표 수익률에 도달했습니다. 이 구간에서는 과욕을 줄이고 이익을 실현하는 것이 현명합니다.`,
          reasonAnalogy: '사과나무에 열린 탐스러운 사과를 한 번에 다 따지 않고 잘 익은 것부터 바구니에 담는 것과 같습니다.',
          costBasisFeedback: `회원님 평단가 ${costStr} 대비 ${pnlStr} 수익 중입니다. 일부 물량 익절로 수익을 확정하세요.`
        };
      case 'STOP_LOSS':
        return {
          title: `손실 방어 / 리스크 관리 경고 (${pnlStr})`,
          summary: `${ticker} 현재가 ${priceStr}로, 회원님의 평균 매수가(${costStr}) 대비 ${pnlStr} 하락했습니다. 핵심 지지선이 위협받고 있어 추가 원금 손실을 제한해야 하는 구간입니다.`,
          recommendedAction: `투자 아이디어가 훼손되었는지 냉정하게 재검토하세요. 손실이 눈덩이처럼 불어나기 전에 비중 축소나 과감한 손절매를 권장합니다.`,
          educationalTip: '작은 손실을 자르는 것은 패배가 아니라 계좌를 지키는 프로의 기술입니다. -10% 손실은 쉽게 복구되지만 -50%는 원금의 2배가 필요합니다.',
          reasonSummary: `평균 단가 대비 손실 한도 초과 (${pnlStr})`,
          reasonDetail: `평균 매수가 ${costStr} 아래로 밀리며 손실이 방어 한도를 넘어섰습니다. 추가 하락 시 기회비용과 원금 손실이 확대됩니다.`,
          reasonAnalogy: '배에 작은 구멍이 뚫렸을 때 즉시 메우거나 구명보트를 타야 침몰을 막을 수 있습니다.',
          costBasisFeedback: `회원님 평단가 ${costStr} 대비 ${pnlStr} 하락했습니다. 추가 손실을 막기 위해 리스크 관리가 필요합니다.`
        };
      case 'DCA_DIP':
        return {
          title: `평단가 인하 분할 매수 기회 (${pnlStr})`,
          summary: `${ticker} 현재가 ${priceStr}는 회원님의 평균 매수가(${costStr})보다 할인된 가격대(${pnlStr})이며, RSI 등 보조지표상 과매도 반등 지지선에 위치해 있습니다.`,
          recommendedAction: `기업의 장기 펀더멘털에 변함이 없다면, 이번 눌림목에서 소액 분할 매수하여 평균 매수가를 ${costStr} 아래로 낮추는 전략을 검토하세요.`,
          educationalTip: '물타기(DCA)는 무계획적인 추가 매수가 아닙니다. 반드시 기술적 지지선과 과매도 시그널이 확인된 자리에서만 실행해야 합니다.',
          reasonSummary: `평단가 할인 구간 + 과매도 지지 확인 (${pnlStr})`,
          reasonDetail: `현재 주가가 평균 매수가 ${costStr} 아래에 있어 평단가를 낮추기 유리하며, 하락 모멘텀이 진정되는 반등 신호가 관측됩니다.`,
          reasonAnalogy: '단골 마트에서 평소 사고 싶던 양질의 제품을 깜짝 세일할 때 알뜰하게 추가 구매하는 것과 같습니다.',
          costBasisFeedback: `회원님 평단가 ${costStr}보다 ${Math.abs(pnlPercent).toFixed(1)}% 저렴합니다. 기술적 지지 구간에서 평단가를 낮출 수 있습니다.`
        };
      case 'HOLD_PROFIT':
        return {
          title: `수익 보유 지속 (${pnlStr} 이익 쿠션)`,
          summary: `${ticker}가 평균 매수가(${costStr}) 대비 ${pnlStr} 상승하여 안정적인 수익 쿠션을 유지하고 있습니다. 상승 추세선이 잘 유지되고 있습니다.`,
          recommendedAction: `서둘러 전량 매도하지 마시고 추세를 즐기세요. 마음 편한 투자를 위해 손절 기준을 평단가(${costStr}) 위로 설정해 원금을 100% 보장하세요.`,
          educationalTip: '수익이 나는 주식을 너무 일찍 팔아치우고 손실 나는 주식만 오래 붙들고 있는 것은 초보 투자자의 가장 흔한 실수입니다.',
          reasonSummary: `견고한 수익 쿠션 형성 (${pnlStr})`,
          reasonDetail: `평균 매수가 ${costStr} 위에서 편안한 수익 마진을 누리며 주가가 상승 추세를 순항 중입니다.`,
          reasonAnalogy: '언덕 정상으로 가는 버스를 탔다면 중간 정류장에서 굳이 내릴 이유가 없습니다.',
          costBasisFeedback: `회원님 평단가 ${costStr} 대비 ${pnlStr} 상승 중입니다. 추세가 살아있으므로 편안하게 보유하세요.`
        };
      case 'ACCUMULATE':
      default:
        return {
          title: `평균 단가 부근 횡보 (${costStr})`,
          summary: `${ticker}가 회원님의 평균 매수가(${costStr}) 부근인 ${priceStr}(${pnlStr})에서 숨고르기 중입니다. 시장의 다음 방향성을 모니터링하세요.`,
          recommendedAction: `기존 보유 비중을 유지하며 거래량이 실린 확실한 방향성 돌파가 나올 때까지 관망하세요.`,
          educationalTip: '평단가 근처에서는 조급한 손절이나 섣부른 추매를 자제하고 추세가 어느 쪽으로 터지는지 지켜보는 것이 정석입니다.',
          reasonSummary: `평단가 보합권 (${pnlStr})`,
          reasonDetail: `평단가 ${costStr}와 현재 주가의 차이가 크지 않아 리스크와 기회가 균형을 이루고 있습니다.`,
          reasonAnalogy: '출발선에서 신호탄이 터지기를 기다리며 호흡을 가다듬는 순간입니다.',
          costBasisFeedback: `회원님 평단가 ${costStr} 부근에서 안정적으로 거래 중입니다. 기존 포지션을 유지하세요.`
        };
    }
  }

  if (lang === 'zh-TW' || lang === 'zh-CN') {
    const isTW = lang === 'zh-TW';
    switch (strategy) {
      case 'DCA_INDEX_DIP':
        return {
          title: isTW ? `指數型 ETF 分批逢低加碼良機 (${pnlStr})` : `指数型 ETF 分批逢低加码良机 (${pnlStr})`,
          summary: isTW 
            ? `${ticker} 現價 ${priceStr}，相較您的平均買進成本 ${costStr} 折價 ${pnlStr}。大盤指數型 ETF 沒有單一公司破產歸零風險，歷史證明回檔拉回是拉高長期複利回報的黃金累積期。`
            : `${ticker} 现价 ${priceStr}，相较您的平均买入成本 ${costStr} 折价 ${pnlStr}。大盘指数型 ETF 没有单一公司破产归零风险，历史证明回调拉回是提高长期复利回报的黄金累积期。`,
          recommendedAction: isTW 
            ? `切忌恐慌殺跌。大盤指數具備長期自我更新向上動能。建議利用閒置資金分批逢低加碼，有效降低整體持股成本。`
            : `切忌恐慌杀跌。大盘指数具备长期自我更新向上动能。建议利用闲置资金分批逢低加码，有效降低整体持仓成本。`,
          educationalTip: isTW 
            ? '巴菲特名言：「在別人恐懼時貪婪。」指數基金出現 -10%～-20% 的修正，等同於整個經濟體打折特賣，是定期定額投資人的天賜良機。'
            : '巴菲特名言：“在别人恐惧时贪婪。”指数基金出现 -10%～-20% 的修正，等同于整个经济体打折特卖，是定期定额投资人的天赐良机。',
          reasonSummary: isTW ? `指數成本折價 + 無倒閉歸零風險 (${pnlStr})` : `指数成本折价 + 无倒闭归零风险 (${pnlStr})`,
          reasonDetail: isTW 
            ? `相較於個別公司有競爭落敗風險，指數 ETF 具備自我淘汰更新機制，跌破成本往往是勝率最高的逢低加碼點。`
            : `相较于个别公司有竞争落败风险，指数 ETF 具备自我淘汰更新机制，跌破成本往往是胜率最高的逢低加码点。`,
          reasonAnalogy: isTW ? '如同整個精品百貨舉辦週年慶全面打折，用特惠價一次打包所有頂尖品牌。' : '如同整个精品百货举办周年庆全面打折，用特惠价一次打包所有顶尖品牌。',
          costBasisFeedback: isTW 
            ? `指數 ETF 相較成本折價 ${pnlStr}，大盤無破產風險，是極佳的逢低分批加碼買點。`
            : `指数 ETF 相较成本折价 ${pnlStr}，大盘无破产风险，是极佳的逢低分批加码买点。`
        };
      case 'HOLD_COMPOUNDER':
        return {
          title: isTW ? `長期複利增長持續持有 (${pnlStr})` : `长期复利增长持续持有 (${pnlStr})`,
          summary: isTW 
            ? `${ticker} 相較您的買進成本 ${costStr} 穩定獲利 ${pnlStr}，複利效應持續累積。指數型 ETF 適合跨越週期的長線持有，無需頻繁短線進出。`
            : `${ticker} 相较您的买入成本 ${costStr} 稳定盈利 ${pnlStr}，复利效应持续累积。指数型 ETF 适合跨越周期的长线持有，无需频繁短线进出。`,
          recommendedAction: isTW 
            ? `無需急於全數停利，讓複利飛輪持續旋轉。除非需要進行整體投資組合之股債資產再平衡，否則建議長線續抱。`
            : `无需急于全数止盈，让复利飞轮持续旋转。除非需要进行整体投资组合之股债资产再平衡，否则建议长线续抱。`,
          educationalTip: isTW 
            ? '指數投資的核心魅力在於「低週轉率與長期複利」。頻繁進出只會徒增手續費與稅負，放眼 5～10 年方顯大智慧。'
            : '指数投资的核心魅力在于“低周转率与长期复利”。频繁进出只会徒增手续费与税负，放眼 5～10 年方显大智慧。',
          reasonSummary: isTW ? `指數複利飛輪運轉中 (${pnlStr})` : `指数复利飞轮运转中 (${pnlStr})`,
          reasonDetail: isTW 
            ? `成本 ${costStr} 建立之護城河深厚，享受人類科技與經濟成長帶來的長線紅利。`
            : `成本 ${costStr} 建立之护城河深厚，享受人类科技与经济成长带来的长线红利。`,
          reasonAnalogy: isTW ? '雪球已經滾過山腰，依靠重力與坡度正在自然越滾越大。' : '雪球已经滚过山腰，依靠重力与坡度正在自然越滚越大。',
          costBasisFeedback: isTW 
            ? `指數 ETF 在成本之上穩健獲利 ${pnlStr}，順應長線複利，安心持有。`
            : `指数 ETF 在成本之上稳健盈利 ${pnlStr}，顺应长线复利，安心持有。`
        };
      case 'TRIM_PROFIT':
        return {
          title: isTW ? `分批獲利了結預警 (${pnlStr})` : `分批获利了结预警 (${pnlStr})`,
          summary: isTW 
            ? `${ticker} 現價 ${priceStr}，相較您的平均買進成本 ${costStr} 已獲利 ${pnlStr}。技術指標顯示進入短線過熱區，是鎖定獲利的好時機。`
            : `${ticker} 现价 ${priceStr}，相较您的平均买入成本 ${costStr} 已盈利 ${pnlStr}。技术指标显示进入短线过热区，是锁定利润的好时机。`,
          recommendedAction: isTW 
            ? `建議減碼 25%–50% 部位鎖定現金獲利，並將剩餘部位的停損點上移至成本價之上以保全利潤。`
            : `建议减仓 25%–50% 仓位锁定现金利润，并将剩余仓位的止损点上移至成本价之上以保全利润。`,
          educationalTip: isTW 
            ? '獲利入袋才是真金白銀。分批停利讓您永遠處於不敗之地。'
            : '落袋为安才是真金白银。分批止盈让您永远立于不败之地。',
          reasonSummary: isTW ? `相較買進成本獲利豐厚 (${pnlStr})` : `相较买入成本获利丰厚 (${pnlStr})`,
          reasonDetail: isTW 
            ? `股價大幅超越您的買進成本 ${costStr}，適度停利能將紙上富貴轉化為穩健收益。`
            : `股价大幅超越您的买入成本 ${costStr}，适度止盈能将账面富贵转化为稳健收益。`,
          reasonAnalogy: isTW ? '如同果園採收：將成熟的果實先放入竹簍，讓未熟的繼續生長。' : '如同果园采收：将成熟的果实先放入竹篓，让未熟的继续生长。',
          costBasisFeedback: isTW 
            ? `相較您的買進成本 ${costStr} 已獲利 ${pnlStr}，建議分批減碼鎖定利潤。`
            : `相较您的买入成本 ${costStr} 已盈利 ${pnlStr}，建议分批减仓锁定利润。`
        };
      case 'STOP_LOSS':
        return {
          title: isTW ? `防守性停損 / 風險警報 (${pnlStr})` : `防守性止损 / 风险警报 (${pnlStr})`,
          summary: isTW 
            ? `${ticker} 現價 ${priceStr}，已跌破您的平均買進成本 ${costStr} 達 ${pnlStr}。關鍵支撐面臨考驗，請嚴格控制本金風險。`
            : `${ticker} 现价 ${priceStr}，已跌破您的平均买入成本 ${costStr} 达 ${pnlStr}。关键支撑面临考验，请严格控制本金风险。`,
          recommendedAction: isTW 
            ? `客觀檢視當初買進的理由是否改變。若跌破預設停損位，請果斷執行紀律停損以防止虧損擴大。`
            : `客观检视当初买入的理由是否改变。若跌破预设止损位，请果断执行纪律止损以防止亏损扩大。`,
          educationalTip: isTW 
            ? '砍掉小虧損是保護大資金的鐵律。虧損 10% 很容易賺回，虧損 50% 需要上漲 100% 才能打平。'
            : '截断小亏损是保护大资金的铁律。亏损 10% 很容易赚回，亏损 50% 需要上涨 100% 才能回本。',
          reasonSummary: isTW ? `虧損超過防守底線 (${pnlStr})` : `亏损超过防守底线 (${pnlStr})`,
          reasonDetail: isTW 
            ? `現價低於買進成本 ${costStr}，若不加防範可能面臨更深度的資金回撤。`
            : `现价低于买入成本 ${costStr}，若不加防范可能面临更深度的资金回撤。`,
          reasonAnalogy: isTW ? '如同開車安全氣囊，及時彈出能避免遭受更嚴重的衝擊。' : '如同开车安全气囊，及时弹出能避免遭受更严重的冲击。',
          costBasisFeedback: isTW 
            ? `低於您的成本 ${costStr} 達 ${pnlStr}，請嚴格審視停損保護本金。`
            : `低于您的成本 ${costStr} 达 ${pnlStr}，请严格审视止损保护本金。`
        };
      case 'DCA_DIP':
        return {
          title: isTW ? `逢低攤平降低成本契機 (${pnlStr})` : `逢低加仓摊平成本良机 (${pnlStr})`,
          summary: isTW 
            ? `${ticker} 現價 ${priceStr} 比您的平均成本 ${costStr} 便宜 ${Math.abs(pnlPercent).toFixed(1)}%，且技術面出現超賣反彈訊號。`
            : `${ticker} 现价 ${priceStr} 比您的平均成本 ${costStr} 便宜 ${Math.abs(pnlPercent).toFixed(1)}%，且技术面出现超卖反弹信号。`,
          recommendedAction: isTW 
            ? `若公司長期前景未變，可趁此回檔分批加碼，將整體持股成本自 ${costStr} 有效拉低。`
            : `若公司长期前景未变，可趁此回调分批加仓，将整体持仓成本自 ${costStr} 有效拉低。`,
          educationalTip: isTW 
            ? '攤平不是盲目抄底，唯有在技術面有支撐且超賣確認時攤平，才能發揮最大的複利威力。'
            : '摊平不是盲目抄底，唯有在技术面有支撑且超卖确认时摊平，才能发挥最大的复利威力。',
          reasonSummary: isTW ? `低於成本之超賣進場點 (${pnlStr})` : `低于成本之超卖进场点 (${pnlStr})`,
          reasonDetail: isTW 
            ? `價格低於歷史持有均價 ${costStr}，技術指標浮現買盤進駐跡象。`
            : `价格低于历史持有均价 ${costStr}，技术指标浮现买盘进驻迹象。`,
          reasonAnalogy: isTW ? '如同您喜愛的優質商品遇到限時特價，用更便宜的價格補充庫存。' : '如同您喜爱的优质商品遇到限时特价，用更便宜的价格补充库存。',
          costBasisFeedback: isTW 
            ? `現價比成本 ${costStr} 優惠 ${Math.abs(pnlPercent).toFixed(1)}%，技術支撐帶有助於拉低均價。`
            : `现价比成本 ${costStr} 优惠 ${Math.abs(pnlPercent).toFixed(1)}%，技术支撑带助于拉低均价。`
        };
      case 'HOLD_PROFIT':
        return {
          title: isTW ? `持有獲利部位 (${pnlStr} 獲利墊)` : `持有盈利仓位 (${pnlStr} 盈利垫)`,
          summary: isTW 
            ? `${ticker} 相較您的買進成本 ${costStr} 穩定上漲 ${pnlStr}，趨勢結構保持完好。`
            : `${ticker} 相较您的买入成本 ${costStr} 稳定上涨 ${pnlStr}，趋势结构保持完好。`,
          recommendedAction: isTW 
            ? `續抱讓利潤奔馳。可將停損線移至成本價 ${costStr} 形成零風險交易。`
            : `续抱让利润奔跑。可将止损线移至成本价 ${costStr} 形成零风险交易。`,
          educationalTip: isTW 
            ? '放任獲利奔馳、及早截斷虧損，是成功投資人的雙翼。'
            : '放任盈利奔跑、及早截断亏损，是成功投资人的双翼。',
          reasonSummary: isTW ? `具備健康獲利緩衝 (${pnlStr})` : `具备健康盈利缓冲 (${pnlStr})`,
          reasonDetail: isTW 
            ? `在成本價 ${costStr} 之上穩步推進，不需隨短線雜訊頻繁進出。`
            : `在成本价 ${costStr} 之上稳步推进，不需随短线杂讯频繁进出。`,
          reasonAnalogy: isTW ? '乘順風車向前行駛，沿途風景優美無須急著下車。' : '乘顺风车向前行驶，沿途风景优美无须急着下车。',
          costBasisFeedback: isTW 
            ? `成本 ${costStr} 之上獲利 ${pnlStr}，順勢續抱讓利潤擴大。`
            : `成本 ${costStr} 之上盈利 ${pnlStr}，顺势续抱让利润扩大。`
        };
      case 'ACCUMULATE':
      default:
        return {
          title: isTW ? `於成本價附近整理 (${costStr})` : `在成本价附近整理 (${costStr})`,
          summary: isTW 
            ? `${ticker} 目前在您的平均買進成本 ${costStr} 附近（${priceStr}，${pnlStr}）整理蓄勢。`
            : `${ticker} 目前在您的平均买入成本 ${costStr} 附近（${priceStr}，${pnlStr}）整理蓄势。`,
          recommendedAction: isTW 
            ? `維持現有持股，等待突破確立後再行決定是否加碼或調節。`
            : `维持现有持股，等待突破确立后再行决定是否加码或调节。`,
          educationalTip: isTW 
            ? '整理行情中過度交易只會白白耗損手續費，耐心是最佳策略。'
            : '整理行情中过度交易只会白白耗损手续费，耐心是最佳策略。',
          reasonSummary: isTW ? `貼近買進成本線 (${pnlStr})` : `贴近买入成本线 (${pnlStr})`,
          reasonDetail: isTW ? `價格與成本 ${costStr} 相當，靜待市場催化劑引導新趨勢。` : `价格与成本 ${costStr} 相当，静待市场催化剂引导新趋势。`,
          reasonAnalogy: isTW ? '賽跑起跑線前的深呼吸，等待發令槍聲響起。' : '赛跑起跑线前的深呼吸，等待发令枪声响起。',
          costBasisFeedback: isTW 
            ? `現價緊貼您的平均成本 ${costStr}，耐心持有觀察突破方向。`
            : `现价紧贴您的平均成本 ${costStr}，耐心持有观察突破方向。`
        };
    }
  }

  // English fallback
  switch (strategy) {
    case 'DCA_INDEX_DIP':
      return {
        title: `Prime Index DCA Window (${pnlStr} vs Cost)`,
        summary: `${ticker} is trading at ${priceStr}, down ${pnlStr} below your average buy price of ${costStr}. Broad market index ETFs carry zero single-company bankruptcy risk—market pullbacks are historically the highest-yielding Dollar-Cost Averaging (DCA) discount windows.`,
        recommendedAction: `Do not panic-sell. Broad market index funds (like S&P 500 / Nasdaq) have a 100% historical recovery rate over long horizons. Use available capital to dollar-cost average and lower your average unit cost.`,
        educationalTip: 'Warren Buffett: "Be greedy when others are fearful." An index pullback is a storewide discount sale on the most productive corporations in the economy.',
        reasonSummary: `Index cost discount + zero bankruptcy risk (${pnlStr})`,
        reasonDetail: `Unlike individual companies with competitive failure risk, index funds automatically replace laggards with new winners. Buying below cost basis accelerates long-term compounding.`,
        reasonAnalogy: 'Like the entire luxury shopping mall having an annual storewide discount on every top brand.',
        costBasisFeedback: `Broad index ETF is down ${pnlStr} vs cost. No company bankruptcy risk—prime DCA accumulation opportunity.`
      };
    case 'HOLD_COMPOUNDER':
      return {
        title: `Long-Term Compounding (${pnlStr} Profit Cushion)`,
        summary: `${ticker} has gained ${pnlStr} above your ${costStr} average buy price. Broad index ETFs are wealth-compounding engines built to be held across market cycles for years or decades.`,
        recommendedAction: `Hold steady and let compound interest work. Avoid emotional short-term trading; only trim if rebalancing your target portfolio asset allocation.`,
        educationalTip: 'The superpower of index investing is low turnover, low fees, and uninterrupted compounding. Patience is the highest-paying skill in investing.',
        reasonSummary: `Index compounding engine running strong (${pnlStr})`,
        reasonDetail: `Your ${costStr} cost basis is well protected as the broader economy trends upward over long market cycles.`,
        reasonAnalogy: 'A snowball that has crested the hill and is now multiplying in size on its own momentum.',
        costBasisFeedback: `Broad index ETF is up ${pnlStr} past your ${costStr} cost basis. Compounding nicely—hold for long-term growth.`
      };
    case 'TRIM_PROFIT':
      return {
        title: `Consider Trimming Profit (${pnlStr} vs Cost)`,
        summary: `${ticker} is trading at ${priceStr}, up ${pnlStr} above your average cost basis of ${costStr}. Technical gauges indicate short-term overextension, creating a prime window to lock in gains.`,
        recommendedAction: `Consider trimming 25% to 50% of your shares to secure cash profit. Trail your stop-loss on remaining shares above your ${costStr} cost basis to protect your gain.`,
        educationalTip: 'Paper gains only turn into real wealth when captured. Trimming a portion of winning positions removes risk and builds confidence.',
        reasonSummary: `Substantial profit cushion vs cost basis (${pnlStr})`,
        reasonDetail: `Price has appreciated significantly past your entry at ${costStr}, reaching a favorable profit-taking target.`,
        reasonAnalogy: 'Harvesting the ripest apples from the branch into your basket while letting others keep growing.',
        costBasisFeedback: `You are up ${pnlStr} above your ${costStr} avg cost. Locking in partial profit here protects your capital.`
      };
    case 'STOP_LOSS':
      return {
        title: `Capital Defense / Stop-Loss Warning (${pnlStr})`,
        summary: `${ticker} has declined to ${priceStr}, falling ${pnlStr} below your average buy price of ${costStr}. Key technical support is compromised.`,
        recommendedAction: `Re-evaluate your initial investment thesis. If support is broken, strictly execute your defensive stop-loss rules to prevent deeper capital erosion.`,
        educationalTip: 'Cutting small losses is the defining hallmark of professional investors. It takes a 100% gain to recover from a 50% loss.',
        reasonSummary: `Drawdown exceeds defensive threshold (${pnlStr})`,
        reasonDetail: `Position has dropped below your ${costStr} cost basis. Limiting drawdown now preserves capital for higher-conviction opportunities.`,
        reasonAnalogy: 'Fastening your seatbelt during sudden turbulence to protect against severe impact.',
        costBasisFeedback: `Down ${pnlStr} below your ${costStr} avg cost. Review your risk limits and prepare a defensive exit if support fails.`
      };
    case 'DCA_DIP':
      return {
        title: `DCA Dip Window (${pnlStr} below Cost)`,
        summary: `${ticker} is trading at ${priceStr}, a ${Math.abs(pnlPercent).toFixed(1)}% discount below your ${costStr} average buy price, while technical indicators signal an oversold support bounce zone.`,
        recommendedAction: `If your long-term fundamental thesis remains solid, accumulating a small tranche here allows you to dollar-cost average and reduce your break-even cost basis below ${costStr}.`,
        educationalTip: 'Dollar-cost averaging into dips only works when done deliberately at proven technical support levels—never blindly average down on broken businesses.',
        reasonSummary: `Discounted below avg cost + oversold support (${pnlStr})`,
        reasonDetail: `Price is favorably discounted compared to your ${costStr} purchase price, while momentum indicators signal seller exhaustion.`,
        reasonAnalogy: 'Buying top-grade inventory on seasonal discount to lower your overall unit cost.',
        costBasisFeedback: `Trading ${Math.abs(pnlPercent).toFixed(1)}% below your ${costStr} cost basis in an oversold bounce zone. Good DCA window.`
      };
    case 'HOLD_PROFIT':
      return {
        title: `Holding Steady (${pnlStr} Profit Cushion)`,
        summary: `${ticker} is performing solidly at +${pnlPercent.toFixed(1)}% above your average purchase price of ${costStr}. Upward trend structure remains healthy and intact.`,
        recommendedAction: `Hold and let your winner run. Move your mental stop-loss up to break-even (${costStr}) to guarantee a risk-free trade while riding the trend.`,
        educationalTip: 'The biggest mistake retail investors make is selling their winners too quickly while stubbornly holding their losers.',
        reasonSummary: `Comfortable profit cushion (${pnlStr})`,
        reasonDetail: `Your ${costStr} entry price is well-protected by current market levels, allowing you to ride the primary trend with minimal stress.`,
        reasonAnalogy: 'Sitting in a well-built cruise ship with calm waters and favorable winds.',
        costBasisFeedback: `Position is up ${pnlStr} from your ${costStr} cost basis. Trend is constructive—let winners run.`
      };
    case 'ACCUMULATE':
    default:
      return {
        title: `Consolidating Near Cost Basis (${costStr})`,
        summary: `${ticker} is hovering within range of your entry price (${costStr} vs ${priceStr}, ${pnlStr}). Price is building energy for its next directional move.`,
        recommendedAction: `Hold existing position. Refrain from adjusting size until volume confirms a breakout above resistance or breakdown below support.`,
        educationalTip: 'During sideways consolidation near your entry, patience is the highest-value discipline. Avoid churn and unnecessary transaction fees.',
        reasonSummary: `Trading near breakeven cost (${pnlStr})`,
        reasonDetail: `Price is consolidating near your ${costStr} purchase price as bulls and bears fight for trend dominance.`,
        reasonAnalogy: 'Pausing at a checkpoint before the road begins its steep climb.',
        costBasisFeedback: `Trading near your ${costStr} purchase price. Hold steady and await a definitive directional breakout.`
      };
  }
}

export interface LocalizedAssetStrategyTexts {
  badge: string;
  title: string;
  summary: string;
  reasonSummary: string;
  reasonDetail: string;
  reasonAnalogy: string;
  isBullish: boolean;
}

export function getLocalizedAssetStrategy(
  assetClass: AssetClass,
  ticker: string,
  name: string,
  lang: SupportedLanguage
): LocalizedAssetStrategyTexts {
  if (lang === 'ko') {
    switch (assetClass) {
      case 'INDEX_ETF':
        return {
          badge: '🛡️ 대표 지수 ETF 전략',
          title: '광범위 지수 펀드: 장기 복리 & 조정 시 적립식 매수(DCA)',
          summary: `${name}(${ticker})는 수백 개 핵심 기업으로 구성된 지수 펀드입니다. 단일 기업 파산 위험이 없으므로 지수 조정장은 공포 매도가 아닌 장기 적립 기회입니다.`,
          reasonSummary: '지수형 ETF 자산군: 시스템 분산 & 복리 엔진',
          reasonDetail: '개별 종목의 사업 리스크(경영진 교체, 실적 쇼크)가 원천 차단되어 있으며, 장기 우상향하는 경제 성장을 온전히 향유합니다.',
          reasonAnalogy: '사과 한 알에 전 재산을 거는 대신, 온 나라의 과수원 지분을 골고루 사들이는 것.',
          isBullish: true
        };
      case 'SECTOR_ETF':
        return {
          badge: '🎯 섹터 / 테마 ETF 전략',
          title: '업종 테마 ETF: 산업 사이클 순환 & 분할 익절',
          summary: `${name}(${ticker})는 특정 산업 분야에 집중 투자하는 테마 ETF입니다. 단일 기업 위험은 낮추지만 산업 고유의 경기 사이클 변동성에 유의해야 합니다.`,
          reasonSummary: '섹터 ETF 자산군: 특정 산업 집중 분산',
          reasonDetail: '업종 내 개별 기업 파산 위험은 피할 수 있으나, 산업 전체의 다운사이클 시 지속적인 조정이 발생할 수 있습니다.',
          reasonAnalogy: '조선소 한 곳이 아닌 전 세계 모든 조선소에 분산 투자하여 개별 조선소 침몰 위험을 없애는 것.',
          isBullish: true
        };
      case 'LEVERAGED_ETF':
        return {
          badge: '⚡ 레버리지 / 인버스 ETF 전략',
          title: '레버리지 ETF: 단기 모멘텀 트레이딩 전용 (복리 음(-)의 왜곡 주의)',
          summary: `${name}(${ticker})는 일일 수익률을 배수로 추종합니다. 횡보장에서는 변동성 잠식(Volatility Decay)으로 장기 보유 시 원금이 녹아내립니다.`,
          reasonSummary: '레버리지 파생 ETF: 장기 보유 절대 불가 / 단기 전용',
          reasonDetail: '매일 포지션을 재조정하는 특성상 횡보 구간에서 원금이 지속적으로 감소하므로 절대 가치투자의 대상이 될 수 없습니다.',
          reasonAnalogy: '단거리 레이싱용 특수 니트로 연료: 순간 가속은 폭발적이나 탱크에 오래 두면 증발해 버림.',
          isBullish: false
        };
      case 'STOCK':
      default:
        return {
          badge: '🏢 개별 주식 전략',
          title: '개별 기업 주식: 철저한 리스크 관리 & 엄격한 손절/분할 익절',
          summary: `${name}(${ticker})는 개별 기업입니다. 실적 악화, 경쟁 격화 등 기업 고유의 리스크가 존재하므로 원금 보호를 위한 손절 규율과 목표 수익 실현이 필수적입니다.`,
          reasonSummary: '개별 주식 자산군: 기업 고유 리스크 관리 필수',
          reasonDetail: '지수와 달리 한 번 망가진 개별 기업은 영원히 회복되지 못할 수 있으므로, 엄격한 손절매(-7%~-10%)와 비중 조절이 계좌를 지킵니다.',
          reasonAnalogy: '날렵한 모터보트 운전: 속도는 빠르고 스릴 넘치지만 항상 구명조끼를 입고 파도를 주시해야 함.',
          isBullish: false
        };
    }
  }

  if (lang === 'zh-TW' || lang === 'zh-CN') {
    const isTW = lang === 'zh-TW';
    switch (assetClass) {
      case 'INDEX_ETF':
        return {
          badge: isTW ? '🛡️ 大盤指數型 ETF 策略' : '🛡️ 大盘指数型 ETF 策略',
          title: isTW ? '大盤指數基金：長期複利 ＆ 逢低分批加碼 (DCA)' : '大盘指数基金：长期复利 ＆ 逢低分批加码 (DCA)',
          summary: isTW 
            ? `${name}（${ticker}）是由數百家頂尖企業組成的一籃子大盤基金。無單一企業倒閉風險，拉回修正正是分批攤平擴大複利的良機。`
            : `${name}（${ticker}）是由数百家顶尖企业组成的一篮子大盘基金。无单一企业倒闭风险，回调修正正是分批加仓扩大复利的良机。`,
          reasonSummary: isTW ? '指數型 ETF 資產類別：系統性分散 ＆ 複利引擎' : '指数型 ETF 资产类别：系统性分散 ＆ 复利引擎',
          reasonDetail: isTW 
            ? '消除單一公司特有風險（財報暴雷、經營層更迭），長期完整享受經濟成長與科技創新的果實。'
            : '消除单一公司特有风险（财报暴雷、经营层更迭），长期完整享受经济成长与科技创新的果实。',
          reasonAnalogy: isTW ? '與其把身家押在單一一棵蘋果樹，不如買下整座國家級果園的股權。' : '与其把身家押在单单一棵苹果树，不如买下整座国家级果园的股权。',
          isBullish: true
        };
      case 'SECTOR_ETF':
        return {
          badge: isTW ? '🎯 產業 / 主題型 ETF 策略' : '🎯 产业 / 主题型 ETF 策略',
          title: isTW ? '產業主題 ETF：順應景氣循環 ＆ 梯次獲利了結' : '产业主题 ETF：顺应景气循环 ＆ 梯次获利了结',
          summary: isTW 
            ? `${name}（${ticker}）聚焦特定產業。雖免除了單一公司暴雷風險，但仍受該行業景氣榮枯週期的影響。`
            : `${name}（${ticker}）聚焦特定产业。虽免除了单一公司暴雷风险，但仍受该行业景气荣枯周期的影响。`,
          reasonSummary: isTW ? '產業 ETF：行業集中度高之分散投資' : '产业 ETF：行业集中度高之分散投资',
          reasonDetail: isTW 
            ? '能避開行業中個別失敗者，但在產業景氣下行時仍會面臨整體估值回調。'
            : '能避开行业中个别失败者，但在产业景气下行时仍会面临整体估值回调。',
          reasonAnalogy: isTW ? '投資整支遠洋捕魚船隊：不怕單艘船漏水，但仍須防範海上暴風雨。' : '投资整支远洋捕鱼船队：不怕单艘船漏水，但仍须防范海上暴风雨。',
          isBullish: true
        };
      case 'LEVERAGED_ETF':
        return {
          badge: isTW ? '⚡ 槓桿 / 反向型 ETF 策略' : '⚡ 杠杆 / 反向型 ETF 策略',
          title: isTW ? '槓桿型 ETF：僅限極短線波段操作（嚴防波動損耗）' : '杠杆型 ETF：仅限极短线波段操作（严防波动损耗）',
          summary: isTW 
            ? `${name}（${ticker}）具有每日動態再平衡特性。盤整震盪市場中會有嚴重的波動率損耗，切忌長線無腦死抱！`
            : `${name}（${ticker}）具有每日动态再平衡特性。盘整震荡市场中会有严重的波动率损耗，切忌长线无脑死抱！`,
          reasonSummary: isTW ? '槓桿衍生 ETF：絕不可長線持有 / 嚴格短打' : '杠杆衍生 ETF：绝不可长线持有 / 严格短打',
          reasonDetail: isTW 
            ? '每日倍數重置機制的數學特性會導致雙向盤整時淨值持續流失（Beta Slippage）。'
            : '每日倍数重置机制的数学特性会导致双向盘整时净值持续流失（Beta Slippage）。',
          reasonAnalogy: isTW ? '如同百米衝刺專用氮氣火箭：爆發力極強，但留在油箱裡會迅速揮發殆盡。' : '如同百米冲刺专用氮气火箭：爆发力极强，但留在油箱里会迅速挥发殆尽。',
          isBullish: false
        };
      case 'STOCK':
      default:
        return {
          badge: isTW ? '🏢 個別公司股票策略' : '🏢 个别公司股票策略',
          title: isTW ? '個別股票：嚴格停損本金防禦 ＆ 高檔分批停利' : '个别股票：严格止损本金防御 ＆ 高档分批止盈',
          summary: isTW 
            ? `${name}（${ticker}）為個別企業，承受財報不如預期、行業競爭等獨特風險。務必嚴格執行停損（-7%～-10%）以保全資本。`
            : `${name}（${ticker}）为个别企业，承受财报不如预期、行业竞争等独特风险。务必严格执行止损（-7%～-10%）以保全资本。`,
          reasonSummary: isTW ? '個股資產：特有風險較高，必須恪守紀律' : '个股资产：特有风险较高，必须恪守纪律',
          reasonDetail: isTW 
            ? '個股可能永久失去競爭力甚至倒閉，因此不可像指數一樣無條件無腦攤平，停損是交易者唯一的保護傘。'
            : '个股可能永久失去竞争力甚至倒闭，因此不可像指数一样无条件无脑摊平，止损是交易者唯一的保护伞。',
          reasonAnalogy: isTW ? '駕駛高性能快艇：機動性強爆發力大，但隨時要穿好救生衣、嚴密監控海況。' : '驾驶高性能快艇：机动性强爆发力大，但随时要穿好救生衣、严密监控海况。',
          isBullish: false
        };
    }
  }

  // English fallback
  switch (assetClass) {
    case 'INDEX_ETF':
      return {
        badge: '🛡️ Broad Index ETF Strategy',
        title: 'Broad Market Index ETF: Compounding & Aggressive Dip DCA',
        summary: `${name} (${ticker}) is a self-cleansing basket of hundreds of top corporations. It carries zero single-company bankruptcy risk. Market drawdowns are prime accumulation windows, not panic-sell triggers.`,
        reasonSummary: 'Asset Strategy: Systematic Market Diversification & Compounding',
        reasonDetail: 'Company-specific failures (scandals, quarterly earnings misses) are naturally neutralized. Long-term performance reflects the collective economic output of human innovation.',
        reasonAnalogy: 'Owning a share of the entire nation\'s orchard rather than betting your savings on a single fruit tree.',
        isBullish: true
      };
    case 'SECTOR_ETF':
      return {
        badge: '🎯 Sector & Thematic ETF Strategy',
        title: 'Sector ETF: Industry Cycles & Prudent Rebalancing',
        summary: `${name} (${ticker}) concentrates on a specific economic sector. While it protects you from individual company failure, it remains subject to broader industry cycles.`,
        reasonSummary: 'Asset Strategy: Industry Sector Concentration',
        reasonDetail: 'Eliminates single-firm risk within the sector, but thematic downturns can last multiple quarters. Trim into euphoric industry cycles.',
        reasonAnalogy: 'Investing in the entire commercial shipping fleet: safe from any one ship leaking, but still vulnerable to stormy seas.',
        isBullish: true
      };
    case 'LEVERAGED_ETF':
      return {
        badge: '⚡ Leveraged / Inverse ETF Strategy',
        title: 'Leveraged ETF: Tactical Short-Term Trades Only (High Decay Risk)',
        summary: `${name} (${ticker}) resets leverage daily. During choppy sideways markets, volatility decay (beta slippage) erodes principal. Never use as a buy-and-hold vehicle!`,
        reasonSummary: 'Asset Strategy: High Volatility Decay / Short-Term Tactical Only',
        reasonDetail: 'Daily compounding mathematics mean choppy markets eat away at share price over time. Only suitable for experienced swing traders holding days, not years.',
        reasonAnalogy: 'Like nitro racing fuel: explosive thrust in a sprint, but it evaporates rapidly if left sitting in the tank.',
        isBullish: false
      };
    case 'STOCK':
    default:
      return {
        badge: '🏢 Individual Stock Strategy',
        title: 'Individual Stock: Active Thesis Monitoring & Strict Stop-Losses',
        summary: `${name} (${ticker}) is a single operating company subject to idiosyncratic business risks. Strict capital preservation (cutting losses at -7% to -10%) and position sizing limits are vital.`,
        reasonSummary: 'Asset Strategy: Company-Specific Risk & Capital Defense',
        reasonDetail: 'Unlike broad indexes, broken companies may never recover. Disciplined stop-losses protect against permanent loss of capital.',
        reasonAnalogy: 'Piloting a high-speed speedboat: agile and thrilling, but you must keep your hands on the wheel and lifejacket on at all times.',
        isBullish: false
      };
  }
}

