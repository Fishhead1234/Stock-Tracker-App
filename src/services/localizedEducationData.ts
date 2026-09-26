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

// Localized helper
export function getLocalizedLessons(lang: SupportedLanguage): EducationLesson[] {
  if (lang === 'ko') return KO_LESSONS;
  return EN_LESSONS;
}

export function getLocalizedGlossary(lang: SupportedLanguage): GlossaryItem[] {
  if (lang === 'ko') return KO_GLOSSARY;
  return EN_GLOSSARY;
}

export function getLocalizedQuiz(lang: SupportedLanguage): QuizQuestion[] {
  if (lang === 'ko') return KO_QUIZ;
  return EN_QUIZ;
}
