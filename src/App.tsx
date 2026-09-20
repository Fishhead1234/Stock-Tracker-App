import React, { useEffect } from 'react';
import { useSettingsStore } from './store/settingsStore';
import { useMarketStore } from './store/marketStore';
import { stockService } from './services/stockService';
import { PhoneFrame } from './components/Common/PhoneFrame';
import { BottomNav } from './components/Common/BottomNav';
import { OnboardingScreen } from './screens/Onboarding/OnboardingScreen';
import { DashboardScreen } from './screens/Dashboard/DashboardScreen';
import { StockDetailScreen } from './screens/StockDetail/StockDetailScreen';
import { SignalsScreen } from './screens/Signals/SignalsScreen';
import { EducationScreen } from './screens/Education/EducationScreen';
import { SettingsScreen } from './screens/Settings/SettingsScreen';
import { generateTimingSignal } from './services/signalEngine';
import { useSignalNotifier } from './hooks/useSignalNotifier';

export const App: React.FC = () => {
  const { hasCompletedOnboarding, activeTab } = useSettingsStore();
  const { quotes, setQuotes } = useMarketStore();

  // Watch for stock timing signals and dispatch alerts
  useSignalNotifier();

  // Subscribe to real-time stock ticks
  useEffect(() => {
    const unsubscribe = stockService.subscribe((updatedDb) => {
      setQuotes(updatedDb);
    });
    return () => unsubscribe();
  }, [setQuotes]);

  // If user hasn't finished onboarding, display onboarding wizard
  if (!hasCompletedOnboarding) {
    return (
      <PhoneFrame>
        <OnboardingScreen />
      </PhoneFrame>
    );
  }

  // Count active signals
  const allQuotes = Object.values(quotes);
  const activeSignalsCount = allQuotes
    .map(q => generateTimingSignal(q))
    .filter(s => s.action === 'STRONG_BUY' || s.action === 'BUY').length;

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col min-h-full">
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'stockDetail' && <StockDetailScreen />}
        {activeTab === 'signals' && <SignalsScreen />}
        {activeTab === 'education' && <EducationScreen />}
        {activeTab === 'settings' && <SettingsScreen />}

        {/* Persistent Mobile Bottom Navigation Bar */}
        <BottomNav signalsCount={activeSignalsCount} />
      </div>
    </PhoneFrame>
  );
};

export default App;
