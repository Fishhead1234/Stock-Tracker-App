export const COMPLIANCE_NOTICES = {
  PRIMARY_DISCLAIMER: 
    "This application is an educational tool ONLY and does NOT provide financial advice, recommendations, or investment guidance. All trading decisions are the sole responsibility of the user.",

  NO_IN_APP_TRADING: {
    title: "NO IN-APP TRADING - INFORMATIONAL ONLY",
    text: "This application does NOT execute trades, handle money, or connect to brokerage order routing. It is strictly an informational tracker and learning tool. You must execute all actual buy and sell orders through your own licensed broker or trading platform."
  },

  MARKET_RISK_WARNING: {
    title: "MARKET RISK WARNING",
    text: "Stock market investments carry significant risk of loss. Past performance does not guarantee future results. Never invest money you cannot afford to lose."
  },

  DATA_DELAY_NOTICE: {
    title: "DATA DELAY NOTICE",
    text: "Free tier data may be delayed by up to 15 minutes. Real-time data requires Pro subscription. Always verify prices before executing trades."
  },

  NO_GUARANTEED_RETURNS: {
    title: "NO GUARANTEED RETURNS",
    text: "Signals and timing recommendations are based on educational indicators, not insider information or professional advice. Users should conduct their own research or consult qualified financial advisors."
  },

  USE_AT_YOUR_OWN_RISK: {
    title: "USE AT YOUR OWN RISK",
    text: "By using this application, you acknowledge that you are responsible for all investment decisions made through or influenced by the information provided herein."
  },

  AGE_VERIFICATION_TEXT: "You must be 18 years of age or older to use this tracker and acknowledge that all market trading carries risk."
};

export const ALL_COMPLIANCE_ITEMS = [
  COMPLIANCE_NOTICES.NO_IN_APP_TRADING,
  COMPLIANCE_NOTICES.MARKET_RISK_WARNING,
  COMPLIANCE_NOTICES.DATA_DELAY_NOTICE,
  COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS,
  COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK,
];
