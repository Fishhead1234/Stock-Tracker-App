import { EducationLesson, GlossaryItem, QuizQuestion } from '../types/education';
import { SupportedLanguage } from '../i18n/translations';

// English Base
import { LESSONS as EN_LESSONS, GLOSSARY as EN_GLOSSARY, QUIZ_QUESTIONS as EN_QUIZ } from './educationData';

export const KO_LESSONS: EducationLesson[] = [
  {
    id: 'lesson-rsi',
    title: 'RSI: 고무줄 지표의 원리',
    category: 'Technical Timing',
    readTime: '3분 소요',
    summary: '상대강도지수(RSI)를 통해 상투권 매수를 방지하고 과매도 저평가 구간을 선별하는 방법을 배워보세요.',
    content: [
      '상대강도지수(RSI)는 0부터 100까지의 척도로 최근 주가 변동의 속도와 강도를 측정합니다.',
      'RSI를 당겨진 고무줄로 생각해보세요. 고무줄을 너무 높게(70 이상) 당기면, 차익 실현 매도세가 등장해 아래로 끌어당깁니다 — 이를 "과매수"라고 부릅니다.',
      '반대로 고무줄을 너무 아래로(30 이하) 잡아당기면, 매도세가 소진되고 저가 매수세가 유입됩니다 — 이를 "과매도"라고 합니다.',
      '초보자를 위한 실전 규칙: RSI가 75를 넘을 때는 추격 매수를 자제하세요. 건강한 눌림목 조정을 기다리는 것이 리스크를 줄입니다.'
    ],
    beginnerTakeaway: '인기 없고 소외된 저점(RSI < 35)에 분할 매수하고, 시장이 환호하는 최고점(RSI > 70)에서는 신중해지세요.',
    iconName: 'Activity'
  },
  {
    id: 'lesson-macd',
    title: 'MACD: 상승 모멘텀의 파도 타기',
    category: 'Technical Timing',
    readTime: '4분 소요',
    summary: '이동평균 수렴확산(MACD)이 주가의 가속도를 측정하는 속도계 역할을 하는 원리를 알아봅니다.',
    content: [
      'MACD는 12일 단기 지수이동평균과 26일 장기 지수이동평균 간의 관계를 추적합니다.',
      '단기선이 신호선(시그널)을 아래에서 위로 뚫고 올라갈 때를 "골든 크로스(매수 신호)"라고 하며, 마치 스포츠카가 가속 페달을 밟는 것과 같습니다.',
      '반대로 단기선이 신호선 아래로 떨어질 때는 "데드 크로스"로, 모멘텀이 둔화되고 있어 주의가 필요합니다.',
      'MACD는 "오늘 시장의 매수세가 더 강해지고 있는가, 아니면 힘이 빠지고 있는가?"에 답을 줍니다.'
    ],
    beginnerTakeaway: '조정 국면 후 나타나는 MACD 골든 크로스는 매수세가 시장의 주도권을 되찾았다는 가장 명확한 신호 중 하나입니다.',
    iconName: 'TrendingUp'
  },
  {
    id: 'lesson-moving-averages',
    title: '이동평균선: 기관 투자자의 바닥 지지선',
    category: 'Technical Timing',
    readTime: '4분 소요',
    summary: '월가 헤지펀드와 국민연금 등 대형 기관이 50일선과 200일 이동평균선을 면밀히 주시하는 이유를 알아봅니다.',
    content: [
      '단순이동평균(SMA)은 일정 기간(예: 50일, 200일) 동안의 종가 평균을 계산하여 일일 시장 소음을 걸러냅니다.',
      '50일 이동평균선은 중기 추세의 강력한 지지선 역할을 합니다. 건전한 주식은 상승 추세 중 눌림목에서 이 선을 딛고 반등합니다.',
      '200일선은 대세 상승과 하락을 가르는 기준선입니다. 200일선 위는 장기 강세장, 아래는 약세 국면을 나타냅니다.',
      '골든크로스: 50일선이 200일선을 상향 돌파하면 장기 상승 전환을 뜻하며, 데드크로스는 그 반대입니다.'
    ],
    beginnerTakeaway: '언제나 50일선과 200일선의 위치를 확인하세요. 지지선 부근에서 매수할 때 손익비가 가장 우수합니다.',
    iconName: 'LineChart'
  },
  {
    id: 'lesson-risk-management',
    title: '제1원칙: 자본 보존과 분할 매수(DCA)',
    category: 'Risk Management',
    readTime: '3분 소요',
    summary: '정기 분할 매수(DCA)와 철저한 비중 관리가 감정적 패닉 셀링을 어떻게 막아주는지 배웁니다.',
    content: [
      '초보 투자자의 가장 큰 적은 감정입니다: 고점 환호에 추격 매수(FOMO)하고 공포의 하락장에서 손절 투매하는 것입니다.',
      '분할 매수(DCA): 모든 자금을 한 번에 올인하지 말고, 자금을 나누어 주기적 또는 눌림목마다 분할 매수하세요.',
      '포지션 비중 원칙: 개별 변동성이 큰 단일 종목에 총 투자 자산의 5~10% 이상을 한 번에 몰빵하지 마세요.',
      '손절매 원칙: 진입 전 감내할 수 있는 최대 손실선(예: -7% ~ -10%)을 미리 정해 두어 치명적인 계좌 파격을 방지하세요.'
    ],
    beginnerTakeaway: '투자의 제1원칙은 시장에서 살아남는 것입니다. 단 한 번의 실패로 자신감과 원금을 잃지 마세요.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'lesson-volume',
    title: '거래량: 시장의 진짜 매수세 확인',
    category: 'Fundamentals',
    readTime: '3분 소요',
    summary: '거래량이 실리지 않은 가격 상승은 함정일 수 있습니다. 거래량을 통해 기관의 매집을 포착하세요.',
    content: [
      '거래량은 특정 거래일 동안 매매된 주식의 총 거래 수량입니다.',
      '주가가 20일 평균 대비 2배 이상의 대량 거래량을 동반하며 급등한다면, 대형 기관과 헤지펀드가 진입하고 있을 확률이 높습니다.',
      '반대로 거래량이 극도로 적은 상태에서의 반등은 추진력이 부족해 다음 날 쉽게 꺾일 수 있습니다.',
      '핵심 지지선에서 거래량이 급증하는 것은 매수 주체가 가격을 지켜내고 있다는 강력한 증거입니다.'
    ],
    beginnerTakeaway: '높은 거래량은 가격 추세를 확인해주고, 낮은 거래량은 확신 부족이나 일시적 반등임을 경고합니다.',
    iconName: 'BarChart2'
  }
];

