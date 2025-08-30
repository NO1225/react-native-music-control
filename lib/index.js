"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
/**
 * @providesModule MusicControl
 */
var react_native_1 = require("react-native");
// @ts-ignore
var resolveAssetSource_1 = __importDefault(require("react-native/Libraries/Image/resolveAssetSource"));
// @ts-ignore
var constants_1 = __importDefault(require("./constants"));
var types_1 = require("./types");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return types_1.Command; } });
var NativeMusicControl_1 = __importDefault(require("./NativeMusicControl"));
// Module selection: Try TurboModule first, fallback to legacy
var NativeMusicControl;
var isTurboModuleEnabled = false;
// Import strategy for different architectures
function initializeNativeModule() {
    // First try TurboModule (New Architecture)
    try {
        if (NativeMusicControl_1.default !== null && NativeMusicControl_1.default !== undefined) {
            NativeMusicControl = NativeMusicControl_1.default;
            isTurboModuleEnabled = true;
            console.log('Using TurboModule architecture');
            return;
        }
    }
    catch (e) {
        console.log('TurboModule not available, falling back to legacy:', e);
    }
    // Fallback to legacy module
    NativeMusicControl = react_native_1.NativeModules.MusicControlManager;
    isTurboModuleEnabled = false;
    console.log('Using legacy module architecture');
    // Verify the module is available
    if (!NativeMusicControl) {
        console.error('MusicControlManager native module not found');
    }
    else {
        console.log('Available methods:', Object.keys(NativeMusicControl));
    }
}
// Initialize the native module
initializeNativeModule();
// Debug: Log what we found
console.log('NativeMusicControl initialized:', !!NativeMusicControl);
console.log('isTurboModuleEnabled:', isTurboModuleEnabled);
console.log('Available native modules:', Object.keys(react_native_1.NativeModules));
console.log('TurboModuleRegistry available:', !!react_native_1.NativeModules.TurboModuleRegistry);
var handlers = {};
var listenerOfNativeMusicControl = null;
var IS_ANDROID = react_native_1.Platform.OS === "android";
var MusicControl = {
    STATE_PLAYING: constants_1.default.STATE_PLAYING,
    STATE_PAUSED: constants_1.default.STATE_PAUSED,
    STATE_ERROR: constants_1.default.STATE_ERROR,
    STATE_STOPPED: constants_1.default.STATE_STOPPED,
    STATE_BUFFERING: constants_1.default.STATE_BUFFERING,
    RATING_HEART: constants_1.default.RATING_HEART,
    RATING_THUMBS_UP_DOWN: constants_1.default.RATING_THUMBS_UP_DOWN,
    RATING_3_STARS: constants_1.default.RATING_3_STARS,
    RATING_4_STARS: constants_1.default.RATING_4_STARS,
    RATING_5_STARS: constants_1.default.RATING_5_STARS,
    RATING_PERCENTAGE: constants_1.default.RATING_PERCENTAGE,
    enableBackgroundMode: function (enable) {
        if (!NativeMusicControl) {
            console.error('NativeMusicControl is not available. Make sure the native module is properly linked.');
            return;
        }
        if (typeof NativeMusicControl.enableBackgroundMode !== 'function') {
            console.error('enableBackgroundMode method not found on native module. Available methods:', Object.keys(NativeMusicControl));
            return;
        }
        NativeMusicControl.enableBackgroundMode(enable);
    },
    setNowPlaying: function (info) {
        // Check if we have an android asset from react style image require
        if (info.artwork) {
            info.artwork = (0, resolveAssetSource_1.default)(info.artwork) || info.artwork;
        }
        NativeMusicControl.setNowPlaying(info);
    },
    setPlayback: function (info) {
        // Backwards compatibility. Use updatePlayback instead.
        NativeMusicControl.updatePlayback(info);
    },
    updatePlayback: function (info) {
        NativeMusicControl.updatePlayback(info);
    },
    resetNowPlaying: function () {
        NativeMusicControl.resetNowPlaying();
    },
    enableControl: function (controlName, enable, options) {
        if (options === void 0) { options = {}; }
        NativeMusicControl.enableControl(controlName, enable, options || {});
    },
    handleCommand: function (commandName, value) {
        if (handlers[commandName]) {
            //@ts-ignore
            handlers[commandName](value);
        }
    },
    setNotificationId: function (notificationId, channelId) {
        if (IS_ANDROID) {
            NativeMusicControl.setNotificationIds(notificationId, channelId);
        }
    },
    on: function (onCommand) {
        var _a;
        if (!listenerOfNativeMusicControl) {
            if (isTurboModuleEnabled) {
                // New Architecture - TurboModule with event emitter
                try {
                    // For TurboModules, we still use the traditional event emitter approach
                    // since TurboModules can still emit events via DeviceEventEmitter (Android) or RCTEventEmitter (iOS)
                    listenerOfNativeMusicControl = (IS_ANDROID
                        ? react_native_1.DeviceEventEmitter
                        : new react_native_1.NativeEventEmitter(NativeMusicControl)).addListener("RNMusicControlEvent", function (event) {
                        MusicControl.handleCommand(event.name, event.value);
                    });
                    // Notify the TurboModule that we're listening for events
                    (_a = NativeMusicControl === null || NativeMusicControl === void 0 ? void 0 : NativeMusicControl.addListener) === null || _a === void 0 ? void 0 : _a.call(NativeMusicControl, "RNMusicControlEvent");
                }
                catch (error) {
                    console.warn('TurboModule event setup failed, falling back to legacy:', error);
                    isTurboModuleEnabled = false;
                }
            }
            if (!isTurboModuleEnabled) {
                // Legacy Architecture
                listenerOfNativeMusicControl = (IS_ANDROID
                    ? react_native_1.DeviceEventEmitter
                    : new react_native_1.NativeEventEmitter(NativeMusicControl)).addListener("RNMusicControlEvent", function (event) {
                    MusicControl.handleCommand(event.name, event.value);
                });
            }
        }
        handlers[onCommand.actionCommand] = onCommand.cb;
    },
    off: function (actionName) {
        var _a;
        delete handlers[actionName];
        if (!Object.keys(handlers).length && listenerOfNativeMusicControl) {
            listenerOfNativeMusicControl.remove();
            listenerOfNativeMusicControl = null;
            // Notify TurboModule that we're no longer listening
            if (isTurboModuleEnabled) {
                (_a = NativeMusicControl === null || NativeMusicControl === void 0 ? void 0 : NativeMusicControl.removeListeners) === null || _a === void 0 ? void 0 : _a.call(NativeMusicControl, 1);
            }
        }
    },
    stopControl: function () {
        if (listenerOfNativeMusicControl) {
            listenerOfNativeMusicControl.remove();
            listenerOfNativeMusicControl = null;
        }
        Object.keys(handlers).map(function (key) {
            //@ts-ignore
            delete handlers[key];
        });
        NativeMusicControl.stopControl();
    },
    handleAudioInterruptions: function (enable) {
        NativeMusicControl.observeAudioInterruptions(enable);
    },
};
exports.default = MusicControl;
