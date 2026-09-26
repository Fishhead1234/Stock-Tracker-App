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

export const ZH_TW_MARKET_PULSE: MarketPulse = {
  sentiment: '審慎樂觀 (貪婪區間)',
  sentimentScore: 64,
  keyThemes: [
    '超大規模雲端巨頭AI資本支出持續激增',
    '聯準會政策轉向溫和降息循環軌道',
    '科技權值企業營業利潤率維持強韌'
  ],
  fedWatchStatus: '聯準會降息1碼機率達 78%'
};

export const ZH_CN_MARKET_PULSE: MarketPulse = {
  sentiment: '审慎乐观 (贪婪区间)',
  sentimentScore: 64,
  keyThemes: [
    '超大规模云巨头AI资本支出持续激增',
    '美联储政策转向温和降息循环轨道',
    '核心科技企业营业利润率维持强韧'
  ],
  fedWatchStatus: '美联储降息25个基点概率达 78%'
};

export const ZH_TW_ARTICLES: Record<string, Partial<NewsArticle>> = {
  'news-nvda-blackwell': {
    headline: '輝達加速出貨 Blackwell AI 伺服器，雲端巨頭預訂需求全面爆發',
    summary: '微軟、亞馬遜、Google 與 Meta 等雲端巨頭擴大下一代 AI 基礎設施資本支出，全數預訂未來四季所有 Blackwell 晶片產能。',
    educationalTakeaway: '當大客戶提前包下全年生產配額時，企業將享有極佳的營收能見度與產品定價權。資料中心硬體毛利率高達 70% 以上，將直接推升每股盈餘 (EPS)。',
    timestamp: '25分鐘前',
    source: '季度供應鏈產業快報'
  },
  'news-fed-rates-macro': {
    headline: '通膨降溫至 2.5% 水平，聯準會釋出溫和降息路徑訊號',
    summary: '央行決策官員指出，降溫的就業市場數據與穩健的消費支出支持漸進式降息，商業信用市場基準借貸成本隨之下降。',
    educationalTakeaway: '降息可降低企業融資借貸成本，並使無風險公債相較股票的吸引力降低。成長股通常受惠最大，因其未來現金流量以更低的折現率評估。',
    timestamp: '1小時前',
    source: '聯準會官方政策聲明'
  },
  'news-pltr-aip-contracts': {
    headline: 'Palantir 納入 S&P 500 指數獲被動買盤湧入，再簽多筆企業級 AI 長約',
    summary: '商業級 AIP 訓練營成功將數十家財星 500 強企業轉化為數百萬美元的年度經常性合約，指數型基金亦完成法定義務持股建立。',
    educationalTakeaway: '當個股被納入標普 500 指數時，指數型基金與被動 ETF 依法必須不計價位買進持股。搭配軟體高毛利率與機構買盤，常能形成延續性上漲動能。',
    timestamp: '2小時前',
    source: 'SEC 8-K 法定申報分析'
  },
  'news-aapl-intelligence': {
    headline: '蘋果向全球主要市場擴展 Apple Intelligence 功能，加速換機升級週期',
    summary: '電信商購機補貼與 iOS 全新 AI 功能加速北美及亞洲市場 iPhone 換機潮，帶動高毛利的服務事業群營收成長。',
    educationalTakeaway: '硬體銷售能創造即時營收，而活躍裝置數的成長更能壯大蘋果的服務業務（App Store、iCloud、Apple Pay）。該部門毛利率高達 74%，提供穩定的經常性現金流。',
    timestamp: '3小時前',
    source: '蘋果投資人關係簡報'
  },
  'news-tsla-fsd-reg': {
    headline: '特斯拉向美西南部多州遞交無人駕駛計程車 (Robotaxi) 監管申請',
    summary: '州交通監管部門證實已收到無人監督自駕車輛測試的初步許可申請，為後續商業化無人叫車試營運計畫做準備。',
    educationalTakeaway: '傳統車廠本益比通常僅 6-10 倍，而高毛利軟體與無人叫車網路平台享有 30-50 倍本益比。監管突破有助市場將特斯拉從週期性車廠重新評估為經常性軟體平台。',
    timestamp: '4小時前',
    source: '州政府監管公報'
  },
  'news-msft-azure-cloud': {
    headline: '微軟 Copilot 企業端普及率攀升，帶動 Azure 雲端事業成長再加速',
    summary: '隨著企業將生成式 AI 模型深度整合至日常生產力工具，Azure 雲端運算營收年增率重返 30% 以上的強勁成長軌道。',
    educationalTakeaway: '雲端基礎架構是現代軟體產業的「高速公路收費站」。企業簽署多年期運算合約，能提供高度可預測的現金流，在經濟放緩期亦具備防禦力。',
    timestamp: '5小時前',
    source: 'SEC 10-Q 季度財報'
  },
  'news-sofi-fintech': {
    headline: 'SoFi 營收多元化策略奏效，Galileo 支付科技平台獲利顯著擴張',
    summary: '數位金融平台 SoFi 宣布新用戶增長創歷史新高，Galileo 支付處理手續費大幅增加，有效降低對個人信貸放款淨利息收入的依賴。',
    educationalTakeaway: '僅依賴放款的銀行易受利率循環波動衝擊。轉型為金融科技基礎架構技術供應商，可獲得市場給予類似科技軟體股的高估值評價。',
    timestamp: '6小時前',
    source: '金融板塊季度產業研報'
  },
  'news-googl-antitrust': {
    headline: '美司法部針對 Google 搜尋反壟斷訴訟研擬結構性補救處分措施',
    summary: '政府檢察官提出可能的分拆與補救方案，包括限制預設搜尋引擎獨家綁定合約，以及強制開放特定搜尋數據共享。',
    educationalTakeaway: '監管不確定性會壓抑個股本益比（法規折價）。即使上訴與實質訴訟可能耗時數年，在利空釐清前通常會限制股價估值擴張空間。',
    timestamp: '7小時前',
    source: '美國司法部法院申報文件'
  },
  'news-rddt-ai-licensing': {
    headline: 'Reddit 擴大與頂尖 AI 實驗室的對話訓練數據授權合作',
    summary: '提供真人即時討論數據供 AI 模型訓練的合約，搭配雙位數廣告成長，帶動高利潤軟體權利金收益。',
    educationalTakeaway: '純數據授權業務幾乎沒有邊際成本，營收有 90% 以上可直接轉化為營業利益，大幅縮短企業由虧轉盈的時間點。',
    timestamp: '8小時前',
    source: '商業資料授權公告'
  },
  'news-semis-asml-orders': {
    headline: 'ASML 獲全球頂尖晶圓代工廠增訂次世代 2nm High-NA EUV 曝光機',
    summary: '先進極紫外光 (EUV) 機台訂單維持熱絡，確認美國、台灣及歐洲地區的先進晶圓廠擴建計畫如期進行。',
    educationalTakeaway: 'ASML 獨家壟斷先進製程設備生產。設備訂單是整個半導體產業鏈週期中最重要的領先指標，往往提前 18 至 24 個月反映未來的晶片景氣循環。',
    timestamp: '10小時前',
    source: '半導體設備產業研報'
  }
};

