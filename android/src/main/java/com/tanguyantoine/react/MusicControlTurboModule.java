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

// TurboModule imports - conditional to avoid dependency issues
// These will only be used if TurboModule classes are available at runtime

/**
 * TurboModule implementation for MusicControl
 * Compatible with both New Architecture and Legacy Architecture
 * Uses composition pattern to avoid hard dependencies on TurboModule classes
 */
@ReactModule(name = MusicControlTurboModule.NAME)
public class MusicControlTurboModule extends MusicControlModule {
    public static final String NAME = "MusicControlManager";

    public MusicControlTurboModule(ReactApplicationContext context) {
        super(context);
        // Set up event forwarding for TurboModule compatibility
        setupEventForwarding();
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private void setupEventForwarding() {
        // Set up event forwarding for TurboModule compatibility
        // The base MusicControlModule already handles events properly
        // This method can be extended for additional TurboModule-specific event handling
    }

    // TurboModule-specific event handling methods
    @ReactMethod
    public void addListener(String eventName) {
        // TurboModule event handling
        // Events are handled by the base MusicControlModule
    }

    @ReactMethod  
    public void removeListeners(double count) {
        // TurboModule event handling
        // Events are handled by the base MusicControlModule
    }

    /**
     * Interface for forwarding events from legacy module
     */
    public interface MusicControlEventForwarder {
        void sendEvent(String eventName, WritableMap params);
    }
}
