declare module 'react-native' {
  // Core React Native types
  export interface NativeModulesStatic {
    TurboModuleRegistry?: {
      get<T = any>(name: string): T | null;
      getEnforcing<T = any>(name: string): T;
    };
    MusicControlManager?: any;
  }

  export const NativeModules: NativeModulesStatic;
  export const DeviceEventEmitter: any;
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    Version: string | number;
    select<T>(specifics: { ios?: T; android?: T; default?: T }): T;
  };

  export class NativeEventEmitter {
    constructor(nativeModule: any);
    addListener(eventType: string, listener: Function): any;
    removeListener(eventType: string, listener: Function): void;
  }

  // TurboModule types for New Architecture
  export interface TurboModule {
    getConstants?(): {};
  }

  export interface TurboModuleRegistry {
    get<T = any>(name: string): T | null;
    getEnforcing<T = any>(name: string): T;
  }

  export const TurboModuleRegistry: TurboModuleRegistry;
}
