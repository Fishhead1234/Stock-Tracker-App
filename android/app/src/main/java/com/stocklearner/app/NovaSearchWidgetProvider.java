package com.stocklearner.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

/**
 * Native Android Home Screen Widget Provider for Nova AI Search Bar.
 * Styled like Google Search Bar for instant chat, prompt chips, and AI stock guidance.
 */
public class NovaSearchWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
        super.onUpdate(context, appWidgetManager, appWidgetIds);
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, NovaSearchWidgetProvider.class);
        int[] allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
        for (int widgetId : allWidgetIds) {
            updateAppWidget(context, appWidgetManager, widgetId);
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_nova_search_bar);

        // 1. Main Search Bar Click -> Opens Nova AI Coach with keyboard auto-focused
        Intent openChatIntent = createNavIntent(context, "aiAdvisor", null, true);
        PendingIntent pOpenChat = PendingIntent.getActivity(
                context, 301, openChatIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.layout_search_pill, pOpenChat);
        views.setOnClickPendingIntent(R.id.btn_search_input_area, pOpenChat);
        views.setOnClickPendingIntent(R.id.btn_nova_logo, pOpenChat);
        views.setOnClickPendingIntent(R.id.btn_launch_chat, pOpenChat);

        // 2. Quick Chip: "Ideas" -> Opens Nova and sends prompt "What stocks or ETFs should I focus on right now?"
        Intent ideasIntent = createNavIntent(context, "aiAdvisor", "What stocks or ETFs should I focus on right now?", false);
        PendingIntent pIdeas = PendingIntent.getActivity(
                context, 302, ideasIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.btn_quick_ideas, pIdeas);

        // 3. Quick Chip: "ETFs" -> Opens Nova and sends prompt "Recommend safe beginner ETFs for long-term compounding"
        Intent etfIntent = createNavIntent(context, "aiAdvisor", "Recommend safe beginner ETFs for long-term compounding", false);
        PendingIntent pEtfs = PendingIntent.getActivity(
                context, 303, etfIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.btn_quick_etfs, pEtfs);

        // Update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static Intent createNavIntent(Context context, String targetTab, String prompt, boolean autoFocus) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction("com.stocklearner.app.ACTION_NAVIGATE");
        intent.putExtra("targetTab", targetTab);
        if (prompt != null) {
            intent.putExtra("prompt", prompt);
        }
        intent.putExtra("autoFocus", autoFocus);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        return intent;
    }
}
