package com.stocklearner.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static String sLastTargetTab = null;

    public static String getLastTargetTab() {
        return sLastTargetTab;
    }

    public static void clearLastTargetTab() {
        sLastTargetTab = null;
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
            sLastTargetTab = targetTab;

            if (getBridge() != null) {
                getBridge().triggerJSEvent("widgetNavigation", "window", "{\"targetTab\":\"" + targetTab + "\"}");
            }
        }
    }
}
