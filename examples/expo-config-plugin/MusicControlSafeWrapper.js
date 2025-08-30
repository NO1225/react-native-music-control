import { NativeModules, Platform } from 'react-native';

/**
 * Safe wrapper for react-native-music-control that handles errors gracefully
 * and provides fallbacks when the native module isn't available.
 * 
 * This wrapper is designed to prevent crashes when using react-native-music-control
 * in Expo development builds or when the native module isn't properly linked.
 * 
 * Usage:
 * import MusicControlSafe from './MusicControlSafeWrapper';
 * 
 * // All methods return promises and handle errors gracefully
 * await MusicControlSafe.enableControl('play', true);
 * await MusicControlSafe.setNowPlaying({ title: 'Song Title' });
 */
class MusicControlSafeWrapper {
  constructor() {
    this.isModuleAvailable = false;
    this.MusicControl = null;
    this.initializationAttempts = 0;
    this.maxInitializationAttempts = 3;
    this.checkModuleAvailability();
  }

  checkModuleAvailability() {
    try {
      // Import the module
      this.MusicControl = require('react-native-music-control').default;
      
      // Test if native module is properly linked
      if (Platform.OS === 'android') {
        // Check if the native Android module is available
        const nativeModule = NativeModules.MusicControlManager;
        this.isModuleAvailable = !!nativeModule;
        
        if (!this.isModuleAvailable) {
          console.warn('MusicControl native Android module not found. Make sure you are using a development build and not Expo Go.');
        } else {
          console.log('MusicControl Android module successfully detected');
        }
      } else if (Platform.OS === 'ios') {
        // For iOS, check if the module methods are available
        this.isModuleAvailable = typeof this.MusicControl?.enableControl === 'function';
        
        if (!this.isModuleAvailable) {
          console.warn('MusicControl iOS module not properly linked');
        } else {
          console.log('MusicControl iOS module successfully detected');
        }
      } else {
        // For other platforms (web, etc.), module is not available
        this.isModuleAvailable = false;
        console.warn('MusicControl is not supported on this platform:', Platform.OS);
      }
    } catch (error) {
      console.warn('MusicControl module not available:', error.message);
      this.isModuleAvailable = false;
    }
  }

  async safeCall(methodName, ...args) {
    if (!this.isModuleAvailable || !this.MusicControl) {
      console.warn(`MusicControl.${methodName} called but module not available`);
      return Promise.resolve();
    }

    try {
      const result = this.MusicControl[methodName](...args);
      return Promise.resolve(result);
    } catch (error) {
      console.error(`MusicControl.${methodName} error:`, error);
      
      // If this is the audio focus error, try to reinitialize once
      if (error.message && error.message.includes('MusicControlAudioFocusListener') && 
          this.initializationAttempts < this.maxInitializationAttempts) {
        console.log('Attempting to reinitialize MusicControl...');
        this.initializationAttempts++;
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.checkModuleAvailability();
        
        // Try the call again if module is now available
        if (this.isModuleAvailable) {
          try {
            const result = this.MusicControl[methodName](...args);
            return Promise.resolve(result);
          } catch (retryError) {
            console.error(`MusicControl.${methodName} retry failed:`, retryError);
            return Promise.reject(retryError);
          }
        }
      }
      
      return Promise.reject(error);
    }
  }

  // Core control methods
  async enableControl(control, enable) {
    return this.safeCall('enableControl', control, enable);
  }

  async disableControl(control) {
    return this.safeCall('enableControl', control, false);
  }

  async setNowPlaying(trackInfo) {
    return this.safeCall('setNowPlaying', trackInfo);
  }

  async resetNowPlaying() {
    return this.safeCall('resetNowPlaying');
  }

  async updatePlayback(playbackState) {
    return this.safeCall('updatePlayback', playbackState);
  }

  // Event handling
  on(event, callback) {
    if (!this.isModuleAvailable || !this.MusicControl) {
      console.warn(`MusicControl.on('${event}') called but module not available`);
      return;
    }

    try {
      return this.MusicControl.on(event, callback);
    } catch (error) {
      console.error(`MusicControl.on('${event}') error:`, error);
    }
  }

  off(event, callback) {
    if (!this.isModuleAvailable || !this.MusicControl) {
      console.warn(`MusicControl.off('${event}') called but module not available`);
      return;
    }

    try {
      return this.MusicControl.off(event, callback);
    } catch (error) {
      console.error(`MusicControl.off('${event}') error:`, error);
    }
  }

  // Control methods
  async stopControl() {
    return this.safeCall('stopControl');
  }

  // Utility methods
  getModuleStatus() {
    return {
      isAvailable: this.isModuleAvailable,
      platform: Platform.OS,
      nativeModulePresent: !!NativeModules.MusicControlManager,
      initializationAttempts: this.initializationAttempts
    };
  }

  // Expose constants safely
  get STATE_PLAYING() {
    return this.MusicControl?.STATE_PLAYING || 3;
  }

  get STATE_PAUSED() {
    return this.MusicControl?.STATE_PAUSED || 2;
  }

  get STATE_STOPPED() {
    return this.MusicControl?.STATE_STOPPED || 1;
  }

  get STATE_BUFFERING() {
    return this.MusicControl?.STATE_BUFFERING || 6;
  }

  // Rating constants
  get RATING_HEART() {
    return this.MusicControl?.RATING_HEART || 0;
  }

  get RATING_THUMBS_UP_DOWN() {
    return this.MusicControl?.RATING_THUMBS_UP_DOWN || 1;
  }

  get RATING_3_STARS() {
    return this.MusicControl?.RATING_3_STARS || 2;
  }

  get RATING_4_STARS() {
    return this.MusicControl?.RATING_4_STARS || 3;
  }

  get RATING_5_STARS() {
    return this.MusicControl?.RATING_5_STARS || 4;
  }

  get RATING_PERCENTAGE() {
    return this.MusicControl?.RATING_PERCENTAGE || 5;
  }
}

// Export a singleton instance
export default new MusicControlSafeWrapper();
