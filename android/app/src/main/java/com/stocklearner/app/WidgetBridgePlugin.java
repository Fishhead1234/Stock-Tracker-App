package com.stocklearner.app;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Capacitor Plugin that bridges React state to the native Android Home Screen Widget.
 */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void updateWidgetData(PluginCall call) {
        try {
            String netWorth = call.getString("netWorth", "$0.00");
            String pnlText = call.getString("pnlText", "+$0.00 (+0.0%)");
            boolean isPositive = Boolean.TRUE.equals(call.getBoolean("isPositive", true));
            String radarTitle = call.getString("radarTitle", "DAILY WISDOM");
            String actionBadge = call.getString("actionBadge", "TIP");
            String headline = call.getString("headline", "Dollar-Cost Averaging");
            String subtext = call.getString("subtext", "Regular investing smooths out volatility and lowers your average entry price.");
            boolean isTip = Boolean.TRUE.equals(call.getBoolean("isTip", true));
            String updatedTime = call.getString("updatedTime", "Live");

            SharedPreferences prefs = getContext().getSharedPreferences(
                    InvestLearnWidgetProvider.PREFS_NAME,
                    Context.MODE_PRIVATE
            );
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString("net_worth", netWorth);
            editor.putString("pnl_text", pnlText);
            editor.putBoolean("is_positive", isPositive);
            editor.putString("radar_title", radarTitle);
            editor.putString("action_badge", actionBadge);
            editor.putString("signal_headline", headline);
            editor.putString("signal_subtext", subtext);
            editor.putBoolean("is_tip", isTip);
            editor.putString("updated_time", updatedTime);
            editor.apply();

            // Notify all active widgets on the user's home screen
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
        JSObject res = new JSObject();
        res.put("targetTab", targetTab != null ? targetTab : "");
        MainActivity.clearLastTargetTab();
        call.resolve(res);
    }
}
