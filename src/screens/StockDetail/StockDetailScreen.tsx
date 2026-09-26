import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Lock,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus
} from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';
import { stockService } from '../../services/stockService';
import { PriceChart } from '../../components/StockDetail/PriceChart';
import { TechnicalGauges } from '../../components/StockDetail/TechnicalGauges';
import { SignalExplanation } from '../../components/StockDetail/SignalExplanation';
import { PositionStats } from '../../components/StockDetail/PositionStats';
import { AddStockModal } from '../AddStock/AddStockModal';
import { AITutorCard } from '../../components/AI/AITutorCard';
import { AITutorModal } from '../../components/AI/AITutorModal';
import { generateTimingSignal } from '../../services/signalEngine';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';

export const StockDetailScreen: React.FC = () => {
  const { selectedTicker, quotes, watchlist, toggleWatchlist } = useMarketStore();
  const { positions } = usePortfolioStore();
  const { setActiveTab, themeMode } = useSettingsStore();
  const { language, t } = useLanguageStore();

  const isLight = themeMode === 'neutral-light';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editPriceInput, setEditPriceInput] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [initialAiPrompt, setInitialAiPrompt] = useState<string | undefined>(undefined);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const stock = selectedTicker ? quotes[selectedTicker.toUpperCase()] : Object.values(quotes)[0];

  useEffect(() => {
    if (stock?.ticker) {
      stockService.refreshStockQuote(stock.ticker);
    }
  }, [stock?.ticker]);

  if (!stock) {
    return (
      <div className={`p-6 text-center ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
        <p>No stock selected.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-3 px-6 py-3 bg-[#007AFF] text-white rounded-lg text-sm font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const signal = generateTimingSignal(stock, language);
  const position = positions.find(p => p.ticker.toUpperCase() === stock.ticker.toUpperCase());
  const isWatched = watchlist.includes(stock.ticker.toUpperCase());
  const isPositive = stock.change >= 0;
  const curr = stock.currencySymbol || '$';

  return (
    <div className={`flex-1 flex flex-col pb-28 space-y-4 transition-colors ${
      isLight ? 'bg-[#F2F2F7] text-[#000000]' : 'bg-[#070D1E] text-slate-100'
    }`}>
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            data-touch-target="true"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition border cursor-pointer active:scale-90 ${
              isLight 
                ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#F2F2F7] shadow-xs' 
                : 'bg-navy-900 border-navy-800 text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h2 className={`text-base font-bold font-mono ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                {stock.ticker}
              </h2>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                isLight 
                  ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.08)]' 
                  : 'bg-navy-800 text-slate-300 border-navy-700'
              }`}>
                {stock.exchange}
              </span>
            </div>
            <p className={`text-[13px] truncate max-w-[200px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              {stock.name} ({stock.country})
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleWatchlist(stock.ticker)}
            data-touch-target="true"
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-90 ${
              isWatched
                ? isLight ? 'bg-[#FF9500]/15 border-[#FF9500]/40 text-[#FF9500]' : 'bg-gold-500/20 border-gold-500 text-gold-400'
                : isLight ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#8E8E93] hover:text-black shadow-xs' : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-5 h-5 ${isWatched ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Current Price & Day Stats Header */}
        <div className={`rounded-2xl p-4 transition-all border ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
            : 'bg-navy-900/90 border-navy-800 shadow-sm'
        }`}>
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              {isEditingPrice ? (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold font-mono">{curr}</span>
                  <input
                    type="number"
                    step="any"
                    autoFocus
                    value={editPriceInput}
                    onChange={(e) => setEditPriceInput(e.target.value)}
                    placeholder={stock.price.toString()}
                    className={`w-32 rounded-lg px-2.5 py-1 font-mono text-lg border focus:outline-none ${
                      isLight 
                        ? 'bg-[#F2F2F7] border-[#007AFF] text-black' 
                        : 'bg-navy-950 border-growth-500 text-white'
                    }`}
                  />
                  <button
                    onClick={() => {
                      const val = parseFloat(editPriceInput);
                      if (val > 0) {
                        stockService.updateStockPrice(stock.ticker, val);
                      }
                      setIsEditingPrice(false);
                    }}
                    className="p-2 bg-[#007AFF] text-white rounded-lg transition"
                    title="Save New Price"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingPrice(false)}
                    className="p-2 bg-[#E5E5EA] text-black rounded-lg transition text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-extrabold font-mono tracking-tight ${
                    isLight ? 'text-[#000000]' : 'text-white'
                  }`}>
                    {curr}{stock.price.toLocaleString('en-US', { minimumFractionDigits: stock.price < 10 ? 2 : stock.price > 1000 ? 0 : 2 })}
                  </span>
                  <span className={`text-xs font-mono ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                    {stock.currency}
                  </span>
                  <button
                    onClick={() => {
                      setEditPriceInput(stock.price.toString());
                      setIsEditingPrice(true);
                    }}
                    className={`ml-1 transition ${isLight ? 'text-[#8E8E93] hover:text-black' : 'text-slate-500 hover:text-slate-300'}`}
                    title="Sync or Update Price"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className={`flex items-center gap-1 mt-1 text-[13px] font-mono font-bold ${
                isPositive 
                  ? isLight ? 'text-[#34C759]' : 'text-growth-400' 
                  : isLight ? 'text-[#FF3B30]' : 'text-loss-500'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}{curr}{Math.abs(stock.change).toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                <span className={`text-[11px] font-sans ml-1 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                  {t('detail_today', 'Today')}
                </span>
              </div>
            </div>

            <div className={`text-right text-[12px] font-mono space-y-0.5 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              <div>{t('detail_high', 'High:')} <strong className={isLight ? 'text-black' : 'text-slate-200'}>{curr}{stock.high.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
              <div>{t('detail_low', 'Low:')} <strong className={isLight ? 'text-black' : 'text-slate-200'}>{curr}{stock.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
            </div>
          </div>

          {/* Wireframe 2: Progressive Disclosure Accordion Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)] text-center font-mono text-xs">
            <div 
              onClick={() => setExpandedMetric(expandedMetric === 'cap' ? null : 'cap')}
              className={`p-2.5 rounded-xl border cursor-pointer transition ${
                isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] hover:bg-[#E8E8ED]' : 'bg-navy-950/60 border-navy-800'
              }`}
            >
              <span className={`text-[11px] font-sans block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('detail_market_cap', 'Market Cap')}
              </span>
              <strong className={`text-xs ${isLight ? 'text-[#000000]' : 'text-white'}`}>{stock.marketCap}</strong>
            </div>

            <div 
              onClick={() => setExpandedMetric(expandedMetric === 'pe' ? null : 'pe')}
              className={`p-2.5 rounded-xl border cursor-pointer transition ${
                isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] hover:bg-[#E8E8ED]' : 'bg-navy-950/60 border-navy-800'
              }`}
            >
              <span className={`text-[11px] font-sans block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('detail_pe_ratio', 'P/E Ratio')}
              </span>
              <strong className={`text-xs ${isLight ? 'text-[#000000]' : 'text-white'}`}>{stock.peRatio}x</strong>
            </div>

            <div 
              onClick={() => setExpandedMetric(expandedMetric === 'vol' ? null : 'vol')}
              className={`p-2.5 rounded-xl border cursor-pointer transition ${
                isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] hover:bg-[#E8E8ED]' : 'bg-navy-950/60 border-navy-800'
              }`}
            >
              <span className={`text-[11px] font-sans block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('detail_volume', 'Volume')}
              </span>
              <strong className={`text-xs ${isLight ? 'text-[#000000]' : 'text-white'}`}>{(stock.volume / 1000000).toFixed(1)}M</strong>
            </div>
          </div>

          {/* Accordion detail explanation (0.3s transition) */}
          {expandedMetric && (
            <div className={`mt-2.5 p-3 rounded-xl text-[13px] leading-relaxed border transition-all duration-300 ${
              isLight ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950 text-slate-300 border-navy-800'
            }`}>
              {expandedMetric === 'cap' && (
                <p>💡 <strong>{t('detail_market_cap', 'Market Cap')}:</strong> {language === 'ko' ? `${stock.ticker}의 총 발행주식에 현재가를 곱한 전체 시장 가치입니다. 기업의 규모와 체급을 나타냅니다.` : `The total dollar market value of ${stock.ticker}'s outstanding shares. It indicates company size and risk category.`}</p>
              )}
              {expandedMetric === 'pe' && (
                <p>💡 <strong>{t('detail_pe_ratio', 'P/E Ratio')}:</strong> {language === 'ko' ? `현재 주가를 주당순이익(EPS)으로 나눈 값으로, 기업이 버는 이익 대비 주가가 저렴한지 비싼지 평가하는 대표 지표입니다.` : `Measures ${stock.ticker}'s current share price relative to its per-share earnings. Helps assess whether a stock is cheap or expensive.`}</p>
              )}
              {expandedMetric === 'vol' && (
                <p>💡 <strong>{t('detail_volume', 'Volume')}:</strong> {language === 'ko' ? `오늘 하루 동안 거래된 ${stock.ticker}의 총 주식 수량입니다. 대량 거래량은 시장의 강한 매수/매도 확신을 대변합니다.` : `The total number of ${stock.ticker} shares traded today. Higher volume confirms stronger market interest and liquid entry/exit.`}</p>
              )}
            </div>
          )}
        </div>

        {/* Informational Trading Disclaimer Callout */}
        <div className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs border ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#666666] shadow-xs' 
            : 'bg-navy-950/80 border-navy-800 text-slate-400'
        }`}>
          <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
          <p className="leading-relaxed">
            <strong className={isLight ? 'text-black' : 'text-slate-200'}>
              {t('detail_edu_tool_only', 'Educational Tool Only:')}
            </strong>{' '}
            {t('detail_broker_notice', 'InvestLearn tracks metrics and educational timing indicators. Execute actual transactions through your licensed stockbroker.')}
          </p>
        </div>

        {/* Interactive Price Chart with Timeframes */}
        <PriceChart history={stock.history} currentPrice={stock.price} />

        {/* Gemini AI Market Tutor Card & 1-Tap Prompts */}
        <AITutorCard
          stock={stock}
          onOpenChat={(prompt) => {
            setInitialAiPrompt(prompt);
            setIsAiModalOpen(true);
          }}
        />

        {/* Intelligent Timing Advice & Beginner Breakdown */}
        <SignalExplanation signal={signal} />

        {/* Visual Technical Gauges (RSI, MACD, SMAs, Volume) */}
        <TechnicalGauges indicators={stock.indicators} currentPrice={stock.price} />

        {/* User's Position & Dollar-Cost Averaging Calculator */}
        <PositionStats
          stock={stock}
          position={position}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Wireframe 2: Persistent Bottom Thumb Zone Actions */}
      <div className={`sticky bottom-14 left-0 right-0 p-3 mx-4 rounded-2xl border backdrop-blur-md z-30 shadow-lg flex items-center justify-between gap-2.5 transition-colors ${
        isLight ? 'bg-white/95 border-[rgba(0,0,0,0.12)]' : 'bg-navy-950/95 border-navy-800'
      }`}>
        <button
          type="button"
          data-touch-target="true"
          onClick={() => setIsAddModalOpen(true)}
          className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm ${
            isLight ? 'bg-[#007AFF] hover:bg-[#0062CC]' : 'bg-growth-600 hover:bg-growth-500'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{position ? t('detail_in_portfolio', 'In Portfolio') : t('detail_log_to_portfolio', '+ Log Holding')}</span>
        </button>

        <button
          type="button"
          data-touch-target="true"
          onClick={() => {
            setInitialAiPrompt(
              language === 'ko'
                ? `${stock.ticker}의 현재 타이밍 신호와 RSI 보조지표를 초보자 눈높이에서 쉽게 설명해 주실 수 있나요?`
                : `Can you explain the current timing signals and RSI for ${stock.ticker}?`
            );
            setIsAiModalOpen(true);
          }}
          className={`flex-1 min-h-[48px] px-3 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm ${
            isLight ? 'bg-[#34C759] hover:bg-[#2EB84E]' : 'bg-gold-600 hover:bg-gold-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'ko' ? 'AI 튜터 질문' : 'Ask AI Tutor'}</span>
        </button>
      </div>

      {isAddModalOpen && (
        <AddStockModal
          preselectedTicker={stock.ticker}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isAiModalOpen && (
        <AITutorModal
          stock={stock}
          initialPrompt={initialAiPrompt}
          onClose={() => {
            setIsAiModalOpen(false);
            setInitialAiPrompt(undefined);
          }}
        />
      )}
    </div>
  );
};
