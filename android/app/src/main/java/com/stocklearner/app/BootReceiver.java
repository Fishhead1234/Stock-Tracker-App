package com.stocklearner.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

/**
 * Native Android BroadcastReceiver that restores background alert scheduling
 * and home screen widget data when the phone reboots or the app updates.
 */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)) {
            SharedPreferences prefs = context.getSharedPreferences(
                    InvestLearnWidgetProvider.PREFS_NAME,
                    Context.MODE_PRIVATE
            );
            boolean enabled = prefs.getBoolean("notifications_enabled", true);
            if (enabled) {
                StockBackgroundScheduler.schedulePeriodicAlerts(context);
            }
            // Refresh widgets on home screen
            InvestLearnWidgetProvider.updateAllWidgets(context);
            NovaSearchWidgetProvider.updateAllWidgets(context);
        }
    }
}
