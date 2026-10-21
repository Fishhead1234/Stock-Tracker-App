package com.stocklearner.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

/**
 * Manages native Android AlarmManager scheduling for background stock timing alert checks.
 */
public class StockBackgroundScheduler {

    public static final int ALARM_REQUEST_CODE = 4401;
    public static final int TEST_ALARM_REQUEST_CODE = 4402;
    public static final long DEFAULT_INTERVAL_MILLIS = 30 * 60 * 1000L; // 30 minutes

    /**
     * Starts periodic background alerts if notifications are enabled in preferences.
     */
    public static void schedulePeriodicAlerts(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(
                InvestLearnWidgetProvider.PREFS_NAME,
                Context.MODE_PRIVATE
        );
        boolean enabled = prefs.getBoolean("notifications_enabled", true);
        if (!enabled) {
            cancelPeriodicAlerts(context);
            return;
        }

        scheduleNextCheck(context);
    }

    /**
     * Schedules the next background check via AlarmManager setAndAllowWhileIdle.
     */
    public static void scheduleNextCheck(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, StockAlertReceiver.class);
        intent.setAction(StockAlertReceiver.ACTION_CHECK_ALERTS);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        long triggerAt = System.currentTimeMillis() + DEFAULT_INTERVAL_MILLIS;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
        } else {
            alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
        }
    }

    /**
     * Cancels any scheduled background alert checks.
     */
    public static void cancelPeriodicAlerts(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, StockAlertReceiver.class);
        intent.setAction(StockAlertReceiver.ACTION_CHECK_ALERTS);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        alarmManager.cancel(pendingIntent);
    }

    /**
     * Schedules a test notification to fire in delaySeconds (e.g. 5 seconds) after exiting the app.
     */
    public static void scheduleTestNotification(Context context, int delaySeconds, String ticker, String title, String message) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, StockAlertReceiver.class);
        intent.setAction(StockAlertReceiver.ACTION_TEST_NOTIFICATION);
        intent.putExtra("ticker", ticker != null ? ticker : "AAPL");
        intent.putExtra("title", title != null ? title : "Holding Alert: Buy Opportunity");
        intent.putExtra("message", message != null ? message : "AAPL entered an attractive accumulation zone near support.");

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                TEST_ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        long triggerAt = System.currentTimeMillis() + (delaySeconds * 1000L);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
        } else {
            alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
        }
    }
}
