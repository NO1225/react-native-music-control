# Installation Guide for New Architecture

This guide covers installation for both Legacy and New Architecture React Native projects.

## Requirements

- React Native >= 0.68.0 (for New Architecture support)
- Android API Level 21+ 
- iOS 11.0+

## Installation

```bash
npm install react-native-music-control
# or
yarn add react-native-music-control
```

## Configuration

### For New Architecture Projects

1. **Enable New Architecture** in your React Native project:
   ```bash
   # Android - in android/gradle.properties
   newArchEnabled=true
   
   # iOS - in ios/Podfile
   use_frameworks! :linkage => :static
   $RNNewArchEnabled = true
   ```

2. **Install pods** (iOS):
   ```bash
   cd ios && pod install
   ```

3. **The library will automatically detect and use TurboModules**

### For Legacy Architecture Projects

**No additional configuration needed** - the library works exactly as before with automatic fallback to legacy modules.

## Platform Specific Setup

### Android

Add to your `MainApplication.java`:

**For most projects** (recommended approach):
```java
import com.tanguyantoine.react.MusicControl;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // ... other packages
        new MusicControl() // Works with both Legacy and New Architecture
    );
}
```

**For projects specifically targeting New Architecture** (optional):
```java
import com.tanguyantoine.react.MusicControlTurboReactPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // ... other packages
        new MusicControlTurboReactPackage() // TurboModule optimized version
    );
}
```

### iOS

The library automatically registers itself. No additional setup required.

## Verification

Test your installation:

```javascript
import { testMusicControlNewArchitecture } from 'react-native-music-control/examples/new-architecture-test/ArchitectureTest';

// Run architecture detection and basic tests
testMusicControlNewArchitecture().then(results => {
  console.log('Architecture Test Results:', results);
});
```

## Migration from Legacy

**No code changes required!** The library maintains 100% backward compatibility. Your existing code will continue to work unchanged.

## Troubleshooting

### New Architecture Issues

1. **TurboModule not found**: Ensure `newArchEnabled=true` is set
2. **Build errors**: Clean and rebuild your project
3. **Events not working**: Check that event listeners are properly set up

### Legacy Architecture Issues

1. **Module not found**: Ensure the library is properly linked
2. **Events not working**: Verify that your React Native version supports the event system

For more help, see the [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) guide.
