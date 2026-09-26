export type SupportedLanguage = 'en' | 'ja' | 'ko' | 'zh-TW' | 'zh-CN' | 'es' | 'de' | 'fr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];
import { contentTranslations } from './contentTranslations';

const baseTranslations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_signals: 'Signals',
    nav_news: 'News',
    nav_education: 'Education',
    nav_settings: 'Settings',

    // Header & Hub
    header_universal_tracker: 'Universal Exchange Tracker',
    header_hub: 'Global Portfolio Hub',
    badge_markets: 'Markets:',
    pro_member: 'PRO',
    trial_days_remaining: 'd Trial',

    // Signals & Timing Badges
    signal_strong_buy: 'Strong Buy',
    signal_buy: 'Buy Window',
    signal_hold: 'Hold / Wait',
    signal_trim: 'Trim Profit',
    signal_strong_sell: 'High Risk / Sell',

    // Filter Pills
    filter_all: 'All',
    filter_trim: 'Trim Profit',
    filter_strong_buy: 'Strong Buy',
    filter_buy: 'Buy Window',
    filter_hold: 'Hold / Wait',
    filter_strong_sell: 'High Risk / Sell',

    // Portfolio Summary Card
    portfolio_summary_title: 'Portfolio Value',
    total_gain_loss: 'Total Gain / Loss',
    total_cost_basis: 'Total Cost Basis',
    todays_return: "Today's Return",
    all_time: 'All-time',
    add_stock: 'Add Stock',
    holdings_count_label: 'Holdings',
    monitored_stocks: 'monitored',
    log_your_stocks: 'Log Your Stocks',
    portfolio_ready: 'Your portfolio tracker is ready',
    portfolio_ready_desc: 'Log the stocks you own across any global exchange to receive real-time updates and timing advice.',

    // Stocks to Watch
    stocks_to_watch_title: 'Stocks to Watch',
    search_placeholder: 'Search any stock to monitor (e.g. SOFI, TSLA, NVDA)...',
    live_matches: 'Live Market Matches',
    indexed_equities: 'Indexed Equities',
    watching_remove: 'Watching (Remove)',
    add_to_watch: 'Add to Watch',
    instant_add: 'Instant Add: Watch',
    watch_empty_title: 'Your watch list is empty',
    watch_empty_desc: 'Type any ticker in the search bar above and tap "+ Add to Watch" to monitor its live price and timing signals.',
    no_filter_match: 'No watched stocks currently have a',
    show_all_watched: 'Show All Watched Stocks',

    // Notifications Center
    alerts_title: 'Alerts & Notifications',
    alerts_subtitle: 'Timing signals for holdings & watched stocks',
    unread_alerts: 'unread alerts',
    mark_all_read: 'Mark all read',
    clear_all: 'Clear',
    no_alerts_title: 'No alerts yet',
    no_alerts_desc: 'When your personal holdings or watched stocks trigger a timing signal change, notifications will appear here.',
    holding_alert_label: 'Holding',
    watchlist_alert_label: 'Watchlist',
    price_at_alert: 'Price at alert',
    view_analysis: 'View analysis',

    // Settings
    settings_title: 'App Settings & Alerts',
    settings_subtitle: 'Configure timing alerts, languages, subscription, and global market feeds.',
    language_section_title: 'Language / 語言 / 言語 / 언어',
    language_section_desc: 'Choose your preferred display language.',
    currency_section_title: 'Preferred Currency',
    notifications_card_title: 'Timing Alert Notifications',
    personal_holdings_alerts: 'Personal Holdings Alerts',
    personal_holdings_desc: 'Notify when stocks you own enter Buy Window, Strong Buy, Trim Profit, or High Risk/Sell.',
    watchlist_alerts: '"Stocks to Watch" Alerts',
    watchlist_desc: 'Notify when any monitored watchlist stock triggers Strong Buy or High Risk/Sell.',
    signal_filter_level: 'Signal Alert Filter Level',
    all_timing_changes: 'All Timing Changes',
    high_urgency_only: 'High Urgency Only',
    test_holding_alert_btn: 'Test Holding Alert (AAPL)',
    test_watchlist_alert_btn: 'Test Watchlist Alert (NVDA)',
    strict_disclosure_title: 'Strict Informational Disclosure',
    strict_disclosure_text: 'InvestLearn is strictly an educational tool and portfolio monitor. It does NOT provide financial advice, manage assets, or execute trades.',
    membership_status: 'Membership Status',
    data_management: 'Data Management',
    clear_positions: 'Clear Tracked Portfolio Positions',
    reset_onboarding: 'Reset & Re-Take Onboarding',

    // Pro / Subscription
    claim_lifetime_pass: 'Claim Lifetime Pass for $49.99',
    founders_lifetime_title: "Founder's Limited Lifetime Pass",
    founders_lifetime_desc: 'Pay once, yours forever. No recurring fees.',
    save_33_percent: 'Save 33%',
    annual_membership: 'Annual Membership',
    monthly_flex: 'Monthly Flex',
    free_trial_active: '30-Day Free Trial Active',
    spots_remaining: 'spots left',
    restore_purchases: 'Restore Purchases'
  },

  ja: {
    // Navigation
    nav_dashboard: 'ダッシュボード',
    nav_signals: 'シグナル',
    nav_news: 'ニュース',
    nav_education: '学習ガイド',
    nav_settings: '設定',

    // Header & Hub
    header_universal_tracker: '世界株式エクスチェンジ・トラッカー',
    header_hub: 'グローバル・ポートフォリオ',
    badge_markets: '市場状況:',
    pro_member: 'PRO',
    trial_days_remaining: '日 トライアル',

    // Signals & Timing Badges
    signal_strong_buy: '強い買い (絶好機)',
    signal_buy: '買い場 (蓄積期)',
    signal_hold: '様子見 (中立)',
    signal_trim: '利益確定 (一部利確)',
    signal_strong_sell: '警戒・売り (リスク大)',

    // Filter Pills
    filter_all: 'すべて',
    filter_trim: '利益確定',
    filter_strong_buy: '強い買い',
    filter_buy: '買い場',
    filter_hold: '様子見',
    filter_strong_sell: '警戒・売り',

    // Portfolio Summary Card
    portfolio_summary_title: '総資産価値',
    total_gain_loss: '損益合計',
    total_cost_basis: '取得原価ベース',
    todays_return: '本日の損益',
    all_time: '全期間',
    add_stock: '銘柄を追加',
    holdings_count_label: '保有銘柄',
    monitored_stocks: '銘柄監視中',
    log_your_stocks: '保有銘柄を記録する',
    portfolio_ready: 'ポートフォリオ管理の準備が整いました',
    portfolio_ready_desc: '世界各国の保有株式を記録して、リアルタイムの価格更新と売買タイミングのアドバイスを受け取りましょう。',

    // Stocks to Watch
    stocks_to_watch_title: '監視銘柄リスト',
    search_placeholder: '銘柄を検索して監視 (例: 7203, NVDA, AAPL, 2330)...',
    live_matches: 'ライブ市場一致',
    indexed_equities: '登録済み株式',
    watching_remove: '監視中 (解除)',
    add_to_watch: '監視に追加',
    instant_add: '直接追加: 監視',
    watch_empty_title: '監視リストは空です',
    watch_empty_desc: '上の検索バーで銘柄を入力し、「+ 監視に追加」をタップして価格とシグナルを追跡しましょう。',
    no_filter_match: '現在このシグナルに該当する監視銘柄はありません:',
    show_all_watched: 'すべての監視銘柄を表示',

    // Notifications Center
    alerts_title: '通知＆アラート',
    alerts_subtitle: '保有銘柄および監視銘柄のタイミングシグナル',
    unread_alerts: '件の未読通知',
    mark_all_read: 'すべて既読にする',
    clear_all: '消去',
    no_alerts_title: '通知はありません',
    no_alerts_desc: '保有株や監視銘柄が売買シグナル（買い場、利確、売り等）に変化すると通知が届きます。',
    holding_alert_label: '保有株',
    watchlist_alert_label: '監視中',
    price_at_alert: '検知時株価',
    view_analysis: '詳細分析を見る',

    // Settings
    settings_title: 'アプリ設定＆アラート',
    settings_subtitle: 'タイミング通知、言語、サブスクリプション、世界市場フィードの設定。',
    language_section_title: '言語設定 (Language)',
    language_section_desc: '表示言語を選択してください。',
    currency_section_title: '表示通貨',
    notifications_card_title: 'タイミング通知設定',
    personal_holdings_alerts: '保有銘柄アラート',
    personal_holdings_desc: '保有する株式が買い場、強い買い、利確、または警戒売りに入った際に通知します。',
    watchlist_alerts: '監視銘柄アラート',
    watchlist_desc: '監視中の銘柄が強い買いまたは高リスク売りに達した際に通知します。',
    signal_filter_level: 'シグナル通知フィルター',
    all_timing_changes: 'すべてのタイミング変化',
    high_urgency_only: '緊急度高のみ (強い買い・売り)',
    test_holding_alert_btn: '保有株テスト通知 (AAPL)',
    test_watchlist_alert_btn: '監視株テスト通知 (NVDA)',
    strict_disclosure_title: '厳格な情報開示・免責事項',
    strict_disclosure_text: 'InvestLearnは学習およびポートフォリオ追跡専用ツールです。金銭的助言や実際の取引注文は一切行いません。',
    membership_status: 'メンバーシップ状況',
    data_management: 'データ管理',
    clear_positions: '保有株式データを消去',
    reset_onboarding: 'オンボーディングをやり直す',

    // Pro / Subscription
    claim_lifetime_pass: '$49.99 で永久パスを獲得',
    founders_lifetime_title: '創設メンバー限定 永久パス (Lifetime)',
    founders_lifetime_desc: '1回限りの支払いで一生使い放題。月額費用ゼロ。',
    save_33_percent: '33% お得',
    annual_membership: '年額プラン',
    monthly_flex: '月額フレックス',
    free_trial_active: '30日間無料トライアル中',
    spots_remaining: '枠 残り',
    restore_purchases: '購入履歴を復元'
  },

  ko: {
    // Navigation
    nav_dashboard: '대시보드',
    nav_signals: '타이밍 신호',
    nav_news: '뉴스',
    nav_education: '학습 가이드',
    nav_settings: '설정',

    // Header & Hub
    header_universal_tracker: '글로벌 증권 거래소 트래커',
    header_hub: '글로벌 포트폴리오 허브',
    badge_markets: '시장 현황:',
    pro_member: 'PRO',
    trial_days_remaining: '일 남음',

    // Signals & Timing Badges
    signal_strong_buy: '강력 매수',
    signal_buy: '매수 구간',
    signal_hold: '관망 (중립)',
    signal_trim: '이익 실현 (분할 익절)',
    signal_strong_sell: '고위험 매도 (비중 축소)',

    // Filter Pills
    filter_all: '전체',
    filter_trim: '이익 실현',
    filter_strong_buy: '강력 매수',
    filter_buy: '매수 구간',
    filter_hold: '관망',
    filter_strong_sell: '고위험 매도',

    // Portfolio Summary Card
    portfolio_summary_title: '총 포트폴리오 가치',
    total_gain_loss: '총 손익',
    total_cost_basis: '총 매입 원가',
    todays_return: '오늘의 수익',
    all_time: '전체 기간',
    add_stock: '종목 추가',
    holdings_count_label: '보유 종목',
    monitored_stocks: '개 모니터링 중',
    log_your_stocks: '내 주식 기록하기',
    portfolio_ready: '포트폴리오 트래커가 준비되었습니다',
    portfolio_ready_desc: '보유 중인 글로벌 주식을 입력하여 실시간 가격과 지능형 매수/매도 타이밍 조언을 받아보세요.',

    // Stocks to Watch
    stocks_to_watch_title: '관심 종목 모니터링',
    search_placeholder: '모니터링할 종목 검색 (예: 005930, SOFI, NVDA, TSLA)...',
    live_matches: '실시간 시장 검색 결과',
    indexed_equities: '등록된 종목',
    watching_remove: '모니터링 중 (제거)',
    add_to_watch: '관심 종목 추가',
    instant_add: '직접 추가: 모니터링',
    watch_empty_title: '관심 종목 리스트가 비어 있습니다',
    watch_empty_desc: '상단 검색창에 종목을 입력하고 "+ 관심 종목 추가"를 눌러 실시간 시세와 신호를 추적하세요.',
    no_filter_match: '현재 다음 신호에 해당하는 관심 종목이 없습니다:',
    show_all_watched: '모든 관심 종목 표시',

    // Notifications Center
    alerts_title: '알림 및 시그널',
    alerts_subtitle: '보유 종목 및 관심 종목 타이밍 신호 알림',
    unread_alerts: '개의 읽지 않은 알림',
    mark_all_read: '모두 읽음 표시',
    clear_all: '지우기',
    no_alerts_title: '새로운 알림이 없습니다',
    no_alerts_desc: '보유 주식이나 관심 종목의 매수/매도 신호가 발생하면 여기에 실시간으로 기록됩니다.',
    holding_alert_label: '보유종목',
    watchlist_alert_label: '관심종목',
    price_at_alert: '신호 발생 당시 가격',
    view_analysis: '상세 분석 보기',

    // Settings
    settings_title: '앱 설정 및 알림',
    settings_subtitle: '타이밍 알림, 표시 언어, 구독 관리 및 글로벌 시장 데이터 설정.',
    language_section_title: '언어 설정 (Language)',
    language_section_desc: '사용할 언어를 선택하세요.',
    currency_section_title: '기본 통화',
    notifications_card_title: '타이밍 알림 설정',
    personal_holdings_alerts: '보유 종목 알림',
    personal_holdings_desc: '보유 중인 주식이 매수 구간, 강력 매수, 이익 실현 또는 고위험 매도에 도달하면 알림.',
    watchlist_alerts: '관심 종목 알림',
    watchlist_desc: '관심 종목이 강력 매수 또는 고위험 매도 신호에 도달하면 알림.',
    signal_filter_level: '신호 알림 필터 레벨',
    all_timing_changes: '모든 신호 변경',
    high_urgency_only: '긴급 신호만 (강력 매수 및 고위험 매도)',
    test_holding_alert_btn: '보유 종목 테스트 알림 (AAPL)',
    test_watchlist_alert_btn: '관심 종목 테스트 알림 (NVDA)',
    strict_disclosure_title: '엄격한 정보 고지 및 면책 조항',
    strict_disclosure_text: 'InvestLearn은 교육 및 학습용 포트폴리오 관리 도구입니다. 실제 금융 투자 조언을 제공하거나 실제 주식 거래를 대행하지 않습니다.',
    membership_status: '멤버십 상태',
    data_management: '데이터 관리',
    clear_positions: '보유 포트폴리오 기록 삭제',
    reset_onboarding: '온보딩 다시 시작',

    // Pro / Subscription
    claim_lifetime_pass: '$49.99에 평생 패스 구매',
    founders_lifetime_title: '창립 멤버 한정 평생 패스 (Lifetime)',
    founders_lifetime_desc: '단 1회 결제로 평생 무료 이용. 월 정기 결제 없음.',
    save_33_percent: '33% 할인',
    annual_membership: '연간 멤버십',
    monthly_flex: '월간 멤버십',
    free_trial_active: '30일 무료 체험 진행 중',
    spots_remaining: '자리 남음',
    restore_purchases: '구매 내역 복원'
  },

  'zh-TW': {
    // Navigation
    nav_dashboard: '儀表板',
    nav_signals: '時機信號',
    nav_news: '新聞資訊',
    nav_education: '投資教學',
    nav_settings: '設定',

    // Header & Hub
    header_universal_tracker: '全球股票交易所追蹤器',
    header_hub: '全球投資組合中心',
    badge_markets: '全球市場:',
    pro_member: 'PRO',
    trial_days_remaining: '天試用',

    // Signals & Timing Badges
    signal_strong_buy: '強烈買入',
    signal_buy: '買入區間',
    signal_hold: '持有觀望',
    signal_trim: '分批獲利',
    signal_strong_sell: '高風險減倉',

    // Filter Pills
    filter_all: '全部',
    filter_trim: '分批獲利',
    filter_strong_buy: '強烈買入',
    filter_buy: '買入區間',
    filter_hold: '持有觀望',
    filter_strong_sell: '高風險減倉',

    // Portfolio Summary Card
    portfolio_summary_title: '投資組合現值',
    total_gain_loss: '總損益',
    total_cost_basis: '總投資成本',
    todays_return: '今日損益',
    all_time: '歷來累計',
    add_stock: '新增持股',
    holdings_count_label: '檔持股',
    monitored_stocks: '檔監控中',
    log_your_stocks: '記錄您的持股',
    portfolio_ready: '您的持股追蹤系統已就緒',
    portfolio_ready_desc: '記錄您在台股、美股或全球各交易所擁有的股票，獲得即時價格更新與買賣時機教學建議。',

    // Stocks to Watch
    stocks_to_watch_title: '自選觀察清單',
    search_placeholder: '搜尋全球股票進行監控 (如: 2330, TSLA, NVDA, AAPL)...',
    live_matches: '即時市場匹配結果',
    indexed_equities: '已收錄標的',
    watching_remove: '監控中 (點擊移除)',
    add_to_watch: '加入觀察',
    instant_add: '直接新增: 監控',
    watch_empty_title: '您的觀察名單目前為空',
    watch_empty_desc: '在上方搜尋欄輸入任何股票代碼，點選「+ 加入觀察」即可在此追蹤最新價格與時機建議。',
    no_filter_match: '目前自選清單中沒有符合此信號的股票:',
    show_all_watched: '顯示全部觀察股票',

    // Notifications Center
    alerts_title: '通知與時機警報',
    alerts_subtitle: '個人持股與自選名單時機信號提示',
    unread_alerts: '則未讀通知',
    mark_all_read: '全部標為已讀',
    clear_all: '清除',
    no_alerts_title: '暫無新通知',
    no_alerts_desc: '當您的個人持股或自選清單觸發買賣時機變化（買入點、分批停利、避險等），即時通知將顯示於此。',
    holding_alert_label: '個人持股',
    watchlist_alert_label: '自選觀察',
    price_at_alert: '觸發時價格',
    view_analysis: '查看分析詳情',

    // Settings
    settings_title: '應用設定與時機警報',
    settings_subtitle: '設定時機通知偏好、介面語言、訂閱狀態與全球市場數據。',
    language_section_title: '語言設定 (Language)',
    language_section_desc: '請選擇您偏好的顯示語言。',
    currency_section_title: '主要顯示貨幣',
    notifications_card_title: '時機警報通知設定',
    personal_holdings_alerts: '個人持股時機警報',
    personal_holdings_desc: '當您持有的股票進入買入區間、強烈買入、分批獲利或高風險減倉時發送通知。',
    watchlist_alerts: '自選觀察清單警報',
    watchlist_desc: '當自選監控的股票觸發強烈買入或高風險減倉時發送警報。',
    signal_filter_level: '警報過濾敏感度',
    all_timing_changes: '所有時機變化 (買入、停利、減倉)',
    high_urgency_only: '僅高急迫性 (強烈買入與高風險)',
    test_holding_alert_btn: '測試持股通知 (AAPL)',
    test_watchlist_alert_btn: '測試自選通知 (NVDA)',
    strict_disclosure_title: '嚴格資訊披露與法規免責',
    strict_disclosure_text: 'InvestLearn 嚴格定位為投資教育與行情追蹤工具。本應用程式不提供投資顧問服務，亦不具備代客下單或資金交易功能。',
    membership_status: '會員方案狀態',
    data_management: '資料庫管理',
    clear_positions: '清空持股紀錄',
    reset_onboarding: '重置並重新進行新手引導',

    // Pro / Subscription
    claim_lifetime_pass: '以 $49.99 取得終身通行證',
    founders_lifetime_title: '創始會員限量終身通行證 (Lifetime)',
    founders_lifetime_desc: '一次付費，終身享有所有功能，無需按月續訂。',
    save_33_percent: '省下 33%',
    annual_membership: '年度訂閱方案',
    monthly_flex: '月度彈性方案',
    free_trial_active: '30天免費試用進行中',
    spots_remaining: '席 剩餘名額',
    restore_purchases: '恢復購買紀錄'
  },

  'zh-CN': {
    // Navigation
    nav_dashboard: '仪表板',
    nav_signals: '时机信号',
    nav_news: '新闻资讯',
    nav_education: '投资教学',
    nav_settings: '设置',

    // Header & Hub
    header_universal_tracker: '全球股票交易所追踪器',
    header_hub: '全球投资组合中心',
    badge_markets: '全球市场:',
    pro_member: 'PRO',
    trial_days_remaining: '天试用',

    // Signals & Timing Badges
    signal_strong_buy: '强烈买入',
    signal_buy: '买入区间',
    signal_hold: '持有观望',
    signal_trim: '分批获利',
    signal_strong_sell: '高风险减仓',

    // Filter Pills
    filter_all: '全部',
    filter_trim: '分批获利',
    filter_strong_buy: '强烈买入',
    filter_buy: '买入区间',
    filter_hold: '持有观望',
    filter_strong_sell: '高风险减仓',

    // Portfolio Summary Card
    portfolio_summary_title: '投资组合现值',
    total_gain_loss: '总损益',
    total_cost_basis: '总投资成本',
    todays_return: '今日损益',
    all_time: '历来累计',
    add_stock: '添加持股',
    holdings_count_label: '只持股',
    monitored_stocks: '只监控中',
    log_your_stocks: '记录您的持股',
    portfolio_ready: '您的持股追踪系统已就绪',
    portfolio_ready_desc: '记录您在美股、港股或全球各交易所拥有的股票，获取实时价格更新与买卖时机教学建议。',

    // Stocks to Watch
    stocks_to_watch_title: '自选监控清单',
    search_placeholder: '搜索全球股票进行监控 (如: NVDA, TSLA, AAPL, BABA)...',
    live_matches: '实时市场匹配结果',
    indexed_equities: '已收录标的',
    watching_remove: '监控中 (点击移除)',
    add_to_watch: '加入观察',
    instant_add: '直接添加: 监控',
    watch_empty_title: '您的观察名单目前为空',
    watch_empty_desc: '在上方搜索栏输入任何股票代码，点击“+ 加入观察”即可在此追踪最新价格与时机建议。',
    no_filter_match: '目前自选清单中没有符合此信号的股票:',
    show_all_watched: '显示全部观察股票',

    // Notifications Center
    alerts_title: '通知与时机警报',
    alerts_subtitle: '个人持股与自选名单时机信号提示',
    unread_alerts: '条未读通知',
    mark_all_read: '全部标为已读',
    clear_all: '清除',
    no_alerts_title: '暂无新通知',
    no_alerts_desc: '当您的个人持股或自选清单触发买卖时机变化时，实时通知将显示于此。',
    holding_alert_label: '个人持股',
    watchlist_alert_label: '自选观察',
    price_at_alert: '触发时价格',
    view_analysis: '查看分析详情',

    // Settings
    settings_title: '应用设置与时机警报',
    settings_subtitle: '配置时机通知偏好、界面语言、订阅状态与全球市场数据。',
    language_section_title: '语言设置 (Language)',
    language_section_desc: '请选择您偏好的显示语言。',
    currency_section_title: '主要显示货币',
    notifications_card_title: '时机警报通知设置',
    personal_holdings_alerts: '个人持股时机警报',
    personal_holdings_desc: '当您持有的股票进入买入区间、强烈买入、分批获利或高风险减仓时发送通知。',
    watchlist_alerts: '自选观察清单警报',
    watchlist_desc: '当自选监控的股票触发强烈买入或高风险减仓时发送警报。',
    signal_filter_level: '警报过滤敏感度',
    all_timing_changes: '所有时机变化',
    high_urgency_only: '仅高紧迫性 (强烈买入与高风险)',
    test_holding_alert_btn: '测试持股通知 (AAPL)',
    test_watchlist_alert_btn: '测试自选通知 (NVDA)',
    strict_disclosure_title: '严格信息披露与合规免责',
    strict_disclosure_text: 'InvestLearn 严格定位为投资教育与行情追踪工具。本应用程序不提供投资顾问服务，亦不具备代客下单或资金交易功能。',
    membership_status: '会员方案状态',
    data_management: '数据管理',
    clear_positions: '清空持股记录',
    reset_onboarding: '重置并重新进行新手引导',

    // Pro / Subscription
    claim_lifetime_pass: '以 $49.99 获取终身通行证',
    founders_lifetime_title: '创始会员限量终身通行证 (Lifetime)',
    founders_lifetime_desc: '一次付费，终身享有所有功能，无需按月续订。',
    save_33_percent: '节省 33%',
    annual_membership: '年度订阅方案',
    monthly_flex: '月度弹性方案',
    free_trial_active: '30天免费试用进行中',
    spots_remaining: '席 剩余名额',
    restore_purchases: '恢复购买记录'
  },

  es: {
    // Navigation
    nav_dashboard: 'Panel',
    nav_signals: 'Señales',
    nav_news: 'Noticias',
    nav_education: 'Educación',
    nav_settings: 'Ajustes',

    // Header & Hub
    header_universal_tracker: 'Rastreador Bursátil Universal',
    header_hub: 'Centro de Cartera Global',
    badge_markets: 'Mercados:',
    pro_member: 'PRO',
    trial_days_remaining: 'd Prueba',

    // Signals & Timing Badges
    signal_strong_buy: 'Compra Fuerte',
    signal_buy: 'Ventana de Compra',
    signal_hold: 'Mantener / Esperar',
    signal_trim: 'Tomar Ganancias',
    signal_strong_sell: 'Alto Riesgo / Vender',

    // Filter Pills
    filter_all: 'Todos',
    filter_trim: 'Tomar Ganancias',
    filter_strong_buy: 'Compra Fuerte',
    filter_buy: 'Ventana Compra',
    filter_hold: 'Mantener',
    filter_strong_sell: 'Alto Riesgo',

    // Portfolio Summary Card
    portfolio_summary_title: 'Valor de la Cartera',
    total_gain_loss: 'Ganancia / Pérdida Total',
    total_cost_basis: 'Base de Costo Total',
    todays_return: 'Rendimiento de hoy',
    all_time: 'Histórico',
    add_stock: 'Añadir Acción',
    holdings_count_label: 'Posiciones',
    monitored_stocks: 'monitoreadas',
    log_your_stocks: 'Registrar Acciones',
    portfolio_ready: 'Tu rastreador de cartera está listo',
    portfolio_ready_desc: 'Registra las acciones que posees en cualquier bolsa global para recibir actualizaciones en tiempo real y consejos educativos.',

    // Stocks to Watch
    stocks_to_watch_title: 'Acciones en Seguimiento',
    search_placeholder: 'Buscar acción para monitorear (ej. SOFI, TSLA, NVDA)...',
    live_matches: 'Coincidencias en Vivo',
    indexed_equities: 'Acciones Registradas',
    watching_remove: 'Siguiendo (Eliminar)',
    add_to_watch: 'Seguir Acción',
    instant_add: 'Añadir Directo: Seguir',
    watch_empty_title: 'Tu lista de seguimiento está vacía',
    watch_empty_desc: 'Escribe cualquier ticker en la barra de búsqueda y pulsa "+ Seguir Acción" para monitorear precios y señales.',
    no_filter_match: 'No hay acciones en seguimiento con la señal:',
    show_all_watched: 'Mostrar Todas las Acciones',

    // Notifications Center
    alerts_title: 'Alertas y Notificaciones',
    alerts_subtitle: 'Señales de tiempo para cartera y seguimiento',
    unread_alerts: 'alertas no leídas',
    mark_all_read: 'Marcar todas leídas',
    clear_all: 'Limpiar',
    no_alerts_title: 'Sin alertas aún',
    no_alerts_desc: 'Cuando tus acciones o lista de seguimiento cambien de señal, las alertas aparecerán aquí.',
    holding_alert_label: 'En Cartera',
    watchlist_alert_label: 'Seguimiento',
    price_at_alert: 'Precio al alertar',
    view_analysis: 'Ver análisis',

    // Settings
    settings_title: 'Ajustes y Alertas de la App',
    settings_subtitle: 'Configura notificaciones, idioma, suscripción y datos globales.',
    language_section_title: 'Idioma (Language)',
    language_section_desc: 'Elige tu idioma preferido.',
    currency_section_title: 'Moneda Preferida',
    notifications_card_title: 'Alertas de Momento Oportuno',
    personal_holdings_alerts: 'Alertas de Acciones Propias',
    personal_holdings_desc: 'Notificar cuando tus acciones entren en Ventana de Compra, Compra Fuerte, Tomar Ganancias o Venta.',
    watchlist_alerts: 'Alertas de Lista de Seguimiento',
    watchlist_desc: 'Notificar cuando una acción vigilada active Compra Fuerte o Alto Riesgo.',
    signal_filter_level: 'Nivel de Filtro de Alertas',
    all_timing_changes: 'Todos los Cambios',
    high_urgency_only: 'Solo Alta Urgencia (Compra/Venta Fuerte)',
    test_holding_alert_btn: 'Probar Alerta Cartera (AAPL)',
    test_watchlist_alert_btn: 'Probar Alerta Seguimiento (NVDA)',
    strict_disclosure_title: 'Divulgación Informativa Estricta',
    strict_disclosure_text: 'InvestLearn es una herramienta estrictamente educativa y de monitoreo. NO brinda asesoramiento financiero ni ejecuta operaciones.',
    membership_status: 'Estado de Membresía',
    data_management: 'Gestión de Datos',
    clear_positions: 'Borrar Posiciones de Cartera',
    reset_onboarding: 'Reiniciar Guía de Inicio',

    // Pro / Subscription
    claim_lifetime_pass: 'Obtener Pase Vitalicio por $49.99',
    founders_lifetime_title: 'Pase Vitalicio Fundador Limitado',
    founders_lifetime_desc: 'Paga una sola vez, tuyo para siempre. Sin suscripciones.',
    save_33_percent: 'Ahorra 33%',
    annual_membership: 'Membresía Anual',
    monthly_flex: 'Mensual Flexible',
    free_trial_active: 'Prueba Gratuita de 30 Días Activa',
    spots_remaining: 'cupos restantes',
    restore_purchases: 'Restaurar Compras'
  },

  de: {
    // Navigation
    nav_dashboard: 'Übersicht',
    nav_signals: 'Signale',
    nav_news: 'Nachrichten',
    nav_education: 'Lernbereich',
    nav_settings: 'Einstellungen',

    // Header & Hub
    header_universal_tracker: 'Universal Börsen-Tracker',
    header_hub: 'Globales Portfolio-Zentrum',
    badge_markets: 'Märkte:',
    pro_member: 'PRO',
    trial_days_remaining: 'Tage Test',

    // Signals & Timing Badges
    signal_strong_buy: 'Starker Kauf',
    signal_buy: 'Kauffenster',
    signal_hold: 'Halten / Abwarten',
    signal_trim: 'Gewinn Mitnehmen',
    signal_strong_sell: 'Hohes Risiko / Verkaufen',

    // Filter Pills
    filter_all: 'Alle',
    filter_trim: 'Gewinn Mitnehmen',
    filter_strong_buy: 'Starker Kauf',
    filter_buy: 'Kauffenster',
    filter_hold: 'Halten',
    filter_strong_sell: 'Hohes Risiko',

    // Portfolio Summary Card
    portfolio_summary_title: 'Portfolio-Gesamtwert',
    total_gain_loss: 'Gesamtertrag / Verlust',
    total_cost_basis: 'Gesamte Anschaffungskosten',
    todays_return: 'Heutige Rendite',
    all_time: 'Gesamtzeitraum',
    add_stock: 'Aktie hinzufügen',
    holdings_count_label: 'Positionen',
    monitored_stocks: 'beobachtet',
    log_your_stocks: 'Aktien Eintragen',
    portfolio_ready: 'Dein Portfolio-Tracker ist bereit',
    portfolio_ready_desc: 'Trage Aktien ein, um Echtzeit-Preise und informative Timing-Ratschläge zu erhalten.',

    // Stocks to Watch
    stocks_to_watch_title: 'Beobachtungsliste',
    search_placeholder: 'Aktie zur Beobachtung suchen (z.B. SAP, NVDA, AAPL)...',
    live_matches: 'Live Markt-Treffer',
    indexed_equities: 'Registrierte Aktien',
    watching_remove: 'Beobachtet (Entfernen)',
    add_to_watch: 'Zur Watchlist',
    instant_add: 'Sofort Hinzufügen: Watchlist',
    watch_empty_title: 'Deine Watchlist ist leer',
    watch_empty_desc: 'Tippe ein Ticker-Symbol oben ein und klicke auf "+ Zur Watchlist".',
    no_filter_match: 'Keine beobachteten Aktien mit diesem Signal:',
    show_all_watched: 'Alle Beobachteten Aktien Anzeigen',

    // Notifications Center
    alerts_title: 'Benachrichtigungen & Signale',
    alerts_subtitle: 'Timing-Signale für Depot und Watchlist',
    unread_alerts: 'ungelesene Benachrichtigungen',
    mark_all_read: 'Alle gelesen',
    clear_all: 'Löschen',
    no_alerts_title: 'Noch keine Benachrichtigungen',
    no_alerts_desc: 'Sobald sich Timing-Signale für deine Aktien ändern, erscheinen sie hier.',
    holding_alert_label: 'Im Depot',
    watchlist_alert_label: 'Watchlist',
    price_at_alert: 'Preis bei Signal',
    view_analysis: 'Analyse ansehen',

    // Settings
    settings_title: 'App-Einstellungen & Signale',
    settings_subtitle: 'Passe Benachrichtigungen, Sprache, Abo und Marktdaten an.',
    language_section_title: 'Sprache (Language)',
    language_section_desc: 'Wähle deine bevorzugte Anzeigesprache.',
    currency_section_title: 'Währung',
    notifications_card_title: 'Signal-Benachrichtigungen',
    personal_holdings_alerts: 'Depot-Aktien Benachrichtigungen',
    personal_holdings_desc: 'Benachrichtigen bei Kauffenster, Starkem Kauf oder Gewinnmitnahme.',
    watchlist_alerts: 'Watchlist-Benachrichtigungen',
    watchlist_desc: 'Benachrichtigen bei Starkem Kauf oder Hohem Risiko.',
    signal_filter_level: 'Signal-Filterstufe',
    all_timing_changes: 'Alle Änderungen',
    high_urgency_only: 'Nur Hohe Dringlichkeit',
    test_holding_alert_btn: 'Test Depot-Alert (AAPL)',
    test_watchlist_alert_btn: 'Test Watchlist-Alert (NVDA)',
    strict_disclosure_title: 'Strenge Informations-Offenlegung',
    strict_disclosure_text: 'InvestLearn ist ausschließlich ein Bildungstool. Keine Finanzberatung, keine Handelsausführung.',
    membership_status: 'Mitgliedschafts-Status',
    data_management: 'Datenverwaltung',
    clear_positions: 'Depot-Einträge Löschen',
    reset_onboarding: 'Einführung Zurücksetzen',

    // Pro / Subscription
    claim_lifetime_pass: 'Lebenslangen Pass für $49.99 sichern',
    founders_lifetime_title: 'Gründer-Lebenszeit-Pass (Limitiert)',
    founders_lifetime_desc: 'Einmal zahlen, für immer nutzen. Kein Abo.',
    save_33_percent: '33% Sparen',
    annual_membership: 'Jahres-Abo',
    monthly_flex: 'Monatlich Flexibel',
    free_trial_active: '30-Tage Kostenlose Testphase Aktiv',
    spots_remaining: 'Plätze frei',
    restore_purchases: 'Käufe Wiederherstellen'
  },

  fr: {
    // Navigation
    nav_dashboard: 'Tableau de bord',
    nav_signals: 'Signaux',
    nav_news: 'Actualités',
    nav_education: 'Éducation',
    nav_settings: 'Paramètres',

    // Header & Hub
    header_universal_tracker: 'Suivi Boursier Universel',
    header_hub: 'Hub de Portefeuille Global',
    badge_markets: 'Marchés:',
    pro_member: 'PRO',
    trial_days_remaining: 'j Essai',

    // Signals & Timing Badges
    signal_strong_buy: 'Achat Fort',
    signal_buy: "Fenêtre d'Achat",
    signal_hold: 'Conserver / Attente',
    signal_trim: 'Prise de Bénéfices',
    signal_strong_sell: 'Risque Élevé / Vendre',

    // Filter Pills
    filter_all: 'Tous',
    filter_trim: 'Prise Bénéfices',
    filter_strong_buy: 'Achat Fort',
    filter_buy: "Fenêtre d'Achat",
    filter_hold: 'Conserver',
    filter_strong_sell: 'Risque Élevé',

    // Portfolio Summary Card
    portfolio_summary_title: 'Valeur du Portefeuille',
    total_gain_loss: 'Gain / Perte Total',
    total_cost_basis: "Base de Coût d'Achat",
    todays_return: "Rendement d'aujourd'hui",
    all_time: 'Historique',
    add_stock: 'Ajouter une Action',
    holdings_count_label: 'Positions',
    monitored_stocks: 'surveillées',
    log_your_stocks: 'Enregistrer vos actions',
    portfolio_ready: 'Votre portefeuille est prêt',
    portfolio_ready_desc: 'Enregistrez vos actions mondiales pour recevoir des mises à jour et conseils de timing éducatifs.',

    // Stocks to Watch
    stocks_to_watch_title: 'Actions à Surveiller',
    search_placeholder: 'Rechercher une action (ex: MC.PA, NVDA, AAPL)...',
    live_matches: 'Résultats en direct',
    indexed_equities: 'Actions Répertoriées',
    watching_remove: 'Surveillée (Retirer)',
    add_to_watch: 'Ajouter à la liste',
    instant_add: 'Ajout Direct: Surveiller',
    watch_empty_title: 'Votre liste de surveillance est vide',
    watch_empty_desc: 'Recherchez une action ci-dessus et cliquez sur "+ Ajouter à la liste".',
    no_filter_match: "Aucune action surveillée n'a le signal:",
    show_all_watched: 'Afficher Toutes les Actions',

    // Notifications Center
    alerts_title: 'Alertes & Notifications',
    alerts_subtitle: 'Signaux de timing pour portefeuille et favoris',
    unread_alerts: 'alertes non lues',
    mark_all_read: 'Tout marquer comme lu',
    clear_all: 'Effacer',
    no_alerts_title: 'Aucune alerte',
    no_alerts_desc: 'Lorsque vos actions changent de signal de timing, les alertes apparaîtront ici.',
    holding_alert_label: 'En Portefeuille',
    watchlist_alert_label: 'Surveillée',
    price_at_alert: "Prix lors de l'alerte",
    view_analysis: "Voir l'analyse",

    // Settings
    settings_title: 'Paramètres & Alertes',
    settings_subtitle: 'Configurez alertes, langue, abonnement et flux de marché.',
    language_section_title: 'Langue (Language)',
    language_section_desc: "Choisissez votre langue d'affichage.",
    currency_section_title: 'Devise Principale',
    notifications_card_title: 'Alertes de Timing',
    personal_holdings_alerts: 'Alertes du Portefeuille',
    personal_holdings_desc: "Notifier lors d'une fenêtre d'achat, achat fort ou prise de bénéfices.",
    watchlist_alerts: 'Alertes des Actions Surveillées',
    watchlist_desc: 'Notifier lors de signaux majeurs (Achat Fort ou Risque Élevé).',
    signal_filter_level: "Niveau de filtre d'alerte",
    all_timing_changes: 'Tous les changements',
    high_urgency_only: 'Haute urgence uniquement',
    test_holding_alert_btn: 'Test Alerte Portefeuille (AAPL)',
    test_watchlist_alert_btn: 'Test Alerte Surveillance (NVDA)',
    strict_disclosure_title: "Avertissement Légal & Divulgation d'Information",
    strict_disclosure_text: "InvestLearn est un outil éducatif de suivi de portefeuille. Ne fournit pas de conseils financiers et n'exécute aucun ordre.",
    membership_status: "Statut de l'Abonnement",
    data_management: 'Gestion des Données',
    clear_positions: 'Effacer les positions',
    reset_onboarding: "Réinitialiser l'accueil",

    // Pro / Subscription
    claim_lifetime_pass: 'Obtenir le Pass à Vie pour $49.99',
    founders_lifetime_title: 'Pass à Vie Membre Fondateur (Limité)',
    founders_lifetime_desc: 'Payez une seule fois, accès illimité à vie sans abonnement.',
    save_33_percent: 'Économisez 33%',
    annual_membership: 'Abonnement Annuel',
    monthly_flex: 'Mensuel Flexible',
    free_trial_active: "Essai Gratuit de 30 Jours en Cours",
    spots_remaining: 'places restantes',
    restore_purchases: 'Restaurer les achats'
  }
};

export const translations: Record<SupportedLanguage, Record<string, string>> = (
  Object.keys(baseTranslations) as SupportedLanguage[]
).reduce((acc, lang) => {
  acc[lang] = {
    ...baseTranslations[lang],
    ...(contentTranslations[lang] || {})
  };
  return acc;
}, {} as Record<SupportedLanguage, Record<string, string>>);
