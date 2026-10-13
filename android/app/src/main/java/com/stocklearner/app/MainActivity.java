package com.stocklearner.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static String sLastTargetTab = null;
    private static String sLastTargetTicker = null;
    private static String sLastPrompt = null;
    private static boolean sLastAutoFocus = false;

    public static String getLastTargetTab() {
        return sLastTargetTab;
    }

    public static String getLastTargetTicker() {
        return sLastTargetTicker;
    }

    public static String getLastPrompt() {
        return sLastPrompt;
    }

    public static boolean getLastAutoFocus() {
        return sLastAutoFocus;
    }

    public static void clearLastTargetTab() {
        sLastTargetTab = null;
        sLastTargetTicker = null;
        sLastPrompt = null;
        sLastAutoFocus = false;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetBridgePlugin.class);
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        handleWidgetIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleWidgetIntent(intent);
    }

    private void handleWidgetIntent(Intent intent) {
        if (intent == null) return;

        if (intent.hasExtra("targetTab")) {
            String targetTab = intent.getStringExtra("targetTab");
            String ticker = intent.getStringExtra("ticker");
            String prompt = intent.getStringExtra("prompt");
            boolean autoFocus = intent.getBooleanExtra("autoFocus", false);

            sLastTargetTab = targetTab;
            sLastTargetTicker = ticker;
            sLastPrompt = prompt;
            sLastAutoFocus = autoFocus;

            if (getBridge() != null) {
                String safePrompt = prompt != null ? prompt.replace("\"", "\\\"") : "";
                String payload = "{\"targetTab\":\"" + (targetTab != null ? targetTab : "") + "\","
                        + "\"ticker\":\"" + (ticker != null ? ticker : "") + "\","
                        + "\"prompt\":\"" + safePrompt + "\","
                        + "\"autoFocus\":" + autoFocus + "}";
                getBridge().triggerJSEvent("widgetNavigation", "window", payload);
            }
        }
    }
}
