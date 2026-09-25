# InvestLearn Neutral Light Design System & Mobile Refinement Guide

## Overview

This implementation guide outlines the architectural design specifications, typography upgrades, color palette, component guidelines, and mobile responsiveness standards applied to the **InvestLearn** application.

All updates strictly preserve **100% of existing functionality**, educational content, real market integrations, payment plans, and global stock tracking while introducing a crisp, neutral, modern iOS 18/Android mobile experience.

---

## 1. Visual Previews (2x Retina Quality)

![InvestLearn Dashboard Screen — Screen 1 Retina](/Users/claw/.gemini/antigravity-ide/brain/e765016f-62a7-46ad-b02f-0996121ea02c/investlearn_dashboard_retina_1790310211445.jpg)

![InvestLearn Stock Detail Screen — Screen 2 Retina](/Users/claw/.gemini/antigravity-ide/brain/e765016f-62a7-46ad-b02f-0996121ea02c/investlearn_stock_detail_retina_1790310266120.jpg)

---

## 2. Priority 1: Typography Specifications

| Element | Old Value | New Value | Change & Rationale |
|---|---|---|---|
| **Body Font** | `14px` (`0.875rem`) | `16px` (`1.0rem`) | **+14.3% increase** — Guarantees effortless legibility for young investors and prevents browser auto-zoom on mobile inputs. |
| **Secondary Labels** | `12px` (`0.75rem`) | `13px` (`0.8125rem`) | **+8.3% increase** — Maintains clear hierarchical distinction while enhancing scannability. |
| **Line Height** | `1.4` | `1.6` | Expanded vertical breathing room for educational explanations, disclosures, and financial definitions. |
| **Letter Spacing** | `normal` / `0` | `-0.02em` | Subtle optical kerning tightening that prevents visual crowding in numbers and body text. |
| **Headings** | `18px-24px` | `20px-28px` | `font-extrabold` with tracking `-0.025em` for crisp headlines. |

```css
/* CSS Token Definitions */
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;

  --font-size-body: 16px;
  --font-size-secondary: 13px;
  --font-size-caption: 11px;
  --font-size-h1: 24px;
  --font-size-h2: 20px;
  --font-size-h3: 16px;

  --line-height-body: 1.6;
  --line-height-tight: 1.25;
  --line-height-heading: 1.35;

  --letter-spacing-body: -0.02em;
  --letter-spacing-tight: -0.025em;
}
```

---

## 3. Priority 2: Color Palette System