export const KO_GLOSSARY: GlossaryItem[] = [
  {
    term: 'RSI (상대강도지수)',
    shortDef: '최근 가격 변동의 강도와 속도를 0~100 척도로 나타내는 모멘텀 보조지표.',
    fullExplanation: 'J. Welles Wilder가 개발한 지표로, 70 이상이면 과매수, 30 이하이면 과매도로 분류됩니다. 초보자가 과도하게 오른 가격을 추격 매수하는 실수를 예방해줍니다.',
    analogy: '시계추의 진동과 같습니다. 한쪽으로 너무 크게 올라가면 중력에 의해 중심부로 되돌아오게 됩니다.',
    relatedIndicators: ['MACD', '스토캐스틱'],
    tag: 'Technical'
  },
  {
    term: 'MACD (이동평균수렴확산)',
    shortDef: '두 개의 가격 이동평균선 간의 관계를 보여주는 추세 추종 모멘텀 지표.',
    fullExplanation: '12일 단기 지수이동평균에서 26일 장기 지수이동평균을 뺀 값입니다. 9일 시그널선을 겹쳐 매수 및 매도 타이밍을 포착합니다.',
    analogy: '달리기 트랙 위의 두 주자와 같습니다. 단거리 선수가 마라톤 선수를 추월할 때 추진력이 폭발합니다.',
    relatedIndicators: ['RSI', '이동평균선'],
    tag: 'Technical'
  },
  {
    term: 'DCA (정기 분할 매수법)',
    shortDef: '주가 등락과 무관하게 일정한 주기로 일정한 금액을 꾸준히 매수하는 투자 기법.',
    fullExplanation: '오를 때와 내릴 때 고르게 매수함으로써 가격이 저렴할 때는 더 많은 주식을, 비쌀 때는 적은 주식을 사게 되어 평균 매수 단가가 낮아집니다.',
    analogy: '매주 마트에서 고정 예산으로 장을 보는 것과 같습니다. 사과가 할인할 때는 더 많이 사고, 비쌀 때는 덜 사서 평균 가격을 낮춥니다.',
    relatedIndicators: [],
    tag: 'Strategy'
  },
  {
    term: '골든 크로스 (Golden Cross)',
    shortDef: '단기 이동평균선(50일선)이 장기 이동평균선(200일선)을 아래에서 위로 뚫고 올라가는 강세 패턴.',
    fullExplanation: '장기 상승장으로의 전환을 의미합니다. 많은 알고리즘 펀드와 기관들이 골든 크로스 형성 시 체계적으로 비중을 확대합니다.',
    analogy: '추운 겨울이 끝나고 찾아오는 첫 봄 햇살: 따뜻한 상승 추세가 본격적으로 시작되었음을 확인해줍니다.',
    relatedIndicators: ['이동평균선', 'SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: '데드 크로스 (Death Cross)',
    shortDef: '50일 이동평균선이 200일선 아래로 하향 이탈하는 대표적인 약세 신호 패턴.',
    fullExplanation: '최근 주가 하락 속도가 장기 평균보다 빨라져 중장기적인 하방 압력이 지속될 수 있음을 시사합니다.',
    analogy: '먹구름이 몰려오고 폭풍우가 시작될 것임을 알리는 비상 경보 사이렌.',
    relatedIndicators: ['이동평균선', 'SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: 'PER (주가수익비율)',
    shortDef: '주가를 주당순이익(EPS)으로 나눈 값으로 기업의 밸류에이션을 평가하는 대표 지표.',
    fullExplanation: '기업이 벌어들이는 순이익 1원당 투자자들이 얼마를 지불하고 있는지를 보여줍니다. 높은 PER은 고성장 기대를, 낮은 PER은 저평가 또는 성숙기를 뜻합니다.',
    analogy: '연 1천만 원을 버는 작은 빵집을 1억 원에 인수한다면 PER은 10배입니다.',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: '시가총액 (Market Cap)',
    shortDef: '기업이 발행한 총 주식수에 현재 주가를 곱한 회사의 총 시장 가치.',
    fullExplanation: '발행주식수 × 현재 주가. 초대형주(200조 이상), 대형주(10조 이상), 중형주(2조~10조), 소형주(2조 미만)로 구분됩니다.',
    analogy: '오늘 당장 회사의 모든 자산과 공장을 통째로 인수할 때 지불해야 하는 가격표.',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: '손절매 (Stop-Loss)',
    shortDef: '주가가 사전에 정한 가격까지 하락하면 자동으로 매도하여 손실을 제한하는 방어 주문.',
    fullExplanation: '계좌를 지키는 핵심 리스크 관리 도구입니다. 100달러에 사서 92달러에 스탑로스를 걸어두면 최대 손실을 8%로 통제할 수 있습니다.',
    analogy: '자전거가 내리막길에서 폭주할 때 잡아당기는 비상 브레이크.',
    relatedIndicators: [],
    tag: 'Strategy'
  }
];

export const KO_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: '주가가 단기간에 가파르게 상승하여 RSI(상대강도지수)가 82에 도달했습니다. 초보 투자자가 취해야 할 올바른 관점은?',
    options: [
      '상승 모멘텀이 매우 강하므로 즉시 전액 매수해야 한다.',
      '과매수 구간에 진입했으므로 단기 차익 실현 및 눌림목 조정이 나타날 가능성이 높다.',
      '기업의 실제 순이익이 하룻밤 사이에 두 배로 증가했음을 보증한다.',
      '증권 거래소가 곧 거래를 일시 정지시킬 예정이다.'
    ],
    correctIndex: 1,
    explanation: 'RSI 70 이상은 과매수 구간입니다. 강한 종목은 과매수 상태를 유지하기도 하지만, 80을 넘는 구간에서의 추격 매수는 급락의 위험이 높습니다.'
  },
  {
    id: 'q2',
    question: '일봉 차트에서 나타나는 "골든 크로스"의 의미는 무엇인가요?',
    options: [
      '금(Gold) 시세가 주식 시장 수익률을 앞지를 때.',
      '50일 이동평균선이 200일 이동평균선을 아래에서 위로 뚫고 올라갈 때.',
      '주가가 정확히 100.00달러에 도달했을 때.',
      '기업이 주주들에게 특별 배당금을 지급할 때.'
    ],
    correctIndex: 1,
    explanation: '골든 크로스는 50일 단순이동평균선이 200일선을 상향 돌파할 때 발생하며, 중장기적인 상승 추세 전환을 알리는 긍정적 신호입니다.'
  },
  {
    id: 'q3',
    question: '원칙 있는 투자자들이 분할 매수(DCA)를 활용하는 가장 주된 이유는 무엇인가요?',
    options: [
      '언제나 시장의 가장 최상단 고점에서 매도할 수 있도록 보장해주기 때문.',
      '주식 매매에 따른 세금을 완전히 면제받기 때문.',
      '감정적 스트레스를 없애고 불가능한 단기 바닥 맞추기 도박을 피하기 위함.',
      '증권사로부터 무상 보너스 주식을 지급받기 위함.'
    ],
    correctIndex: 2,
    explanation: '분할 매수(DCA)는 감정적인 추측 매매를 없애줍니다. 일정 금액을 꾸준히 매수하여 자연스럽게 평균 단가를 낮추고 리스크를 분산합니다.'
  }
];

