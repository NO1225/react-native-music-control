module.exports = {
  // Disable autolinking to prevent CMake codegen issues
  // This library uses manual registration instead
  dependencies: {
    '@no1225/react-native-music-control': {
      platforms: {
        android: null, // disable Android platform auto linking
        ios: null, // disable iOS platform auto linking
      },
    },
  },
};
