package com.stocklearner.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.view.View;
import android.widget.RemoteViews;

/**
 * Native Android Home Screen Widget Provider for InvestLearn.
 * Renders the 2x4 Scrollable Portfolio Holdings Widget.
 */
public class InvestLearnWidgetProvider extends AppWidgetProvider {

    public static final String PREFS_NAME = "InvestLearnWidgetPrefs";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, InvestLearnWidgetProvider.class);
        int[] allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
        for (int widgetId : allWidgetIds) {
            updateAppWidget(context, appWidgetManager, widgetId);
        }
        // Notify the scrollable list adapter to re-query the latest holdings
        appWidgetManager.notifyAppWidgetViewDataChanged(allWidgetIds, R.id.lv_portfolio_holdings);
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        String netWorth = prefs.getString("net_worth", "$0.00");
        String pnlText = prefs.getString("pnl_text", "+$0.00 (+0.0%) Today");
        boolean isPositive = prefs.getBoolean("is_positive", true);
        String investedHint = prefs.getString("invested_hint", "All-Time: $0.00");
        int holdingsCount = prefs.getInt("holdings_count", 0);
        String updatedTime = prefs.getString("updated_time", "Live");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_investlearn_portfolio_scroll);

        // Populate Portfolio Header figures
        views.setTextViewText(R.id.tv_net_worth, netWorth);
        views.setTextViewText(R.id.tv_pnl_badge, pnlText);
        views.setTextViewText(R.id.tv_portfolio_invested_hint, investedHint);
        views.setTextViewText(R.id.tv_widget_updated, updatedTime);
        views.setTextViewText(R.id.tv_holdings_count, "(" + holdingsCount + ")");

        // Style Today's P&L pill
        if (isPositive) {
            views.setInt(R.id.layout_pnl_badge, "setBackgroundResource", R.drawable.widget_pill_green);
            views.setTextColor(R.id.tv_pnl_badge, Color.parseColor("#10B981"));
        } else {
            views.setInt(R.id.layout_pnl_badge, "setBackgroundResource", R.drawable.widget_pill_red);
            views.setTextColor(R.id.tv_pnl_badge, Color.parseColor("#EF4444"));
        }

        // Toggle Empty State view vs List
        if (holdingsCount == 0) {
            views.setViewVisibility(R.id.tv_empty_holdings, View.VISIBLE);
            views.setViewVisibility(R.id.lv_portfolio_holdings, View.GONE);
        } else {
            views.setViewVisibility(R.id.tv_empty_holdings, View.GONE);
            views.setViewVisibility(R.id.lv_portfolio_holdings, View.VISIBLE);
        }

        // Configure RemoteViewsService adapter for the scrollable ListView
        Intent serviceIntent = new Intent(context, PortfolioWidgetService.class);
        serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
        views.setRemoteAdapter(R.id.lv_portfolio_holdings, serviceIntent);
        views.setEmptyView(R.id.lv_portfolio_holdings, R.id.tv_empty_holdings);

        // Header Deep Link -> Open Portfolio Dashboard
        Intent dashIntent = new Intent(context, MainActivity.class);
        dashIntent.setAction("com.stocklearner.app.ACTION_NAVIGATE");
        dashIntent.putExtra("targetTab", "dashboard");
        dashIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pDash = PendingIntent.getActivity(
                context, 101, dashIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.layout_portfolio_header, pDash);
        views.setOnClickPendingIntent(R.id.tv_empty_holdings, pDash);

        // ListView item click template -> Open clicked StockDetail or Dashboard
        Intent itemClickIntent = new Intent(context, MainActivity.class);
        itemClickIntent.setAction("com.stocklearner.app.ACTION_NAVIGATE");
        itemClickIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent itemClickPendingIntent = PendingIntent.getActivity(
                context, 201, itemClickIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );
        views.setPendingIntentTemplate(R.id.lv_portfolio_holdings, itemClickPendingIntent);

        // Update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
