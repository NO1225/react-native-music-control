package com.tanguyantoine.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nonnull;

/**
 * ReactPackage for Music Control with TurboModule compatibility
 * Simplified version that avoids hard dependencies on TurboModule classes
 */
public class MusicControlTurboReactPackage implements ReactPackage {

    @Nonnull
    @Override
    public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext context) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MusicControlTurboModule(context));
        return modules;
    }

    @Nonnull
    @Override
    public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext context) {
        return Collections.emptyList();
    }
}
