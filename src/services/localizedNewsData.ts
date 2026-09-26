import { NewsArticle, MarketPulse } from '../types/news';
import { SupportedLanguage } from '../i18n/translations';

export const KO_MARKET_PULSE: MarketPulse = {
  sentiment: '신중한 낙관론 (탐욕 구간)',
  sentimentScore: 64,
  keyThemes: [
    '빅테크 AI 인프라 자본지출(Capex) 지속 확대',
    '연준 피벗 및 점진적 금리 인하 궤도',
    '기업 영업이익률 및 마진 탄력성 견고'
  ],
  fedWatchStatus: '25bp 금리 인하 확률 78%'
};

export const KO_ARTICLES: Record<string, Partial<NewsArticle>> = {
  'news-nvda-blackwell': {
    headline: '엔비디아, 빅테크 하이퍼스케일러 수요 폭증에 블랙웰 AI 서버 공급 가속화',
    summary: '클라우드 거인들(마이크로소프트, 아마존, 구글, 메타)이 차세대 AI 인프라 자본지출을 대폭 늘리며 향후 4분기 블랙웰 칩 생산량을 전량 사전 예약했습니다.',
    educationalTakeaway: '고객사가 1년 치 공급 물량을 전량 선구매하면 강력한 매출 가시성과 가격 결정력이 생깁니다. 데이터센터 하드웨어는 70% 이상의 높은 매출총이익률을 기록해 주당순이익(EPS)을 직접 견인합니다.',
    timestamp: '25분 전',
    source: '분기별 공급망 브리핑'
  },
  'news-fed-rates-macro': {
    headline: '연준, 인플레이션 2.5% 안정세 속에 점진적 기준금리 인하 경로 시사',
    summary: '연준 관계자들은 고용 지표 둔화와 안정적인 소비자 지출을 근거로 점진적 기준금리 인하를 지지한다고 밝혔으며, 상업 신용시장의 차입 비용이 감소하고 있습니다.',
    educationalTakeaway: '금리 인하는 기업의 이자 비용을 낮추고 안전자산인 국채 대비 주식의 투자 매력을 높입니다. 성장주는 미래 현금흐름의 할인율이 낮아져 주가에 큰 호재로 작용합니다.',
    timestamp: '1시간 전',
    source: '연방준비제도 공식 정책 성명'
  },
  'news-pltr-aip-contracts': {
    headline: '팔란티어, S&P 500 지수 편입 자금 유입 속 다년치 기업 AI 공급 계약 체결',
    summary: '상업용 AIP 부트캠프를 통해 포춘 500대 기업 다수와 수백만 달러 규모의 연간 반복 계약을 체결했으며, 인덱스 펀드의 의무 매수 자금이 유입되었습니다.',
    educationalTakeaway: '주식이 S&P 500에 편입되면 패시브 ETF와 펀드는 가격과 무관하게 의무적으로 주식을 사야 합니다. 소프트웨어 고마진과 결합된 기관 매수세는 주가의 지속적인 상승 동력이 됩니다.',
    timestamp: '2시간 전',
    source: 'SEC Form 8-K 공시 분석'
  },
  'news-aapl-intelligence': {
    headline: '애플, 글로벌 전역으로 Apple Intelligence 기능 확대... 교체 주기 가속',
    summary: '통신사 프로모션과 iOS 신규 AI 기능 출시로 북미 및 아시아 전역에서 아이폰 업그레이드 교체 주기가 빨라졌으며, 고수익 서비스 부문 매출이 증가했습니다.',
    educationalTakeaway: '기기 판매는 일회성 매출이지만 활성 기기 기반이 늘어나면 74%의 고마진을 가진 서비스 부문(앱스토어, iCloud, Apple Pay)의 안정적인 반복 매출이 늘어납니다.',
    timestamp: '3시간 전',
    source: '애플 IR 공식 브리프'
  },
  'news-tsla-fsd-reg': {
    headline: '테슬라, 미국 남서부 주요 주에 자율주행 로보택시 규제 승인 신청서 제출',
    summary: '주 교통국은 상업용 무인 라이드헤일링 시범 운행을 앞두고 자율주행 차량 테스트를 위한 초기 허가 신청 접수를 공식 확인했습니다.',
    educationalTakeaway: '전통 자동차 제조사는 낮은 PER(6~10배)에 거래되지만, 고수익 소프트웨어 및 로보택시 플랫폼은 30~50배의 높은 멀티플을 받습니다. 규제 승인은 밸류에이션 재평가의 핵심 요인입니다.',
    timestamp: '4시간 전',
    source: '주 정부 규제 공시'
  },
  'news-msft-azure-cloud': {
    headline: '마이크로소프트, 엔터프라이즈 코파일럿 도입 확대로 Azure 클라우드 성장 가속',
    summary: '기업들이 생성형 AI 모델을 일상 업무 소프트웨어에 통합하면서 Azure 클라우드 매출 성장률이 전년 대비 30% 이상으로 재가속되었습니다.',
    educationalTakeaway: '클라우드 인프라는 현대 소프트웨어의 톨게이트 역할을 합니다. 기업들이 다년 소비 계약을 맺으면 경기 침체기에도 주가를 방어하는 예측 가능한 현금흐름이 발생합니다.',
    timestamp: '5시간 전',
    source: 'SEC 10-Q 분기 실적 보고'
  },
  'news-sofi-fintech': {
    headline: 'SoFi, 대출 수수료 다각화 및 갈릴레오 결제 플랫폼 매출 급성장',
    summary: '디지털 금융 플랫폼 SoFi가 기록적인 신규 회원 가입과 갈릴레오 결제 처리 수수료 확대를 발표하며 개인 대출 예대마진 의존도를 낮췄습니다.',
    educationalTakeaway: '단순 대출에만 의존하는 은행은 금리 변동에 취약합니다. 핀테크 인프라 기술 공급자로 전환하면 시장에서 테크 기업 수준의 높은 밸류에이션을 인정받게 됩니다.',
    timestamp: '6시간 전',
    source: '금융 섹터 분기 보고서'
  },
  'news-googl-antitrust': {
    headline: '미 법무부, 검색 독점 반독점 소송 관련 구조적 시정조치 방안 제출',
    summary: '정부 검찰은 기본 검색엔진 독점 계약 제한과 데이터 공유 의무화를 포함한 잠재적 구조적 분할 조치를 개략적으로 설명했습니다.',
    educationalTakeaway: '규제 리스크는 주가 밸류에이션 디스카운트를 유발합니다. 실제 항소 및 소송 해결까지 수년이 걸리더라도 불확실성이 해소될 때까지 PER 멀티플이 억눌릴 수 있습니다.',
    timestamp: '7시간 전',
    source: 'DOJ 법원 제출 공시'
  },
  'news-rddt-ai-licensing': {
    headline: '레딧, 글로벌 AI 연구소와의 대규모 머신러닝 데이터 라이선스 제휴 확대',
    summary: '실시간 인간 대화 스레드를 AI 모델 학습용으로 제공하는 계약이 두 자릿수 광고 성장과 함께 고수익 소프트웨어 로열티를 창출했습니다.',
    educationalTakeaway: '순수 데이터 라이선싱은 추가 원가가 거의 0에 가까워 매출의 90% 이상이 그대로 영업이익으로 연결되며, 흑자 전환 시점을 크게 앞당깁니다.',
    timestamp: '8시간 전',
    source: '상업 라이선스 공시'
  },
  'news-semis-asml-orders': {
    headline: 'ASML, 글로벌 파운드리로부터 차세대 2nm High-NA EUV 노광장비 주문 접수',
    summary: '첨단 극자외선(EUV) 노광장비 주문이 증가하며 미국, 대만, 유럽 전역의 반도체 팹 증설이 계획대로 진행 중임을 확인해 주었습니다.',
    educationalTakeaway: 'ASML은 반도체를 만드는 기계를 독점 생산합니다. 장비 수주 증가는 18~24개월 뒤의 반도체 호황을 선행하여 알려주는 가장 신뢰도 높은 선행 지표입니다.',
    timestamp: '10시간 전',
    source: '반도체 장비 산업 리포트'
  }
};

export function getLocalizedArticles(articles: NewsArticle[], lang: SupportedLanguage): NewsArticle[] {
  if (lang === 'ko') {
    return articles.map(art => {
      const koData = KO_ARTICLES[art.id];
      if (koData) {
        return { ...art, ...koData };
      }
      return art;
    });
  }
  return articles;
}

export function getLocalizedMarketPulse(defaultPulse: MarketPulse, lang: SupportedLanguage): MarketPulse {
  if (lang === 'ko') {
    return KO_MARKET_PULSE;
  }
  return defaultPulse;
}