export const ZH_CN_ARTICLES: Record<string, Partial<NewsArticle>> = {
  'news-nvda-blackwell': {
    headline: '英伟达加速出货 Blackwell AI 服务器，云巨头预订需求全面爆发',
    summary: '微软、亚马逊、谷歌与 Meta 等云巨头扩大下一代 AI 基础设施资本支出，全数预订未来四季所有 Blackwell 芯片产能。',
    educationalTakeaway: '当大客户提前包下全年生产配额时，企业将享有极佳的营收能见度与产品定价权。数据中心硬件毛利率高达 70% 以上，将直接推升每股收益 (EPS)。',
    timestamp: '25分钟前',
    source: '季度供应链行业快报'
  },
  'news-fed-rates-macro': {
    headline: '通胀降温至 2.5% 水平，美联储释放温和降息路径信号',
    summary: '央行决议官员指出，降温的就业市场数据与稳健的消费支出支持渐进式降息，商业信贷市场基准借贷成本随之下降。',
    educationalTakeaway: '降息可降低企业融资借贷成本，并使无风险国债相较股票的吸引力降低。成长股通常受惠最大，因其未来现金流以更低的折现率评估。',
    timestamp: '1小时前',
    source: '美联储官方政策声明'
  },
  'news-pltr-aip-contracts': {
    headline: 'Palantir 纳入标普 500 指数获被动买盘涌入，再签多笔企业级 AI 长约',
    summary: '商业级 AIP 训练营成功将数十家财富 500 强企业转化为数百万美元的年度经常性合同，指数型基金亦完成法定义务持仓建立。',
    educationalTakeaway: '当个股被纳入标普 500 指数时，指数型基金与被动 ETF 依法必须不计价位买入持仓。搭配软件高毛利率与机构买盘，常能形成延续性上涨动能。',
    timestamp: '2小时前',
    source: 'SEC 8-K 法定申报分析'
  },
  'news-aapl-intelligence': {
    headline: '苹果向全球主要市场扩展 Apple Intelligence 功能，加速换机升级周期',
    summary: '运营商购机补贴与 iOS 全新 AI 功能加速北美及亚洲市场 iPhone 换机潮，带动高毛利的服务业务群营收增长。',
    educationalTakeaway: '硬件销售能创造即时营收，而活跃设备数的增长更能壮大苹果的服务业务（App Store、iCloud、Apple Pay）。该部门毛利率高达 74%，提供稳定的经常性现金流。',
    timestamp: '3小时前',
    source: '苹果投资者关系简报'
  },
  'news-tsla-fsd-reg': {
    headline: '特斯拉向美西南部多州递交无人驾驶出租车 (Robotaxi) 监管申请',
    summary: '州交通监管部门证实已收到无人监督自动驾驶车辆测试的初步许可申请，为后续商业化无人叫车试运营计划做准备。',
    educationalTakeaway: '传统车企市盈率通常仅 6-10 倍，而高毛利软件与无人叫车网络平台享有 30-50 倍市盈率。监管突破有助于市场将特斯拉从周期性车企重新评估为经常性软件平台。',
    timestamp: '4小时前',
    source: '州政府监管公报'
  },
  'news-msft-azure-cloud': {
    headline: '微软 Copilot 企业端普及率攀升，带动 Azure 云业务增长再提速',
    summary: '随着企业将生成式 AI 模型深度整合至日常生产力工具，Azure 云计算营收年增率重返 30% 以上的强劲增长轨道。',
    educationalTakeaway: '云计算基础设施是现代软件行业的“高速公路收费站”。企业签署多年期计算合同，能提供高度可预测的现金流，在经济放缓期亦具备防御力。',
    timestamp: '5小时前',
    source: 'SEC 10-Q 季度财报'
  },
  'news-sofi-fintech': {
    headline: 'SoFi 营收多元化策略奏效，Galileo 支付科技平台盈利显著扩张',
    summary: '数字金融平台 SoFi 宣布新用户增长创历史新高，Galileo 支付处理手续费大幅增加，有效降低对个人信贷放款净利息收入的依赖。',
    educationalTakeaway: '仅依赖放贷的银行易受利率周期波动冲击。转型为金融科技基础设施技术供应商，可获得市场给予类似科技软件股的高估值评价。',
    timestamp: '6小时前',
    source: '金融板块季度行业研报'
  },
  'news-googl-antitrust': {
    headline: '美司法部针对谷歌搜索反垄断诉讼研拟结构性补救处罚措施',
    summary: '政府检察官提出可能的拆分与补救方案，包括限制默认搜索引擎独家绑定合同，以及强制开放特定搜索数据共享。',
    educationalTakeaway: '监管不确定性会压制个股市盈率（法规折价）。即使上诉与实质诉讼可能耗时数年，在利空厘清前通常会限制股价估值扩张空间。',
    timestamp: '7小时前',
    source: '美国司法部法院申报文件'
  },
  'news-rddt-ai-licensing': {
    headline: 'Reddit 扩大与顶尖 AI 实验室的对话训练数据授权合作',
    summary: '提供真人即时讨论数据供 AI 模型训练的合同，搭配双位数广告增长，带动高利润软件版权费收益。',
    educationalTakeaway: '纯数据授权业务几乎没有边际成本，营收有 90% 以上可直接转化为营业利润，大幅缩短企业由亏转盈的时间点。',
    timestamp: '8小时前',
    source: '商业数据授权公告'
  },
  'news-semis-asml-orders': {
    headline: 'ASML 获全球顶尖晶圆代工厂增订次世代 2nm High-NA EUV 光刻机',
    summary: '先进极紫外光 (EUV) 机台订单维持热络，确认美国、台湾及欧洲地区的先进晶圆厂扩建计划如期进行。',
    educationalTakeaway: 'ASML 独家垄断先进先进制程设备生产。设备订单是整个半导体产业链周期中最重要的领先指标，往往提前 18 至 24 个月反映未来的芯片景气循环。',
    timestamp: '10小时前',
    source: '半导体设备行业研报'
  }
};

export function getLocalizedArticles(articles: NewsArticle[], lang: SupportedLanguage): NewsArticle[] {
  if (lang === 'ko') {
    return articles.map(art => {
      const koData = KO_ARTICLES[art.id];
      if (koData) return { ...art, ...koData };
      return art;
    });
  }
  if (lang === 'zh-TW') {
    return articles.map(art => {
      const twData = ZH_TW_ARTICLES[art.id];
      if (twData) return { ...art, ...twData };
      return art;
    });
  }
  if (lang === 'zh-CN') {
    return articles.map(art => {
      const cnData = ZH_CN_ARTICLES[art.id];
      if (cnData) return { ...art, ...cnData };
      return art;
    });
  }
  return articles;
}

export function getLocalizedMarketPulse(defaultPulse: MarketPulse, lang: SupportedLanguage): MarketPulse {
  if (lang === 'ko') return KO_MARKET_PULSE;
  if (lang === 'zh-TW') return ZH_TW_MARKET_PULSE;
  if (lang === 'zh-CN') return ZH_CN_MARKET_PULSE;
  return defaultPulse;
}
