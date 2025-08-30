package com.tanguyantoine.react;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.module.annotations.ReactModule;

// TurboModule imports
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

/**
 * TurboModule implementation for MusicControl
 * Supports both New Architecture (TurboModule) and Legacy Architecture
 */
@ReactModule(name = MusicControlTurboModule.NAME)
public class MusicControlTurboModule extends NativeMusicControlSpec {
    public static final String NAME = "MusicControlManager";

    private final MusicControlModule legacyModule;
    private int listenerCount = 0;

    public MusicControlTurboModule(ReactApplicationContext context) {
        super(context);
        // Delegate to existing implementation
        this.legacyModule = new MusicControlModule(context);
        
        // Set up event forwarding from legacy module to TurboModule
        setupEventForwarding();
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private void setupEventForwarding() {
        // Override the event emitter in the legacy module to forward events
        // This ensures events work in both architectures
        legacyModule.setEventForwarder(new MusicControlEventForwarder() {
            @Override
            public void sendEvent(String eventName, WritableMap params) {
                emitDeviceEvent(eventName, params);
            }
        });
    }

    private void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        ReactApplicationContext context = getReactApplicationContext();
        if (context != null && context.hasActiveCatalystInstance()) {
            context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, eventData);
        }
    }

    @ReactMethod
    @Override
    public void enableBackgroundMode(boolean enable) {
        legacyModule.enableBackgroundMode(enable);
    }

    @ReactMethod
    @Override
    public void setNowPlaying(@NonNull ReadableMap info) {
        legacyModule.setNowPlaying(info);
    }

    @ReactMethod
    @Override
    public void updatePlayback(@NonNull ReadableMap info) {
        legacyModule.updatePlayback(info);
    }

    @ReactMethod
    @Override
    public void resetNowPlaying() {
        legacyModule.resetNowPlaying();
    }

    @ReactMethod
    @Override
    public void stopControl() {
        legacyModule.stopControl();
    }

    @ReactMethod
    @Override
    public void enableControl(@NonNull String controlName, boolean enable, @NonNull ReadableMap options) {
        legacyModule.enableControl(controlName, enable, options);
    }

    @ReactMethod
    @Override
    public void setNotificationIds(double notificationId, @NonNull String channelId) {
        legacyModule.setNotificationIds((int)notificationId, channelId);
    }

    @ReactMethod
    @Override
    public void observeAudioInterruptions(boolean enable) {
        legacyModule.observeAudioInterruptions(enable);
    }

    @ReactMethod
    @Override
    public void addListener(String eventName) {
        // TurboModule event handling
        listenerCount++;
        // The legacy module handles the actual event setup
    }

    @ReactMethod
    @Override
    public void removeListeners(double count) {
        // TurboModule event handling
        listenerCount = Math.max(0, listenerCount - (int)count);
        if (listenerCount == 0) {
            // Clean up listeners in legacy module if needed
        }
    }

    /**
     * Interface for forwarding events from legacy module
     */
    public interface MusicControlEventForwarder {
        void sendEvent(String eventName, WritableMap params);
    }
}
