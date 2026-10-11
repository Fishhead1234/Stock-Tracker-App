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
        JSObject res = new JSObject();
        res.put("targetTab", targetTab != null ? targetTab : "");
        res.put("ticker", ticker != null ? ticker : "");
        MainActivity.clearLastTargetTab();
        call.resolve(res);
    }
}
