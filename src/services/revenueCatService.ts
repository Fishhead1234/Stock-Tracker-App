import { Purchases, PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-capacitor';

// Default public SDK keys (configured in RevenueCat dashboard)
// In production, can also be provided via VITE_REVENUECAT_PUBLIC_KEY
const REVENUECAT_PUBLIC_API_KEY_ANDROID = 'goog_placeholder_key';
const REVENUECAT_PUBLIC_API_KEY_IOS = 'appl_placeholder_key';

export const PRO_ENTITLEMENT_ID = 'pro';

class RevenueCatService {
  private isInitialized = false;

  /**
   * Initialize RevenueCat SDK with the platform's public API key
   */
  public async initialize(customApiKey?: string): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Determine if running on native device
      const isNative = typeof window !== 'undefined' && 
        (window as any).Capacitor && 
        (window as any).Capacitor.isNativePlatform();

      const apiKey = customApiKey || REVENUECAT_PUBLIC_API_KEY_ANDROID;

      if (isNative) {
        await Purchases.configure({
          apiKey,
        });
        this.isInitialized = true;
        console.log('[RevenueCat] Successfully configured native Purchases SDK');
        return true;
      } else {
        console.log('[RevenueCat] Web environment detected - running in web preview mode');
        return false;
      }
    } catch (err) {
      console.warn('[RevenueCat] Initialization skipped or error:', err);
      return false;
    }
  }

  /**
   * Check if user currently has active 'pro' entitlement
   */
  public async checkProEntitlement(): Promise<boolean> {
    try {
      if (!this.isInitialized) return false;
      const { customerInfo } = await Purchases.getCustomerInfo();
      return this.hasProEntitlement(customerInfo);
    } catch (err) {
      console.warn('[RevenueCat] Failed to fetch customer info:', err);
      return false;
    }
  }

  /**
   * Fetch current offerings (Monthly, Annual, Lifetime)
   */
  public async getOfferings(): Promise<{
    currentOffering: any | null;
    packages: PurchasesPackage[];
  }> {
    try {
      if (!this.isInitialized) return { currentOffering: null, packages: [] };
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.availablePackages) {
        return {
          currentOffering: offerings.current,
          packages: offerings.current.availablePackages
        };
      }
      return { currentOffering: null, packages: [] };
    } catch (err) {
      console.warn('[RevenueCat] Failed to fetch offerings:', err);
      return { currentOffering: null, packages: [] };
    }
  }

  /**
   * Purchase a specific RevenueCat package
   */
  public async purchase(packageToBuy: PurchasesPackage): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
  }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToBuy });
      const isPro = this.hasProEntitlement(customerInfo);
      return { success: isPro, customerInfo };
    } catch (err: any) {
      if (err.userCancelled) {
        console.log('[RevenueCat] User cancelled purchase');
      } else {
        console.error('[RevenueCat] Purchase error:', err);
      }
      return { success: false };
    }
  }

  /**
   * Restore previous purchases (Google Play / Apple ID receipt check)
   */
  public async restore(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
  }> {
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const isPro = this.hasProEntitlement(customerInfo);
      return { success: isPro, customerInfo };
    } catch (err) {
      console.error('[RevenueCat] Restore error:', err);
      return { success: false };
    }
  }

  private hasProEntitlement(customerInfo: CustomerInfo): boolean {
    return (
      customerInfo &&
      customerInfo.entitlements &&
      customerInfo.entitlements.active &&
      Boolean(customerInfo.entitlements.active[PRO_ENTITLEMENT_ID])
    );
  }
}

export const revenueCatService = new RevenueCatService();
