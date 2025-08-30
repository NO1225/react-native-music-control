
package com.tanguyantoine.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Legacy ReactPackage for Music Control
 * For New Architecture, use MusicControlTurboReactPackage instead
 */
public class MusicControl implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext context) {
        List<NativeModule> modules = new ArrayList<>();
        
        // Check if we're running in New Architecture mode
        boolean isNewArchEnabled = false;
        try {
            // Try to detect if TurboModule registry is available
            Class<?> turboModuleRegistry = Class.forName("com.facebook.react.turbomodule.core.TurboModuleRegistry");
            isNewArchEnabled = true;
        } catch (ClassNotFoundException e) {
            // New Architecture not available, use legacy module
            isNewArchEnabled = false;
        }
        
        if (isNewArchEnabled) {
            // For New Architecture, we should use TurboReactPackage instead
            // But provide fallback for transition period
            modules.add(new MusicControlTurboModule(context));
        } else {
            // Legacy Architecture
            modules.add(new MusicControlModule(context));
        }
        
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext context) {
        return Collections.emptyList();
    }
}
