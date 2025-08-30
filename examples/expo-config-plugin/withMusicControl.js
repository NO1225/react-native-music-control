const { withAndroidManifest, withInfoPlist, withMainApplication } = require('@expo/config-plugins');

/**
 * Expo config plugin for @no1225/react-native-music-control
 * 
 * This plugin configures the necessary permissions and settings
 * for @no1225/react-native-music-control to work in an Expo development build.
 * 
 * The module registration is handled automatically by React Native autolinking.
 * This plugin only adds the required permissions and configurations.
 * 
 * Usage:
 * 1. Install: npm install @no1225/react-native-music-control
 * 2. Copy this file to your Expo project (e.g., plugins/withMusicControl.js)
 * 3. Add "./plugins/withMusicControl" to the plugins array in your app.json
 * 4. Run `expo prebuild` to generate the native code
 * 5. Run `expo run:ios` or `expo run:android`
 * 
 * MIGRATION NOTE:
 * If upgrading from a version that used manual linking:
 * 1. Remove any manual registration code from MainApplication.java
 * 2. Remove react-native.config.js autolinking disable
 * 3. Run `npx react-native clean` and rebuild
 */
module.exports = function withMusicControl(config) {
  // Note: This plugin requires @no1225/react-native-music-control to be installed
  // and React Native autolinking to be enabled (default in RN 0.60+)
  
  // Configure Android
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];
    
    // Ensure uses-permission array exists
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    
    // Add required permissions
    const permissions = [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.WAKE_LOCK',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK' // Android 14+
    ];
    
    permissions.forEach(permission => {
      const exists = androidManifest.manifest['uses-permission'].some(
        p => p.$['android:name'] === permission
      );
      
      if (!exists) {
        androidManifest.manifest['uses-permission'].push({
          $: { 'android:name': permission }
        });
      }
    });
    
    // Configure MainActivity
    if (mainApplication && mainApplication.activity) {
      for (const activity of mainApplication.activity) {
        if (activity.$['android:name'] === '.MainActivity') {
          activity.$['android:launchMode'] = 'singleTask';
          activity.$['android:exported'] = 'true';
        }
      }
    }
    
    return config;
  });

  // Note: Module registration is now handled automatically by React Native autolinking
  // No need to manually modify MainApplication.java
  
  // Configure iOS
  config = withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;
    
    // Add audio background mode for media playback
    if (!infoPlist.UIBackgroundModes) {
      infoPlist.UIBackgroundModes = [];
    }
    
    const backgroundModes = ['audio', 'remote-notification'];
    
    backgroundModes.forEach(mode => {
      if (!infoPlist.UIBackgroundModes.includes(mode)) {
        infoPlist.UIBackgroundModes.push(mode);
      }
    });
    
    return config;
  });
  
  return config;
};
