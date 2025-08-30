# Expo Config Plugin for react-native-music-control

This directory contains an example Expo config plugin for integrating `react-native-music-control` with Expo development builds.

## ⚠️ Important Prerequisites

1. **Must use Expo Development Build** - This library will NOT work with Expo Go
2. **Physical device recommended** - Audio focus works better on real devices
3. **Expo SDK 47+** and **React Native 0.68+**

## Installation Steps

### 1. Install Dependencies

In your Expo project:

```bash
npm install react-native-music-control
# or
yarn add react-native-music-control
```

### 2. Copy Plugin Files

Copy both files to your project:
- `withMusicControl.js` → `plugins/withMusicControl.js`
- `MusicControlSafeWrapper.js` → `utils/MusicControlSafeWrapper.js` (or your preferred location)

### 3. Configure app.json

Add the plugin to your `app.json`:

```json
{
  "expo": {
    "name": "Your App",
    "slug": "your-app",
    "plugins": [
      "./plugins/withMusicControl"
    ]
  }
}
```

### 4. Generate Native Code & Run

```bash
# Clean rebuild (recommended)
expo prebuild --clean

# Run on device
expo run:android
# or
expo run:ios
```

## Safe Usage Pattern

Use the wrapper to avoid crashes:

```javascript
import MusicControlSafe from './utils/MusicControlSafeWrapper';

// Check module status (optional)
console.log('Module status:', MusicControlSafe.getModuleStatus());

// Initialize controls (safe)
await MusicControlSafe.enableControl('play', true);
await MusicControlSafe.enableControl('pause', true);
await MusicControlSafe.enableControl('nextTrack', true);
await MusicControlSafe.enableControl('previousTrack', true);

// Set track info (safe)
await MusicControlSafe.setNowPlaying({
  title: 'Song Title',
  artist: 'Artist Name',
  album: 'Album Name',
  artwork: 'https://example.com/artwork.jpg',
  duration: 180, // in seconds
  color: 0xFFFFFF // hex color
});

// Update playback state (safe)
await MusicControlSafe.updatePlayback({
  state: MusicControlSafe.STATE_PLAYING,
  elapsedTime: 0
});

// Handle events (safe)
MusicControlSafe.on('play', () => {
  console.log('Play pressed');
});

MusicControlSafe.on('pause', () => {
  console.log('Pause pressed');
});

MusicControlSafe.on('nextTrack', () => {
  console.log('Next track pressed');
});
```

## What the Plugin Does

### Android Configuration
- Adds `FOREGROUND_SERVICE` permission for background music control
- Adds `WAKE_LOCK` permission for keeping the device awake
- Adds `MODIFY_AUDIO_SETTINGS` permission for audio focus management
- Adds `FOREGROUND_SERVICE_MEDIA_PLAYBACK` permission for Android 14+
- Sets `MainActivity` launch mode to `singleTask` for proper notification handling
- Ensures proper native module registration in MainApplication.java

### iOS Configuration
- Adds `audio` background mode for continuous audio playback
- Adds `remote-notification` background mode for remote control support

## Troubleshooting the Audio Focus Error

If you see `"Attempt to invoke virtual method... on a null object reference"`:

### Check 1: Verify Native Module Registration
```javascript
import { NativeModules } from 'react-native';
console.log('Available modules:', Object.keys(NativeModules));
console.log('MusicControl available:', !!NativeModules.MusicControlManager);

// Or use the wrapper's status method
import MusicControlSafe from './utils/MusicControlSafeWrapper';
console.log('Module status:', MusicControlSafe.getModuleStatus());
```

### Check 2: Verify You're Not Using Expo Go
- The error commonly occurs when using Expo Go instead of a development build
- Run `expo run:android` or `expo run:ios`, NOT `expo start`

### Check 3: Clean Rebuild
```bash
# Complete clean rebuild
rm -rf node_modules
npm install
expo prebuild --clean
expo run:android
```