export const ZH_TW_LESSONS: EducationLesson[] = [
  {
    id: 'lesson-rsi',
    title: 'RSI：橡皮筋法則指標',
    category: 'Technical Timing',
    readTime: '3 分鐘閱讀',
    summary: '了解相對強弱指標 (RSI) 如何幫助您避開高點追價陷阱，並精準識別超賣超跌的價值區間。',
    content: [
      '相對強弱指標 (RSI) 在 0 到 100 的數值區間內，衡量近期價格波動的速度與幅度。',
      '將 RSI 想像成一條被拉伸的橡皮筋。如果拉得太高（超過 70），獲利了結賣壓通常會將其拉回——這被稱為「超買」。',
      '若橡皮筋被過度向下拉伸（低於 30），賣方力竭，逢低買盤進場尋找便宜籌碼——這被稱為「超賣」。',
      '新手實戰金律：當 RSI 超過 75 時切勿衝動追高，耐心等待健康拉回以降低進場風險。'
    ],
    beginnerTakeaway: '在市場冷清超賣時（RSI < 35）分批逢低布局，在市場過熱亢奮時（RSI > 70）保持警覺。',
    iconName: 'Activity'
  },
  {
    id: 'lesson-macd',
    title: 'MACD：乘上動能的浪潮',
    category: 'Technical Timing',
    readTime: '4 分鐘閱讀',
    summary: '探索指數平滑異同移動平均線 (MACD) 如何充當股價動能的「速度計」。',
    content: [
      'MACD 追蹤兩條均線的互動：一條是快速的 12 日指數均線，另一條是慢速的 26 日指數均線。',
      '當快線由下往上穿過慢速訊號線時，形成「黃金交叉」——如同跑車加速超車。',
      '當快線跌破訊號線時，形成「死亡交叉」——意味動能正在減弱，操作宜轉為審慎。',
      'MACD 幫助回答關鍵問題：「今天的買盤力道是正在增強，還是正在衰竭？」'
    ],
    beginnerTakeaway: '下跌修正後出現的 MACD 黃金交叉，是買方奪回行情主導權最可靠的早期訊號之一。',
    iconName: 'TrendingUp'
  },
  {
    id: 'lesson-moving-averages',
    title: '均線系統：機構投資人的防守支撐線',
    category: 'Technical Timing',
    readTime: '4 分鐘閱讀',
    summary: '為何華爾街避險基金與大型機構法人生死盯住 50 日均線（季線）與 200 日均線（年線）。',
    content: [
      '簡單移動平均線 (SMA) 透過計算特定天數的收盤價平均，過濾掉單日市場隨機噪音。',
      '50 日均線代表中期趨勢防守線。強勢股在多頭拉回時，常在此線獲得支撐並展開反彈。',
      '200 日均線是多空宏觀分水嶺：站在其上代表處於長期多頭架構，跌破則處於空頭弱勢格局。',
      '黃金交叉：當 50 日線突破 200 日線時，確立長期正向多頭走勢；死亡交叉則相反。'
    ],
    beginnerTakeaway: '隨時掌握 50 日線與 200 日線位置。在動態均線支撐附近布局，擁有最佳的風險報酬比。',
    iconName: 'LineChart'
  },
  {
    id: 'lesson-risk-management',
    title: '第一法則：資本保全與定期定額 (DCA)',
    category: 'Risk Management',
    readTime: '3 分鐘閱讀',
    summary: '定期定額與部位控管如何保護您免於情緒化恐慌殺跌。',
    content: [
      '新手投資者最大的敵人是情緒：在市場亢奮時盲目追價 (FOMO)，在大盤重挫時恐慌砍在最低點。',
      '定期定額 (DCA)：不要一次性把資金全數投入，將資金分拆為小份額（例如每月固定或在每次拉回時分批買入）。',
      '部位控管原則：任何單一高波動個股的投資金額，絕不要超過個人總淨資產的 5% 到 10%。',
      '停損防護線：在進場前設定好願意承受的最大虧損（例如 -7% 到 -10%），防止單一錯誤損及整體資產。'
    ],
    beginnerTakeaway: '投資最重要的原則是先活下來。切勿因為一次單押錯誤而失去本金與信心。',
    iconName: 'ShieldCheck'
  },
  {
    id: 'lesson-volume',
    title: '成交量：確認市場真實買盤意圖',
    category: 'Fundamentals',
    readTime: '3 分鐘閱讀',
    summary: '缺乏成交量支持的價格上漲可能是誘多陷阱。透過成交量洞察法人的吸籌足跡。',
    content: [
      '成交量是特定交易日內買賣雙方搓合成交的股票總股數。',
      '若股價大漲且成交量爆發超過 20 日均量的兩倍以上，通常代表法人機構正在大舉建倉。',
      '相反地，若縮量反彈，代表推升動能不足，次日極易面臨賣壓反轉。',
      '在關鍵均線支撐處爆出放量紅 K 棒，是主力積極守護支撐防線的強力證據。'
    ],
    beginnerTakeaway: '成交量能確認趨勢真偽。高量代表真實信心，低量則預警動能不足或僅為短線反彈。',
    iconName: 'BarChart2'
  }
];

