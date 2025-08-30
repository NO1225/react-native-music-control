const { withAndroidManifest, withInfoPlist, withMainApplication } = require('@expo/config-plugins');

/**
 * Expo config plugin for react-native-music-control
 * 
 * This plugin configures the necessary permissions and settings
 * for react-native-music-control to work in an Expo development build.
 * 
 * Usage:
 * 1. Copy this file to your Expo project (e.g., plugins/withMusicControl.js)
 * 2. Add "./plugins/withMusicControl" to the plugins array in your app.json
 * 3. Run `expo prebuild` to generate the native code
 * 4. Run `expo run:ios` or `expo run:android`
 */
module.exports = function withMusicControl(config) {
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

  // Ensure MainApplication.java registers the module correctly
  config = withMainApplication(config, (config) => {
    const mainApplicationJava = config.modResults.contents;
    
    // Check if import is already present
    if (!mainApplicationJava.includes('import com.tanguyantoine.react.MusicControlPackage;')) {
      config.modResults.contents = mainApplicationJava.replace(
        /(import.*react\.ReactPackage;\s*)/,
        '$1import com.tanguyantoine.react.MusicControlPackage;\n'
      );
    }
    
    // Check if package is added to getPackages
    if (!mainApplicationJava.includes('new MusicControlPackage()')) {
      config.modResults.contents = config.modResults.contents.replace(
        /(packages\.add\(new MainReactPackage\(\)\);)/,
        '$1\n        packages.add(new MusicControlPackage());'
      );
    }
    
    return config;
  });
  
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
