module.exports = {
  // Enable autolinking for the library itself
  platforms: {
    android: {
      sourceDir: 'android',
      packageImportPath: 'import com.tanguyantoine.react.MusicControlModule;',
    },
    ios: {
      sourceDir: 'ios',
    },
  },
};