export const ZH_CN_LESSONS: EducationLesson[] = [
  {
    id: 'lesson-rsi',
    title: 'RSI：橡皮筋法则指标',
    category: 'Technical Timing',
    readTime: '3 分钟阅读',
    summary: '了解相对强弱指标 (RSI) 如何帮助您避开高点追涨陷阱，并精准识别超卖低估的价值区间。',
    content: [
      '相对强弱指标 (RSI) 在 0 到 100 的数值区间内，衡量近期价格波动的速度与幅度。',
      '将 RSI 想象成一条被拉伸的橡皮筋。如果拉得太高（超过 70），获利盘卖压通常会将其拉回——这被称为“超买”。',
      '若橡皮筋被过度向下拉伸（低于 30），卖方力竭，逢低买盘进场寻找便宜筹码——这被称为“超卖”。',
      '新手实战金律：当 RSI 超过 75 时切勿冲动追高，耐心等待健康回调以降低建仓风险。'
    ],
    beginnerTakeaway: '在市场冷清超卖时（RSI < 35）分批逢低布局，在市场过热亢奋时（RSI > 70）保持警惕。',
    iconName: 'Activity'
  },
  {
    id: 'lesson-macd',
    title: 'MACD：乘上动能的浪潮',
    category: 'Technical Timing',
    readTime: '4 分钟阅读',
    summary: '探索指数平滑异同移动平均线 (MACD) 如何充当股价动能的“速度计”。',
    content: [
      'MACD 追踪两条均线的互动：一条是快速的 12 日指数均线，另一条是慢速的 26 日指数均线。',
      '当快线由下往上穿过慢速信号线时，形成“金叉”——如同跑车加速超车。',
      '当快线跌破信号线时，形成“死叉”——意味动能正在减弱，操作宜转为谨慎。',
      'MACD 帮助回答关键问题：“今天的买盘力量是正在增强，还是正在衰竭？”'
    ],
    beginnerTakeaway: '下跌修正后出现的 MACD 金叉，是多头夺回行情主导权最可靠的早期信号之一。',
    iconName: 'TrendingUp'
  },
  {
    id: 'lesson-moving-averages',
    title: '均线系统：机构投资人的防守支撑线',
    category: 'Technical Timing',
    readTime: '4 分钟阅读',
    summary: '为何华尔街对冲基金与大型机构法人生死盯住 50 日均线（季线）与 200 日均线（年线）。',
    content: [
      '简单移动平均线 (SMA) 通过计算特定天数的收盘价平均，过滤掉单日市场随机噪音。',
      '50 日均线代表中期趋势防守线。强势股在多头回调时，常在此线获得支撑并展开反弹。',
      '200 日均线是多空宏观分水岭：站在其上代表处于长期多头架构，跌破则处于空头弱势格局。',
      '金叉：当 50 日线突破 200 日线时，确立长期正向多头走势；死叉则相反。'
    ],
    beginnerTakeaway: '随时掌握 50 日线与 200 日线位置。在动态均线支撑附近布局，拥有最佳的盈亏比。',
    iconName: 'LineChart'
  },
  {
    id: 'lesson-risk-management',
    title: '第一法则：资本保全与定期定额 (DCA)',
    category: 'Risk Management',
    readTime: '3 分钟阅读',
    summary: '定期定额与仓位控管如何保护您免于情绪化恐慌割肉。',
    content: [
      '新手投资者最大的敌人是情绪：在市场亢奋时盲目追涨 (FOMO)，在大盘重挫时恐慌砍在最低点。',
      '定投策略 (DCA)：不要一次性把资金全额打满，将资金分拆为小份额（例如每月固定或在每次回调时分批买入）。',
      '仓位管理原则：任何单一高波动个股的投资金额，绝不要超过个人总净资产的 5% 到 10%。',
      '止损防线：在建仓前设定好愿意承受的最大亏损（例如 -7% 到 -10%），防止单次失误损及整体资产。'
    ],
    beginnerTakeaway: '投资最重要的原则是先活下来。切勿因为一次单押错误而失去本金与信心。',
    iconName: 'ShieldCheck'
  },
  {
    id: 'lesson-volume',
    title: '成交量：确认市场真实买盘意图',
    category: 'Fundamentals',
    readTime: '3 分钟阅读',
    summary: '缺乏成交量支持的价格上涨可能是诱多陷阱。通过成交量洞察主力的吸筹足迹。',
    content: [
      '成交量是特定交易日内买卖双方撮合成交的股票总股数。',
      '若股价大涨且成交量爆发超过 20 日均量的两倍以上，通常代表机构正在大举建仓。',
      '相反地，若缩量反弹，代表推升动能不足，次日极易面临卖压反转。',
      '在关键均线支撑处出现放量阳线，是主力积极守护支撑防线的强力证据。'
    ],
    beginnerTakeaway: '成交量能确认趋势真伪。高量代表真实信心，低量则预警动能不足或仅为短线反抽。',
    iconName: 'BarChart2'
  }
];

