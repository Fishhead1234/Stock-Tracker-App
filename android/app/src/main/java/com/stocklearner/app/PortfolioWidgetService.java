package com.stocklearner.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

/**
 * RemoteViewsService providing scrollable portfolio holding items to the widget ListView.
 */
public class PortfolioWidgetService extends RemoteViewsService {

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new PortfolioRemoteViewsFactory(this.getApplicationContext(), intent);
    }
}

class PortfolioRemoteViewsFactory implements RemoteViewsService.RemoteViewsFactory {

    private final Context mContext;
    private final List<HoldingItem> mHoldings = new ArrayList<>();

    public static class HoldingItem {
        public String ticker;
        public String action; // "BUY", "HOLD", "SELL"
        public String subtitle; // e.g. "$219.56 • 1.22 shs"
        public String value; // e.g. "$267.26"
        public String pnl; // e.g. "+$23.04 (+9.4%)"
        public boolean isPositive;
    }

    public PortfolioRemoteViewsFactory(Context context, Intent intent) {
        mContext = context;
    }

    @Override
    public void onCreate() {
        loadData();
    }

    @Override
    public void onDataSetChanged() {
        loadData();
    }

    private void loadData() {
        mHoldings.clear();
        try {
            SharedPreferences prefs = mContext.getSharedPreferences(
                    InvestLearnWidgetProvider.PREFS_NAME,
                    Context.MODE_PRIVATE
            );
            String jsonStr = prefs.getString("holdings_json", "[]");
            JSONArray array = new JSONArray(jsonStr);
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                HoldingItem item = new HoldingItem();
                item.ticker = obj.optString("ticker", "");
                item.action = obj.optString("action", "HOLD");
                item.subtitle = obj.optString("subtitle", "");
                item.value = obj.optString("value", "$0.00");
                item.pnl = obj.optString("pnl", "+$0.00 (+0.0%)");
                item.isPositive = obj.optBoolean("isPositive", true);
                mHoldings.add(item);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        mHoldings.clear();
    }

    @Override
    public int getCount() {
        return mHoldings.size();
    }

    @Override
    public RemoteViews getViewAt(int position) {
        if (position < 0 || position >= mHoldings.size()) {
            return null;
        }

        HoldingItem item = mHoldings.get(position);
        RemoteViews views = new RemoteViews(mContext.getPackageName(), R.layout.widget_portfolio_holding_item);

        views.setTextViewText(R.id.tv_holding_ticker, item.ticker);
        views.setTextViewText(R.id.tv_holding_signal_badge, item.action);
        views.setTextViewText(R.id.tv_holding_subtitle, item.subtitle);
        views.setTextViewText(R.id.tv_holding_value, item.value);
        views.setTextViewText(R.id.tv_holding_pnl, item.pnl);

        // Style the Signal Action Badge (BUY: Green, HOLD: Grey, SELL/TRIM: Red)
        String actionUpper = item.action.toUpperCase();
        if (actionUpper.contains("BUY")) {
            views.setInt(R.id.tv_holding_signal_badge, "setBackgroundResource", R.drawable.widget_pill_green);
            views.setTextColor(R.id.tv_holding_signal_badge, Color.parseColor("#10B981"));
        } else if (actionUpper.contains("SELL") || actionUpper.contains("TRIM")) {
            views.setInt(R.id.tv_holding_signal_badge, "setBackgroundResource", R.drawable.widget_pill_red);
            views.setTextColor(R.id.tv_holding_signal_badge, Color.parseColor("#EF4444"));
        } else {
            views.setInt(R.id.tv_holding_signal_badge, "setBackgroundResource", R.drawable.widget_pill_grey);
            views.setTextColor(R.id.tv_holding_signal_badge, Color.parseColor("#94A3B8"));
        }

        // Style the Holding P&L Badge
        if (item.isPositive) {
            views.setInt(R.id.layout_holding_pnl_badge, "setBackgroundResource", R.drawable.widget_pill_green);
            views.setTextColor(R.id.tv_holding_pnl, Color.parseColor("#10B981"));
        } else {
            views.setInt(R.id.layout_holding_pnl_badge, "setBackgroundResource", R.drawable.widget_pill_red);
            views.setTextColor(R.id.tv_holding_pnl, Color.parseColor("#EF4444"));
        }

        // Deep-link intent attached to each holding row
        Intent fillInIntent = new Intent();
        fillInIntent.putExtra("targetTab", "stockDetail");
        fillInIntent.putExtra("ticker", item.ticker);
        views.setOnClickFillInIntent(R.id.holding_item_container, fillInIntent);

        return views;
    }

    @Override
    public RemoteViews getLoadingView() {
        return null;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }
}
