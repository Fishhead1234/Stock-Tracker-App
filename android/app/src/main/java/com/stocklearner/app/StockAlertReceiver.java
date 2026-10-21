package com.stocklearner.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Locale;
import java.util.Random;

/**
 * Native Android BroadcastReceiver that evaluates stock timing signals in the background
 * and triggers heads-up notifications even when the app is completely closed or device is locked.
 */
public class StockAlertReceiver extends BroadcastReceiver {

    public static final String ACTION_CHECK_ALERTS = "com.stocklearner.app.ACTION_CHECK_ALERTS";
    public static final String ACTION_TEST_NOTIFICATION = "com.stocklearner.app.ACTION_TEST_NOTIFICATION";
    public static final String CHANNEL_ID = "stock-signals";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();

        ensureNotificationChannel(context);

        // 1. Direct test background notification trigger
        if (ACTION_TEST_NOTIFICATION.equals(action)) {
            String ticker = intent.getStringExtra("ticker");
            if (ticker == null || ticker.isEmpty()) ticker = "AAPL";
            String title = intent.getStringExtra("title");
            if (title == null || title.isEmpty()) title = "Holding Alert: " + ticker + " Buy Window";
            String message = intent.getStringExtra("message");
            if (message == null || message.isEmpty()) {
                message = ticker + " entered an attractive accumulation zone near support. (Sent from Android background engine)";
            }
            sendNotification(context, 1001, ticker, title, message);
            return;
        }

        // 2. Periodic background market check
        SharedPreferences prefs = context.getSharedPreferences(
                InvestLearnWidgetProvider.PREFS_NAME,
                Context.MODE_PRIVATE
        );

        boolean notificationsEnabled = prefs.getBoolean("notifications_enabled", true);
        if (!notificationsEnabled) {
            return;
        }

        boolean notifyHoldings = prefs.getBoolean("notify_holdings", true);
        boolean notifyWatchlist = prefs.getBoolean("notify_watchlist", true);
        String sensitivity = prefs.getString("notification_sensitivity", "ALL_TIMING_SIGNALS");
        String holdingsJson = prefs.getString("holdings_json", "[]");
        String watchlistJson = prefs.getString("watchlist_json", "[]");

        long now = System.currentTimeMillis();