### Check 4: Test on Physical Device
- Simulators/emulators may not have proper audio focus capabilities
- Test on a real Android device

### Check 5: Verify Permissions in Generated Files
- **Android**: Check `android/app/src/main/AndroidManifest.xml` for permissions:
  ```xml
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
  <uses-permission android:name="android.permission.WAKE_LOCK" />
  <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
  ```
- **iOS**: Check `ios/YourApp/Info.plist` for background modes:
  ```xml
  <key>UIBackgroundModes</key>
  <array>
    <string>audio</string>
    <string>remote-notification</string>
  </array>
  ```

### Check 6: Verify MainApplication.java
Check that `android/app/src/main/java/.../MainApplication.java` includes:
```java
import com.tanguyantoine.react.MusicControlPackage;

// In getPackages() method:
packages.add(new MusicControlPackage());
```

## Alternative Libraries

If you continue to have issues, consider these alternatives:
- `react-native-track-player` (more maintained, better Expo support)
- `@react-native-audio-toolkit/core`
- `expo-av` (for basic audio needs)

## Example Complete Implementation

```javascript
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import MusicControlSafe from './utils/MusicControlSafeWrapper';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [moduleStatus, setModuleStatus] = useState(null);

  useEffect(() => {
    // Check module status
    const status = MusicControlSafe.getModuleStatus();
    setModuleStatus(status);
    console.log('MusicControl module status:', status);

    if (status.isAvailable) {
      initializeMusicControl();
    }

    return () => {
      // Cleanup
      MusicControlSafe.off('play');
      MusicControlSafe.off('pause');
      MusicControlSafe.stopControl();
    };
  }, []);

  const initializeMusicControl = async () => {
    try {
      // Enable controls
      await MusicControlSafe.enableControl('play', true);
      await MusicControlSafe.enableControl('pause', true);
      await MusicControlSafe.enableControl('nextTrack', true);
      await MusicControlSafe.enableControl('previousTrack', true);

      // Set up event listeners
      MusicControlSafe.on('play', handlePlay);
      MusicControlSafe.on('pause', handlePause);
      MusicControlSafe.on('nextTrack', handleNext);
      MusicControlSafe.on('previousTrack', handlePrevious);

      console.log('MusicControl initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MusicControl:', error);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Your play logic here
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Your pause logic here
  };

  const handleNext = () => {
    // Your next track logic here
    console.log('Next track');
  };

  const handlePrevious = () => {
    // Your previous track logic here
    console.log('Previous track');
  };

  const updateTrackInfo = async () => {
    try {
      await MusicControlSafe.setNowPlaying({
        title: 'Example Song',
        artist: 'Example Artist',
        album: 'Example Album',
        artwork: 'https://via.placeholder.com/300',
        duration: 180,
        color: 0x333333
      });

      await MusicControlSafe.updatePlayback({
        state: isPlaying ? MusicControlSafe.STATE_PLAYING : MusicControlSafe.STATE_PAUSED,
        elapsedTime: 0
      });
    } catch (error) {
      console.error('Failed to update track info:', error);
    }
  };

  if (!moduleStatus?.isAvailable) {
    return (
      <View>
        <Text>MusicControl not available</Text>
        <Text>Status: {JSON.stringify(moduleStatus, null, 2)}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>MusicControl Status: Available</Text>
      <Button 
        title={isPlaying ? "Pause" : "Play"} 
        onPress={isPlaying ? handlePause : handlePlay} 
      />
      <Button 
        title="Update Track Info" 
        onPress={updateTrackInfo} 
      />
    </View>
  );
}
```

## Requirements

- Expo SDK 47+
- React Native 0.68+
- Expo development build (cannot be used in Expo Go)
- Physical device recommended for testing

## Support

This is a community example. For issues with the core library, check:
- [react-native-music-control GitHub issues](https://github.com/tanguyantoine/react-native-music-control/issues)
- Consider migrating to more actively maintained alternatives like `react-native-track-player`
