package com.stocklearner.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;

/**
 * Native Android Home Screen Widget Provider for InvestLearn.
 * Renders the Hybrid Portfolio + Timing Radar / Daily Wisdom card.
 */
public class InvestLearnWidgetProvider extends AppWidgetProvider {

    public static final String PREFS_NAME = "InvestLearnWidgetPrefs";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, InvestLearnWidgetProvider.class);
        int[] allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
        for (int widgetId : allWidgetIds) {
            updateAppWidget(context, appWidgetManager, widgetId);
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        String netWorth = prefs.getString("net_worth", "$0.00");
        String pnlText = prefs.getString("pnl_text", "+$0.00 (+0.0%)");
        boolean isPositive = prefs.getBoolean("is_positive", true);
        String radarTitle = prefs.getString("radar_title", "DAILY WISDOM");
        String actionBadge = prefs.getString("action_badge", "TIP");
        String headline = prefs.getString("signal_headline", "Dollar-Cost Averaging");
        String subtext = prefs.getString("signal_subtext", "Regular investing smooths out volatility and lowers your average entry price.");
        boolean isTip = prefs.getBoolean("is_tip", true);
        String updatedTime = prefs.getString("updated_time", "Live");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_investlearn_hybrid);

        // Populate Text Fields
        views.setTextViewText(R.id.tv_net_worth, netWorth);
        views.setTextViewText(R.id.tv_pnl_badge, pnlText);
        views.setTextViewText(R.id.tv_widget_updated, updatedTime);
        views.setTextViewText(R.id.tv_radar_title, radarTitle);
        views.setTextViewText(R.id.tv_action_badge, actionBadge);
        views.setTextViewText(R.id.tv_signal_headline, headline);
        views.setTextViewText(R.id.tv_signal_subtext, subtext);
        views.setTextViewText(R.id.tv_right_hint, isTip ? "Tap for Academy ➔" : "Tap for Timing Radar ➔");

        // Dynamic P&L pill styling
        if (isPositive) {
            views.setInt(R.id.layout_pnl_badge, "setBackgroundResource", R.drawable.widget_pill_green);
            views.setTextColor(R.id.tv_pnl_badge, Color.parseColor("#10B981"));
        } else {
            views.setInt(R.id.layout_pnl_badge, "setBackgroundResource", R.drawable.widget_pill_red);
            views.setTextColor(R.id.tv_pnl_badge, Color.parseColor("#EF4444"));
        }

        // Dynamic Action Badge styling
        String upperAction = actionBadge.toUpperCase();
        if (upperAction.contains("BUY")) {
            views.setInt(R.id.tv_action_badge, "setBackgroundResource", R.drawable.widget_pill_green);
            views.setTextColor(R.id.tv_action_badge, Color.parseColor("#10B981"));
        } else if (upperAction.contains("TRIM") || upperAction.contains("SELL")) {
            views.setInt(R.id.tv_action_badge, "setBackgroundResource", R.drawable.widget_pill_red);
            views.setTextColor(R.id.tv_action_badge, Color.parseColor("#EF4444"));
        } else {
            views.setInt(R.id.tv_action_badge, "setBackgroundResource", R.drawable.widget_pill_gold);
            views.setTextColor(R.id.tv_action_badge, Color.parseColor("#FF9500"));
        }

        // Deep Link: Left Side -> Open Dashboard
        Intent dashIntent = new Intent(context, MainActivity.class);
        dashIntent.setAction("com.stocklearner.app.ACTION_NAVIGATE");
        dashIntent.putExtra("targetTab", "dashboard");
        dashIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingDashboard = PendingIntent.getActivity(
                context, 101, dashIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_left_section, pendingDashboard);

        // Deep Link: Right Side -> Open Signals or Education Screen
        Intent rightIntent = new Intent(context, MainActivity.class);
        rightIntent.setAction("com.stocklearner.app.ACTION_NAVIGATE");
        rightIntent.putExtra("targetTab", isTip ? "education" : "signals");
        rightIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingRight = PendingIntent.getActivity(
                context, 102, rightIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_right_section, pendingRight);

        // Update widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