        try {
            boolean notificationSent = false;
            JSONArray holdingsArray = new JSONArray(holdingsJson);

            // A. Check Personal Holdings first (highest priority) - calibrated to user's average buy price
            if (notifyHoldings && holdingsArray.length() > 0) {
                for (int i = 0; i < holdingsArray.length(); i++) {
                    JSONObject holding = holdingsArray.getJSONObject(i);
                    String ticker = holding.optString("ticker", "");
                    String signalAction = holding.optString("action", "HOLD");
                    String currentPrice = holding.optString("currentPrice", holding.optString("subtitle", "$0.00"));
                    double avgBuyPrice = holding.optDouble("averageBuyPrice", 0.0);
                    String avgBuyPriceStr = holding.optString("averageBuyPriceFormatted", avgBuyPrice > 0 ? String.format(Locale.US, "$%.2f", avgBuyPrice) : "");
                    double pnlPercent = holding.optDouble("pnlPercent", 0.0);
                    String feedback = holding.optString("costBasisFeedback", "");
                    String strategy = holding.optString("holdingStrategy", "");
                    String pnl = holding.optString("pnl", "");

                    String lastNotifiedAction = prefs.getString("last_notif_action_" + ticker, "");
                    long lastNotifTickerTime = prefs.getLong("last_notif_time_" + ticker, 0);

                    // Skip if notified in the last 2 hours for the exact same action
                    if (signalAction.equalsIgnoreCase(lastNotifiedAction) && (now - lastNotifTickerTime < 2 * 3600 * 1000L)) {
                        continue;
                    }

                    // Sensitivity check
                    if ("HIGH_CONVICTION_ONLY".equals(sensitivity) && !signalAction.contains("STRONG")) {
                        continue;
                    }

                    String notifTitle;
                    String notifBody;

                    String pnlSign = pnlPercent >= 0 ? "+" : "";
                    String pnlFormatted = pnlSign + String.format(Locale.US, "%.1f", pnlPercent) + "%";

                    boolean isETF = holding.optBoolean("isETF", false) || "INDEX_ETF".equals(holding.optString("assetClass", ""));

                    // Cost-Basis Calibrated Feedback (ETF-Aware)
                    if ("DCA_INDEX_DIP".equals(strategy) || (isETF && pnlPercent <= -5.0)) {
                        notifTitle = "🟢 Index Sale (DCA): " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " is down " + pnlFormatted + " below your cost basis. Broad index funds carry zero bankruptcy risk—prime DCA accumulation window!";
                    } else if ("HOLD_COMPOUNDER".equals(strategy) || (isETF && pnlPercent >= 18.0)) {
                        notifTitle = "🛡️ Compounding Strong: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " is up " + pnlFormatted + " past your " + avgBuyPriceStr + " cost basis. Broad index funds compound over decades—let winners run!";
                    } else if ("TRIM_PROFIT".equals(strategy) || (!isETF && pnlPercent >= 18.0) || (signalAction.contains("SELL") && pnlPercent >= 10.0)) {
                        notifTitle = "💰 Take Profit: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " (" + currentPrice + ") is " + pnlFormatted + " above your " + avgBuyPriceStr + " avg cost. Consider trimming partial shares to lock in gains.";
                    } else if ("STOP_LOSS".equals(strategy) || (!isETF && (pnlPercent <= -10.0 || (signalAction.contains("SELL") && pnlPercent <= -7.0)))) {
                        notifTitle = "⚠️ Capital Defense: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " (" + currentPrice + ") has dropped " + pnlFormatted + " below your " + avgBuyPriceStr + " avg buy price. Review stop-loss rules to protect principal.";
                    } else if ("DCA_DIP".equals(strategy) || (signalAction.contains("BUY") && pnlPercent <= -3.0)) {
                        notifTitle = "🟢 DCA Opportunity: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " (" + currentPrice + ") is down " + pnlFormatted + " below your " + avgBuyPriceStr + " avg cost with technical support. Good window to lower average price.";
                    } else if (signalAction.contains("BUY")) {
                        notifTitle = "🟢 Buy Window: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " (" + currentPrice + ") shows strong upward momentum (" + pnlFormatted + " vs " + avgBuyPriceStr + " cost basis).";
                    } else if (pnlPercent >= 3.0) {
                        // Holding winner - periodic update if over 6 hours since last note
                        if (now - lastNotifTickerTime < 6 * 3600 * 1000L) continue;
                        notifTitle = "📈 Holding Winner: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " is performing well (" + pnlFormatted + " above your " + avgBuyPriceStr + " avg cost). Trend remains constructive—let winners run.";
                    } else {
                        // General holding update if over 6 hours since last note
                        if (now - lastNotifTickerTime < 6 * 3600 * 1000L) continue;
                        notifTitle = "📊 Holding Status: " + ticker + " (" + pnlFormatted + ")";
                        notifBody = !feedback.isEmpty()
                                ? feedback
                                : ticker + " is currently " + currentPrice + " vs your " + avgBuyPriceStr + " cost basis (" + pnlFormatted + "). Position steady.";
                    }

                    int notifId = Math.abs(ticker.hashCode());
                    sendNotification(context, notifId, ticker, notifTitle, notifBody);

                    prefs.edit()
                            .putString("last_notif_action_" + ticker, signalAction)
                            .putLong("last_notif_time_" + ticker, now)
                            .putLong("last_background_alert_time", now)
                            .apply();

                    notificationSent = true;
                    break; // Cap at 1 notification per periodic cycle to avoid notification spam
                }
            }

            // B. If no holding notification was sent, check Watchlist
            if (!notificationSent && notifyWatchlist) {
                JSONArray watchArray = new JSONArray(watchlistJson);
                if (watchArray.length() > 0) {
                    Random rand = new Random();
                    int idx = rand.nextInt(watchArray.length());
                    String ticker = watchArray.optString(idx, "");
                    long lastNotifTickerTime = prefs.getLong("last_notif_time_" + ticker, 0);

                    // At least 3 hours cooldown per watched ticker
                    if (!ticker.isEmpty() && (now - lastNotifTickerTime > 3 * 3600 * 1000L)) {
                        String notifTitle = "⭐ Watchlist Alert: " + ticker;
                        String notifBody = "Monitored stock " + ticker + " is active. Tap to view live technical timing indicators and charts.";
                        int notifId = Math.abs(ticker.hashCode());
                        sendNotification(context, notifId, ticker, notifTitle, notifBody);

                        prefs.edit()
                                .putLong("last_notif_time_" + ticker, now)
                                .putLong("last_background_alert_time", now)
                                .apply();
                    }
                }
            }

            // Also refresh home screen widgets with fresh time
            InvestLearnWidgetProvider.updateAllWidgets(context);

        } catch (Exception e) {
            e.printStackTrace();
        }

        // Re-arm next background check
        StockBackgroundScheduler.scheduleNextCheck(context);
    }

    private void sendNotification(Context context, int notificationId, String ticker, String title, String message) {
        ensureNotificationChannel(context);

        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.putExtra("targetTab", "stockDetail");
        intent.putExtra("ticker", ticker);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                notificationId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        try {
            NotificationManagerCompat.from(context).notify(notificationId, builder.build());
        } catch (SecurityException se) {
            se.printStackTrace();
        }
    }

    public static void ensureNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = context.getSystemService(NotificationManager.class);
            if (manager != null) {
                NotificationChannel existing = manager.getNotificationChannel(CHANNEL_ID);
                if (existing == null) {
                    NotificationChannel channel = new NotificationChannel(
                            CHANNEL_ID,
                            "Stock Timing Signals",
                            NotificationManager.IMPORTANCE_HIGH
                    );
                    channel.setDescription("Real-time alerts for stock buy/sell timing signals and monitored watchlist changes");
                    channel.enableLights(true);
                    channel.setLightColor(Color.parseColor("#10B981"));
                    channel.enableVibration(true);
                    channel.setVibrationPattern(new long[]{0, 250, 150, 250});
                    manager.createNotificationChannel(channel);
                }
            }
        }
    }
}
