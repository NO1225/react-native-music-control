package com.tanguyantoine.react;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * TurboReactPackage for Music Control that supports both New Architecture and Legacy Architecture
 */
public class MusicControlTurboReactPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, @Nonnull ReactApplicationContext context) {
        switch (name) {
            case MusicControlTurboModule.NAME:
                return new MusicControlTurboModule(context);
            default:
                return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            
            map.put(
                MusicControlTurboModule.NAME,
                new ReactModuleInfo(
                    MusicControlTurboModule.NAME, // name
                    MusicControlTurboModule.NAME, // className
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true,  // hasConstants
                    false, // isCxxModule
                    true   // isTurboModule
                )
            );
            
            return map;
        };
    }
}
