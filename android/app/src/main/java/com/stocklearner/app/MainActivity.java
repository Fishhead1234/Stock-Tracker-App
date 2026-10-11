package com.stocklearner.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static String sLastTargetTab = null;
    private static String sLastTargetTicker = null;

    public static String getLastTargetTab() {
        return sLastTargetTab;
    }

    public static String getLastTargetTicker() {
        return sLastTargetTicker;
    }

    public static void clearLastTargetTab() {
        sLastTargetTab = null;
        sLastTargetTicker = null;
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
            sLastTargetTab = targetTab;
            sLastTargetTicker = ticker;

            if (getBridge() != null) {
                String payload = "{\"targetTab\":\"" + targetTab + "\",\"ticker\":\"" + (ticker != null ? ticker : "") + "\"}";
                getBridge().triggerJSEvent("widgetNavigation", "window", payload);
            }
        }
    }
}
