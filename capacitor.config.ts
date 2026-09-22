import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stocklearner.app',
  appName: 'InvestLearn',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    LocalNotifications: {
      iconColor: "#10B981"
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0A1128",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#10B981"
    }
  }
};

export default config;