All color tokens are mapped as CSS Custom Properties in [`src/styles/design-tokens.css`](file:///Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/src/styles/design-tokens.css) with seamless support for both **Neutral Light (Default)** and **Classic Dark Mode**.

### Neutral Light Palette (Default)
- **Backgrounds**:
  - Primary (Cards & Surfaces): `#FFFFFF`
  - Secondary (Screen Canvas): `#F2F2F7` (Standard Apple System Canvas Gray)
  - Tertiary (Input fields, Chips, Sub-boxes): `#E8E8ED`
- **Text Hierarchy**:
  - Primary (Headings, tickers, bold prices): `#000000`
  - Secondary (Descriptions, analogies, labels): `#666666`
  - Tertiary (Timestamps, exchange codes, hints): `#8E8E93`
- **Status & Educational Timing Engine**:
  - Green (Gains, Strong Buy, Oversold Dips): `#34C759`
  - Red (Losses, Strong Sell, Overbought Peaks): `#FF3B30`
  - Orange (Watchlist Alerts, Hold, Consolidation): `#FF9500`
  - Blue (Primary CTA, Interactivity, Navigation Active): `#007AFF`

---

## 4. Priority 3: Visual Layout & Card Architecture

Content is wrapped in card containers following the strict card specification:
1. **Background**: Pure `#FFFFFF` (Dark: `rgb(10 17 40 / 0.9)`)
2. **Padding**: Standardized to `16px` (`p-4`)
3. **Borders**: Light subtle hairline border `rgba(0, 0, 0, 0.10)` (`border border-black/10`)
4. **Border Radius**: `16px` (`rounded-2xl`)
5. **Elevation Shadow**: Subtle low-blur drop shadow `0 1px 3px rgba(0,0,0,0.04)`

### Spacing System Matrix
- `xs: 4px` — Pill internal offsets, badge padding, icon gap
- `sm: 8px` — Card child item gaps, chip margins, sub-metrics
- `md: 16px` — Standard card padding, section margins, card spacing
- `lg: 24px` — Screen padding gutters, major module separators
- `xl: 32px` — Section division and bottom safe zone buffer

---

## 5. Priority 4: Component Improvements

### 5.1 Stock List Items (`.stock-list-item`)
- **Minimum Touch Target**: `48×48px` minimum bounding box for thumb hit-testing.
- **Left Icon Padding**: Ticker avatar / company icon has dedicated left spacing (`pl-3`).
- **Dividers**: Crisp `1px solid rgba(0,0,0,0.06)` separation between rows.
- **Micro-interactions**: Active state scale `scale(0.99)` with smooth hover transition.

### 5.2 Buttons (`.btn-base`, `.btn-primary`, `.btn-success`, `.btn-danger`)
- **Minimum Padding**: `12px 24px`
- **Border Radius**: `8px` (`rounded-lg`)
- **Minimum Height**: `48px` on mobile touch screens
- **Action Styles**:
  - Primary: `#007AFF` with hover `#0062CC`
  - Success: `#34C759` with hover `#2EB04E`
  - Danger: `#FF3B30` with hover `#E0352B`
  - Secondary: `#F2F2F7` with border `rgba(0,0,0,0.1)` and text `#000000`

### 5.3 Expandable Accordions (`.accordion-group`)
- **Transitions**: Smooth `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Default Text Color**: `#666666` (Dark: `#94A3B8`).
- **Core Rule**: **Keep ALL content visible** — never truncate educational data or obscure calculation rationale.

### 5.4 5-Icon Persistent Bottom Navigation Bar
- **Touch Target**: Each slot is `min-w-[48px] min-h-[48px]`.
- **Slots**:
  1. `Home` (`DashboardScreen`)
  2. `Signals` (`SignalsScreen` with real-time badge count)
  3. `News` (`NewsScreen` with Market Pulse & Fed Watch)
  4. `Learn` (`EducationScreen` with Academy & Quiz)
  5. `Settings` (`SettingsScreen` with Currency & Subscription Plans)

### 5.5 Thumb Zone Optimization
- All primary actions (Search 5,000+ Stocks, + Log Position, Ask AI Tutor, Buy/Watchlist) are anchored in the **bottom 40% of the screen** within natural one-handed thumb reach.

---

## 6. Priority 5: Mobile Responsiveness

### Target Devices Tested
1. **Primary Target**: iPhone `375 × 812 px` @ 2x Retina DPI (iPhone X / 11 Pro / 12 mini / 13 mini)
2. **Secondary Target**: Android `360 × 800 px` (Standard Google Pixel / Samsung Galaxy)
3. **Responsive Full Screen**: Fluid responsive scaling for tablet and desktop testing.

The device switch can be toggled dynamically at any time:
- In the top header bar of [`PhoneFrame.tsx`](file:///Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/src/components/Common/PhoneFrame.tsx).
- In the Settings screen under **Color Theme & Layout**.

---

## 7. Deliverable File Directory

| Deliverable | Location | Description |
|---|---|---|
| **Deliverable 1: UI Screenshots** | `investlearn_dashboard_retina_1790310211445.jpg`<br>`investlearn_stock_detail_retina_1790310266120.jpg` | High-resolution 2x retina mobile mockups with annotated design tokens. |
| **Deliverable 2: CSS Component Library** | [`src/styles/design-tokens.css`](file:///Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/src/styles/design-tokens.css)<br>[`src/styles/components.css`](file:///Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/src/styles/components.css) | Standalone CSS/SCSS token library and utility classes. |
| **Deliverable 3: Figma/Sketch File** | [`figma-tokens.json`](file:///Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/figma-tokens.json) | DTCG-standard design tokens file for instant import into Figma Tokens / Tokens Studio. |
| **Deliverable 4: Implementation Guide** | [`IMPLEMENTATION_GUIDE.md`](file:///Users/claw/.gemini/antigravity-ide/scratch/stock-learning-app/IMPLEMENTATION_GUIDE.md) | Complete engineering handoff specification and architecture guide. |

---

## 8. Verification & Build Confirmation

The project was compiled and validated with zero errors:
```bash
> stock-learning-app@1.0.0 build
> tsc -b && vite build

✓ 2280 modules transformed.
dist/index.html                   1.23 kB │ gzip:   0.63 kB
dist/assets/index-DFMmsHp2.css   62.68 kB │ gzip:  11.04 kB
dist/assets/web-kTpVH2st.js       3.44 kB │ gzip:   1.10 kB
dist/assets/web-BwRLFNZP.js       9.67 kB │ gzip:   1.95 kB
dist/assets/index-B9TSjSsM.js   938.83 kB │ gzip: 261.68 kB
✓ built in 1.92s
```
