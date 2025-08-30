# React Native Music Control - New Architecture Test

This directory contains example implementations and tests for the New Architecture migration.

## Testing New Architecture Support

### Basic Test

```javascript
import MusicControl from 'react-native-music-control';

// Test basic functionality
const testNewArchitecture = async () => {
  try {
    // Enable background mode
    MusicControl.enableBackgroundMode(true);
    
    // Set now playing info
    await MusicControl.setNowPlaying({
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      duration: 180
    });
    
    // Enable controls
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    
    // Set up event listeners
    MusicControl.on({
      actionCommand: 'play',
      cb: () => console.log('Play pressed')
    });
    
    MusicControl.on({
      actionCommand: 'pause', 
      cb: () => console.log('Pause pressed')
    });
    
    console.log('New Architecture test completed successfully');
  } catch (error) {
    console.error('New Architecture test failed:', error);
  }
};

export default testNewArchitecture;
```

### Architecture Detection

```javascript
import { NativeModules } from 'react-native';

const detectArchitecture = () => {
  // Check for TurboModule Registry
  const isTurboModuleAvailable = !!(NativeModules as any).TurboModuleRegistry;
  
  // Check for New Architecture enabled flag
  const isNewArchEnabled = global.RN_FABRIC_ENABLED || global.__turboModuleProxy;
  
  console.log('Architecture Detection:', {
    turboModuleRegistry: isTurboModuleAvailable,
    newArchEnabled: isNewArchEnabled,
    platform: Platform.OS
  });
  
  return {
    isTurboModule: isTurboModuleAvailable,
    isNewArch: isNewArchEnabled
  };
};
```

## Migration Notes

1. **Backward Compatibility**: The library maintains backward compatibility with legacy architecture
2. **Feature Detection**: Uses runtime detection to determine which architecture to use
3. **Event Handling**: TurboModule event handling may differ from legacy implementation
4. **Error Handling**: Graceful fallback to legacy mode if TurboModule fails

## Known Issues

1. Event handling for TurboModules needs proper native implementation
2. Codegen specs need to be generated during build
3. iOS TurboModule implementation needs completion
4. Testing on both architectures required
