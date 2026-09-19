# InvestLearn - Beginner Investment Learning & Stock Exchange Tracker

A mobile-first web app (wrapped with Capacitor for Android APK and iOS) designed to teach beginners how to invest through real-time portfolio tracking and intelligent, plain-English timing advice.

---

## Key Features

1. **Portfolio Tracking**: Log shares, cost basis, purchase dates, and personal investment theses. Automatically computes total net worth, all-time return, today's profit/loss, and asset distribution.
2. **Dual-Mode Market Data**:
   - **24/7 Educational Simulation Engine**: Micro-ticks and realistic volatility for 25+ equities across Tech, Index ETFs, Clean Energy, Financials, and Healthcare.
   - **Live API Integration**: Support for Finnhub Free Tier API with in-app token validation and connection testing.
3. **Intelligent Timing Advice Engine**:
   - **RSI (14-period)**: Detects oversold bargain zones (<30) and overbought danger zones (>70).
   - **MACD (12, 26, 9 EMA)**: Identifies bullish/bearish momentum crossovers.
   - **Moving Averages (SMA 50 & 200)**: Highlights institutional support floors and Golden Crosses.
   - **Volume Surges**: Validates whether price moves are backed by institutional accumulation.
   - **Beginner Analogies**: Every technical metric is paired with plain-English analogies (rubber bands, speedometers, foundational bedrock).
4. **Investor Academy & Interactive Quiz**:
   - 5 core interactive lessons on indicators and risk management.
   - Jargon Buster searchable glossary.
   - 3-question knowledge check quiz with instant feedback and celebratory confetti.
5. **Dollar-Cost Averaging (DCA) What-If Tool**:
   - Calculate how adding shares at current market prices updates your average cost basis.
6. **Regulatory Compliance & Risk Disclosures**:
   - Prominent, persistent disclaimers.
   - 18+ age verification gate.
   - Full legal risk notice covering market loss, data delays, and no guaranteed returns.

---

## Design System (Pixel Painter 🎨 Specs)
- **Deep Navy Blue**: `#1E3A8A` / `#0A1128` (professional, trust-building dark mode base)
- **Growth Green**: `#059669` / `#10B981` (profits, buy opportunities)
- **Action Gold**: `#F59E0B` (educational callouts, cautions)
- **Loss Red**: `#EF4444` (down trends, trim/sell signals)
- **Typography**: Inter for UI headers, Roboto for body text, JetBrains Mono for numerical financial figures.

---

## Deploying Live to Vercel

You can deploy and test this live on Vercel in 2 minutes:

### Option A: Via GitHub (Recommended)
1. Initialize a git repository in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of InvestLearn"
   ```
2. Push to your GitHub / GitLab account:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/investlearn.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) -> **Add New Project** -> Import your GitHub repo.
4. Framework Preset: **Vite** (detected automatically).
5. Click **Deploy**. Vercel will build and host your live app with a public URL!

### Option B: Via Vercel CLI
If you have `vercel` installed locally or via `npx`:
```bash
npx vercel
```
Follow the prompts to link your Vercel account and deploy.

---

## Mobile APK Packaging (Capacitor)

This project includes pre-configured `capacitor.config.ts` (`appId: com.stocklearner.app`).

To build and launch in Android Studio:
```bash
# 1. Build web distribution
npm run build

# 2. Add Android native platform (first time)
npx cap add android

# 3. Sync web assets
npx cap sync

# 4. Open in Android Studio to build APK
npx cap open android
```

---

## Legal Compliance Disclaimer

> **This application is an educational tool ONLY and does NOT provide financial advice, recommendations, or investment guidance. All trading decisions are the sole responsibility of the user.**
>
> - **MARKET RISK WARNING**: Stock market investments carry significant risk of loss. Past performance does not guarantee future results. Never invest money you cannot afford to lose.
> - **DATA DELAY NOTICE**: Free tier data may be delayed by up to 15 minutes. Always verify prices before executing live trades.
> - **NO GUARANTEED RETURNS**: Signals and timing recommendations are based on educational technical indicators, not insider information or professional advice.
> - **USE AT YOUR OWN RISK**: By using this application, you acknowledge that you are responsible for all investment decisions made through or influenced by the information provided herein.
# Stock-Tracker-App
# Stock-Tracker-App
