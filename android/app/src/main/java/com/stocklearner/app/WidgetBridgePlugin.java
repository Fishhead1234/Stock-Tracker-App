package com.stocklearner.app;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Capacitor Plugin that bridges React portfolio state to the native Android 2x4 Scrollable Widget.
 */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void updateWidgetData(PluginCall call) {
        try {
            String netWorth = call.getString("netWorth", "$0.00");
            String pnlText = call.getString("pnlText", "+$0.00 (+0.0%) Today");
            boolean isPositive = Boolean.TRUE.equals(call.getBoolean("isPositive", true));
            String investedHint = call.getString("investedHint", "All-Time: $0.00");
            int holdingsCount = call.getInt("holdingsCount", 0);
            String holdingsJson = call.getString("holdingsJson", "[]");
            String updatedTime = call.getString("updatedTime", "Live");

            SharedPreferences prefs = getContext().getSharedPreferences(
                    InvestLearnWidgetProvider.PREFS_NAME,
                    Context.MODE_PRIVATE
            );
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("net_worth", netWorth);
            editor.putString("pnl_text", pnlText);
            editor.putBoolean("is_positive", isPositive);
            editor.putString("invested_hint", investedHint);
            editor.putInt("holdings_count", holdingsCount);
            editor.putString("holdings_json", holdingsJson);
            editor.putString("updated_time", updatedTime);
            editor.apply();

            // Refresh all widget instances on home screen and invalidate list data
            InvestLearnWidgetProvider.updateAllWidgets(getContext());
            NovaSearchWidgetProvider.updateAllWidgets(getContext());

            JSObject res = new JSObject();
            res.put("success", true);
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to update widget: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void getInitialRoute(PluginCall call) {
        String targetTab = MainActivity.getLastTargetTab();
        String ticker = MainActivity.getLastTargetTicker();
        String prompt = MainActivity.getLastPrompt();
        boolean autoFocus = MainActivity.getLastAutoFocus();

        JSObject res = new JSObject();
        res.put("targetTab", targetTab != null ? targetTab : "");
        res.put("ticker", ticker != null ? ticker : "");
        res.put("prompt", prompt != null ? prompt : "");
        res.put("autoFocus", autoFocus);

        MainActivity.clearLastTargetTab();
        call.resolve(res);
    }

    @PluginMethod
    public void syncNotificationSettings(PluginCall call) {
        try {
            boolean enabled = Boolean.TRUE.equals(call.getBoolean("notificationsEnabled", true));
            boolean notifyHoldings = Boolean.TRUE.equals(call.getBoolean("notifyPersonalHoldings", true));
            boolean notifyWatchlist = Boolean.TRUE.equals(call.getBoolean("notifyWatchlist", true));
            String sensitivity = call.getString("sensitivity", "ALL_TIMING_SIGNALS");
            String watchlistJson = call.getString("watchlistJson", "[]");

            SharedPreferences prefs = getContext().getSharedPreferences(
                    InvestLearnWidgetProvider.PREFS_NAME,
                    Context.MODE_PRIVATE
            );
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean("notifications_enabled", enabled);
            editor.putBoolean("notify_holdings", notifyHoldings);
            editor.putBoolean("notify_watchlist", notifyWatchlist);
            editor.putString("notification_sensitivity", sensitivity);
            editor.putString("watchlist_json", watchlistJson);
            editor.apply();

            if (enabled) {
                StockAlertReceiver.ensureNotificationChannel(getContext());
                StockBackgroundScheduler.schedulePeriodicAlerts(getContext());
            } else {
                StockBackgroundScheduler.cancelPeriodicAlerts(getContext());
            }

            JSObject res = new JSObject();
            res.put("success", true);
            res.put("scheduled", enabled);
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to sync notification settings: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void scheduleBackgroundTest(PluginCall call) {
        try {
            int delaySeconds = call.getInt("delaySeconds", 5);
            String ticker = call.getString("ticker", "AAPL");
            String title = call.getString("title", "Holding Alert: " + ticker + " Buy Opportunity");
            String message = call.getString("message", ticker + " entered attractive accumulation zone. Technical support confirmed.");

            StockAlertReceiver.ensureNotificationChannel(getContext());
            StockBackgroundScheduler.scheduleTestNotification(getContext(), delaySeconds, ticker, title, message);

            JSObject res = new JSObject();
            res.put("success", true);
            res.put("delaySeconds", delaySeconds);
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to schedule background test: " + e.getMessage(), e);
        }
    }
}
