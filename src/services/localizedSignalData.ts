import { SignalAction, SignalReason } from '../types/signal';
import { SupportedLanguage } from '../i18n/translations';

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
