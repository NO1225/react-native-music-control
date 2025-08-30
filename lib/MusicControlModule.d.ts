import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
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
        artwork?: string | {
            uri: string;
        };
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
    enableControl(controlName: string, enable: boolean, options: {
        interval?: number;
        when?: string;
    }): void;
    setNotificationIds?(notificationId: number, channelId: string): void;
    observeAudioInterruptions(enable: boolean): void;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}
declare const _default: Spec | null;
export default _default;
