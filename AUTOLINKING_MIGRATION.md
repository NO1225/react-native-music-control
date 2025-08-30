# Autolinking Migration Guide

## Overview

Starting from version 1.0.19, `@no1225/react-native-music-control` now supports React Native autolinking (enabled by default in React Native 0.60+).

## What Changed

### ✅ Enabled Features
- **Autolinking Support**: No more manual registration needed
- **New Architecture Compatibility**: Full support for React Native's New Architecture
- **Expo Config Plugin**: Enhanced with autolinking support

### 🔄 Migration Required

If you're upgrading from a version that used manual linking, follow these steps:

## Migration Steps

### 1. Remove Manual Registration (Android)

Remove the manual module registration from your `MainApplication.java`:

```java
// REMOVE THESE LINES:
import com.tanguyantoine.react.MusicControlPackage;

// In the getPackages() method, remove:
new MusicControlPackage()
```

### 2. Remove Manual Linking Configuration

If you have a `react-native.config.js` file in your app that disables autolinking for this library, remove or update it:

```javascript
// REMOVE OR UPDATE:
module.exports = {
  dependencies: {
    '@no1225/react-native-music-control': {
      platforms: {
        android: null, // <- Remove this
        ios: null,     // <- Remove this
      },
    },
  },
};
```

### 3. Clean and Rebuild

```bash
# Clean React Native cache
npx react-native clean

# For Android
cd android && ./gradlew clean && cd ..

# For iOS
cd ios && rm -rf Pods && rm Podfile.lock && pod install && cd ..

# Reinstall node modules
rm -rf node_modules && npm install

# Rebuild your app
npm run android
npm run ios
```

## New Installation (No Migration Needed)

For new projects, simply install the package:

```bash
npm install @no1225/react-native-music-control
```

That's it! React Native autolinking will handle the rest.

## Expo Users

If you're using Expo, the config plugin has been updated to work with autolinking:

```javascript
// app.json or app.config.js
{
  "expo": {
    "plugins": [
      "./plugins/withMusicControl"
    ]
  }
}
```

## Troubleshooting

### Build Errors After Migration

If you encounter build errors after migration:

1. Ensure you've removed all manual registration code
2. Clean all build caches as shown in step 3 above
3. Verify your React Native version is 0.60 or higher
4. Check that no other libraries are conflicting with the module name

### CMake/Codegen Errors

The library now properly supports New Architecture. If you see CMake errors:

1. Ensure your `react-native.config.js` enables autolinking (don't disable it)
2. Clean and rebuild as shown above
3. Check that your React Native version supports the New Architecture features you're trying to use

## Benefits of Autolinking

- ✅ Automatic module registration
- ✅ Better New Architecture support
- ✅ Simplified installation process
- ✅ Reduced manual configuration errors
- ✅ Better compatibility with Expo development builds

## Questions?

If you encounter issues during migration, please:

1. Check this migration guide thoroughly
2. Review the main [README.md](README.md) for updated installation instructions
3. Open an issue on GitHub with detailed error messages and your configuration
