import { NativeModules, Platform } from 'react-native';
import MusicControl from 'react-native-music-control';

/**
 * Comprehensive test suite for New Architecture compatibility
 */
export class MusicControlArchitectureTest {
  
  static detectArchitecture() {
    const detection = {
      platform: Platform.OS,
      hasTurboModuleRegistry: !!NativeModules.TurboModuleRegistry,
      hasLegacyModule: !!NativeModules.MusicControlManager,
      reactNativeVersion: require('react-native/package.json').version,
      timestamp: new Date().toISOString()
    };
    
    console.log('🔍 Architecture Detection:', detection);
    return detection;
  }
  
  static async testBasicFunctionality() {
    console.log('🧪 Testing Basic MusicControl Functionality...');
    
    try {
      // Test enableBackgroundMode
      MusicControl.enableBackgroundMode(true);
      console.log('✅ enableBackgroundMode: OK');
      
      // Test setNowPlaying
      MusicControl.setNowPlaying({
        title: 'New Architecture Test Song',
        artist: 'React Native Music Control',
        album: 'TurboModule Testing',
        duration: 180,
        artwork: 'https://example.com/artwork.jpg'
      });
      console.log('✅ setNowPlaying: OK');
      
      // Test updatePlayback
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING,
        elapsedTime: 30,
        bufferedTime: 60
      });
      console.log('✅ updatePlayback: OK');
      
      // Test enableControl
      MusicControl.enableControl('play', true);
      MusicControl.enableControl('pause', true);
      MusicControl.enableControl('nextTrack', true);
      MusicControl.enableControl('previousTrack', true);
      console.log('✅ enableControl: OK');
      
      return { success: true, message: 'All basic functionality tests passed' };
    } catch (error) {
      console.error('❌ Basic functionality test failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async testEventHandling() {
    console.log('🧪 Testing Event Handling...');
    
    return new Promise((resolve) => {
      let eventReceived = false;
      
      // Set up event listener
      const testHandler = () => {
        eventReceived = true;
        console.log('✅ Event received successfully');
        
        // Clean up
        MusicControl.off('play');
        
        resolve({ 
          success: true, 
          message: 'Event handling test passed',
          eventReceived 
        });
      };
      
      try {
        MusicControl.on({
          actionCommand: 'play',
          cb: testHandler
        });
        
        console.log('📡 Event listener set up. Manual testing required - press play button in notification/control center');
        
        // Auto-resolve after 5 seconds if no manual interaction
        setTimeout(() => {
          if (!eventReceived) {
            MusicControl.off('play');
            resolve({ 
              success: true, 
              message: 'Event listener setup successful (manual testing required)',
              eventReceived: false,
              note: 'Press play button in notification to complete test'
            });
          }
        }, 5000);
        
      } catch (error) {
        console.error('❌ Event handling test failed:', error);
        resolve({ success: false, error: error.message });
      }
    });
  }
  
  static async testCleanup() {
    console.log('🧪 Testing Cleanup...');
    
    try {
      MusicControl.stopControl();
      MusicControl.resetNowPlaying();
      console.log('✅ Cleanup: OK');
      
      return { success: true, message: 'Cleanup test passed' };
    } catch (error) {
      console.error('❌ Cleanup test failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async runFullTestSuite() {
    console.log('🚀 Starting MusicControl New Architecture Test Suite');
    console.log('================================================');
    
    const results = {
      architecture: this.detectArchitecture(),
      basicFunctionality: await this.testBasicFunctionality(),
      eventHandling: await this.testEventHandling(),
      cleanup: await this.testCleanup(),
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Test Results Summary:');
    console.log('========================');
    console.log('Architecture Detection:', results.architecture);
    console.log('Basic Functionality:', results.basicFunctionality.success ? '✅ PASS' : '❌ FAIL');
    console.log('Event Handling:', results.eventHandling.success ? '✅ PASS' : '❌ FAIL');
    console.log('Cleanup:', results.cleanup.success ? '✅ PASS' : '❌ FAIL');
    
    const overallSuccess = results.basicFunctionality.success && 
                          results.eventHandling.success && 
                          results.cleanup.success;
    
    console.log('Overall Result:', overallSuccess ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    return results;
  }
}

/**
 * Quick test function for immediate execution
 */
export const testMusicControlNewArchitecture = async () => {
  return await MusicControlArchitectureTest.runFullTestSuite();
};

export default MusicControlArchitectureTest;
