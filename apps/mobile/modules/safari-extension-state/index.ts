import { requireOptionalNativeModule } from 'expo-modules-core';

type SafariExtensionStateNativeModule = {
  getState(): Promise<{ available: boolean; enabled: boolean }>;
};

export default requireOptionalNativeModule<SafariExtensionStateNativeModule>('SafariExtensionState');