export const ZH_TW_GLOSSARY: GlossaryItem[] = [
  {
    term: 'RSI (相對強弱指標)',
    shortDef: '在 0~100 區間內反映近期股價波動強度與速度的動能指標。',
    fullExplanation: '由 J. Welles Wilder 開發，70 以上為超買，30 以下為超賣。幫助新手避開高點追漲殺跌的情緒化交易。',
    analogy: '如同單擺鐘擺，向一側盪得太高時，重力自然會將其拉回平衡中心。',
    relatedIndicators: ['MACD', 'KD 指標'],
    tag: 'Technical'
  },
  {
    term: 'MACD (平滑異同移動平均線)',
    shortDef: '透過兩條指數移動平均線的收斂與發散，判斷中短期趨勢動能的指標。',
    fullExplanation: '以 12 日 EMA 減去 26 日 EMA 計算差離值 (DIF)，並搭配 9 日訊號線 (MACD) 尋找買賣時機交叉點。',
    analogy: '如同跑道上的兩位跑者，短跑選手超越馬拉松選手時，爆發力全面展現。',
    relatedIndicators: ['RSI', '均線系統'],
    tag: 'Technical'
  },
  {
    term: 'DCA (定期定額存股法)',
    shortDef: '無論市場漲跌，在固定週期以固定金額分批買進資產的投資策略。',
    fullExplanation: '透過自動化紀律攤平買進成本。價格高時買得少、價格低時買得多，長期有效降低平均持有成本。',
    analogy: '如同每週以固定預算買蘋果，特價時買得更多，昂貴時買得較少，自然平衡了平均買價。',
    relatedIndicators: [],
    tag: 'Strategy'
  },
  {
    term: '黃金交叉 (Golden Cross)',
    shortDef: '短週期移動平均線（如 50 日季線）由下往上突破長週期均線（如 200 日年線）的多頭形態。',
    fullExplanation: '代表中長期上升多頭趨勢確立，許多主動型基金與量化演算法會在此時啟動結構性加碼買盤。',
    analogy: '如同寒冬結束後的第一道暖春曙光，確認氣溫已進入全面回暖的上升週期。',
    relatedIndicators: ['SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: '死亡交叉 (Death Cross)',
    shortDef: '50 日短期均線向下跌破 200 日長期均線的典型空頭警訊形態。',
    fullExplanation: '代表近期的下跌速度已快於長期趨勢，暗示市場中期可能進入深度修正或長期盤整。',
    analogy: '如同暴風雨前的防空警報，提醒船隻應及時回港或收起風帆。',
    relatedIndicators: ['SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: '本益比 (P/E Ratio)',
    shortDef: '每股市價除以每股盈餘 (EPS)，評估股票估值貴賤的通用指標。',
    fullExplanation: '代表投資人願意為企業賺取每 1 元利潤支付多少倍價格。高本益比代表市場對未來成長寄予厚望，低本益比則代表成熟穩定或價值被低估。',
    analogy: '如果一家年淨利 100 萬的小店開價 1,000 萬轉讓，其本益比即為 10 倍。',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: '總市值 (Market Cap)',
    shortDef: '企業已發行總股數乘以目前每股股價的市場總價值。',
    fullExplanation: '發行股數 × 目前股價。超大型權值股（2,000 億美元以上）、大型股（100 億美元以上）、中型股（20 億~100 億美元）、小型股（20 億美元以下）。',
    analogy: '今天如果要把這家公司的每一塊磚頭與所有資產全部買下來，所需要的總標價。',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: '停損委託 (Stop-Loss Order)',
    shortDef: '當股價跌至預設價位時自動觸發賣出委託，嚴格控制最大下檔虧損。',
    fullExplanation: '防守型風險管理工具。以  買入並設  停損，若不幸跌至  系統將自動賣出，將單筆損失嚴格限制在 8% 以內。',
    analogy: '如同腳踏車在下坡失控時的緊急手煞車，防止摔入懸崖。',
    relatedIndicators: [],
    tag: 'Strategy'
  }
];

export const ZH_CN_GLOSSARY: GlossaryItem[] = [
  {
    term: 'RSI (相对强弱指标)',
    shortDef: '在 0~100 区间内反映近期股价波动强度与速度的动能指标。',
    fullExplanation: '由 J. Welles Wilder 开发，70 以上为超买，30 以下为超卖。帮助新手避开高点追涨杀跌的情绪化交易。',
    analogy: '如同单摆钟摆，向一侧荡得太高时，重力自然会将其拉回平衡中心。',
    relatedIndicators: ['MACD', 'KD 指标'],
    tag: 'Technical'
  },
  {
    term: 'MACD (平滑异同移动平均线)',
    shortDef: '通过两条指数移动平均线的收敛与发散，判断中短期趋势动能的指标。',
    fullExplanation: '以 12 日 EMA 减去 26 日 EMA 计算差离值 (DIF)，并搭配 9 日信号线 (MACD) 寻找买卖时机交叉点。',
    analogy: '如同跑道上的两位跑者，短跑选手超越马拉松选手时，爆发力全面展现。',
    relatedIndicators: ['RSI', '均线系统'],
    tag: 'Technical'
  },
  {
    term: 'DCA (定期定额定投法)',
    shortDef: '无论市场涨跌，在固定周期以固定金额分批买入资产的投资策略。',
    fullExplanation: '通过自动化纪律摊平买入成本。价格高时买得少、价格低时买得多，长期有效降低平均持有成本。',
    analogy: '如同每周以固定预算买苹果，特价时买得更多，昂贵时买得较少，自然平衡了平均买价。',
    relatedIndicators: [],
    tag: 'Strategy'
  },
  {
    term: '金叉 (Golden Cross)',
    shortDef: '短周期移动平均线（如 50 日均线）由下往上突破长周期均线（如 200 日年线）的多头形态。',
    fullExplanation: '代表中长期上升多头趋势确立，许多主动型基金与量化算法会在此时启动结构性加仓买盘。',
    analogy: '如同寒冬结束后的第一道暖春曙光，确认气温已进入全面回暖的上升周期。',
    relatedIndicators: ['SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: '死叉 (Death Cross)',
    shortDef: '50 日短期均线向下跌破 200 日长期均线的典型空头警示形态。',
    fullExplanation: '代表近期的下跌速度已快于长期趋势，暗示市场中期可能进入深度回调或长期阴跌。',
    analogy: '如同暴风雨前的防空警报，提醒船只应及时回港或收起风帆。',
    relatedIndicators: ['SMA 50', 'SMA 200'],
    tag: 'Technical'
  },
  {
    term: '市盈率 (P/E Ratio)',
    shortDef: '每股市价除以每股收益 (EPS)，评估股票估值贵贱的通用指标。',
    fullExplanation: '代表投资者愿意为企业赚取每 1 元利润支付多少倍价格。高市盈率代表市场对未来成长寄予厚望，低市盈率则代表成熟稳定或价值被低估。',
    analogy: '如果一家年净利 100 万的小店开价 1,000 万转让，其市盈率即为 10 倍。',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: '总市值 (Market Cap)',
    shortDef: '企业已发行总股数乘以当前每股股价的市场总价值。',
    fullExplanation: '发行股数 × 当前股价。超大型龙头股（2,000 亿美元以上）、大盘股（100 亿美元以上）、中盘股（20 亿~100 亿美元）、小盘股（20 亿美元以下）。',
    analogy: '今天如果要把这家公司的每一块砖头与所有资产全部买下来，所需要的总标价。',
    relatedIndicators: [],
    tag: 'Valuation'
  },
  {
    term: '止损指令 (Stop-Loss Order)',
    shortDef: '当股价跌至预设价位时自动触发卖出委托，严格控制最大下行亏损。',
    fullExplanation: '防守型风险管理工具。以  买入并设  止损，若不幸跌至  系统将自动卖出，将单笔损失严格限制在 8% 以内。',
    analogy: '如同自行车在下坡失控时的紧急手刹，防止坠入悬崖。',
    relatedIndicators: [],
    tag: 'Strategy'
  }
];

export const ZH_TW_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: '某檔股票短線急漲，其 RSI (相對強弱指標) 目前來到 82。這對新手投資者而言代表什麼涵義？',
    options: [
      '這檔股票動能極強，保證還會繼續暴漲，應立即追買。',
      '該股已進入嚴重「超買區」，統計上隨時可能出現短線拉回整理。',
      '這代表該公司一夜之間實際獲利翻倍。',
      '證券交易所將立即暫停該股票交易。'
    ],
    correctIndex: 1,
    explanation: 'RSI 高於 70 被歸類為超買區。雖然強勢股在牛市中可能維持超買一段時間，但在 RSI 高於 80 時追價進場，面臨劇烈拉回的風險極高。'
  },
  {
    id: 'q2',
    question: '在股票日線圖上，何謂「黃金交叉 (Golden Cross)」？',
    options: [
      '當黃金期貨價格超越大盤指數表現時。',
      '當 50 日均線（季線）由下往上突破 200 日均線（年線）時。',
      '當股票價格剛好收在整數關卡 .00 時。',
      '當公司宣布發放額外現金股利時。'
    ],
    correctIndex: 1,
    explanation: '當 50 日簡單移動平均線向上突破 200 日移動平均線時，即形成黃金交叉，被視為中長期多頭趨勢確立的經典訊號。'
  },
  {
    id: 'q3',
    question: '為何紀律嚴謹的投資人廣泛採用定期定額 (DCA) 投資法？',
    options: [
      '它能保證您每一次都剛好賣在行情的最高峰。',
      '它可以免除資本利得的所有稅賦。',
      '它能消除情緒焦慮，避免試圖預測不可能預測的短期市場低點。',
      '它能強制券商贈送額外的免費股票。'
    ],
    correctIndex: 2,
    explanation: '定期定額消除了情緒盲點。透過定期固定金額買入，在股價低檔時自動買進更多股數，高檔時買進較少股數，自然平滑持有成本。'
  }
];

export const ZH_CN_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: '某只股票短线急涨，其 RSI (相对强弱指标) 目前来到 82。这对新手投资者而言代表什么涵义？',
    options: [
      '该股动能极强，保证还会继续暴涨，应立即追高。',
      '该股已进入严重“超买区”，统计上随时可能出现短线回调整理。',
      '这代表该企业一夜之间实际盈利翻倍。',
      '证券交易所将立即暂停该股票交易。'
    ],
    correctIndex: 1,
    explanation: 'RSI 高于 70 被归类为超买区。虽然强势股在牛市中可能维持超买一段时间，但在 RSI 高于 80 时追涨进场，面临剧烈回调的风险极高。'
  },
  {
    id: 'q2',
    question: '在股票日线图上，何谓“金叉 (Golden Cross)”？',
    options: [
      '当黄金期货价格超越大盘指数表现时。',
      '当 50 日均线（季线）由下往上突破 200 日均线（年线）时。',
      '当股票价格刚好收在整数关口 .00 时。',
      '当企业宣布发放额外现金股息时。'
    ],
    correctIndex: 1,
    explanation: '当 50 日简单移动平均线向上突破 200 日移动平均线时，即形成金叉，被视为中长期多头趋势确立的经典信号。'
  },
  {
    id: 'q3',
    question: '为何纪律严明的投资人广泛采用定期定额定投 (DCA) 投资法？',
    options: [
      '它能保证您每一次都刚好卖在行情的最高峰。',
      '它可以免除资本利得的所有税负。',
      '它能消除情绪焦虑，避免试图预测不可能预测的短期市场低点。',
      '它能强制券商赠送额外的免费股票。'
    ],
    correctIndex: 2,
    explanation: '定投策略消除了情绪盲点。通过定期固定金额买入，在股价低位时自动买入更多股数，高位时买入较少股数，自然平滑持有成本。'
  }
];

// Localized helpers
export function getLocalizedLessons(lang: SupportedLanguage): EducationLesson[] {
  if (lang === 'ko') return KO_LESSONS;
  if (lang === 'zh-TW') return ZH_TW_LESSONS;
  if (lang === 'zh-CN') return ZH_CN_LESSONS;
  return EN_LESSONS;
}

export function getLocalizedGlossary(lang: SupportedLanguage): GlossaryItem[] {
  if (lang === 'ko') return KO_GLOSSARY;
  if (lang === 'zh-TW') return ZH_TW_GLOSSARY;
  if (lang === 'zh-CN') return ZH_CN_GLOSSARY;
  return EN_GLOSSARY;
}

export function getLocalizedQuiz(lang: SupportedLanguage): QuizQuestion[] {
  if (lang === 'ko') return KO_QUIZ;
  if (lang === 'zh-TW') return ZH_TW_QUIZ;
  if (lang === 'zh-CN') return ZH_CN_QUIZ;
  return EN_QUIZ;
}
