import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Core playback control methods
  enableBackgroundMode(enable: boolean): void;
  setNowPlaying(info: {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    description?: string;
    date?: string;
    duration?: number;
    color?: number;
    colorized?: boolean;
    notificationIcon?: string;
    rating?: number;
    artwork?: string | { uri: string };
  }): void;
  updatePlayback(info: {
    bufferedTime?: number;
    speed?: number;
    state?: number;
    maxVolume?: number;
    volume?: number;
    rating?: number;
    elapsedTime?: number;
  }): void;
  resetNowPlaying(): void;
  stopControl(): void;
  
  // Control enablement
  enableControl(
    controlName: string, 
    enable: boolean, 
    options: {
      interval?: number;
      when?: string;
    }
  ): void;
  
  // Android specific - optional method
  setNotificationIds?(notificationId: number, channelId: string): void;
  
  // Audio interruption handling
  observeAudioInterruptions(enable: boolean): void;
  
  // Event emission (TurboModule event handling)
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Use get instead of getEnforcing to avoid forcing codegen
// This will return null if TurboModule is not available/registered
export default TurboModuleRegistry.get<Spec>('MusicControlManager');
