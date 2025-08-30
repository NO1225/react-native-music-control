package com.tanguyantoine.react;

import android.content.Intent;
import android.os.Build;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.core.app.NotificationManagerCompat;

public class MusicControlEventEmitter {
    private static void sendEvent(ReactApplicationContext context, String type, Object value) {
        sendEvent(context, type, value, null);
    }
    
    private static void sendEvent(ReactApplicationContext context, String type, Object value, 
                                MusicControlTurboModule.MusicControlEventForwarder forwarder) {
        WritableMap data = Arguments.createMap();
        data.putString("name", type);

        if (value != null) {
            if (value instanceof Double || value instanceof Float) {
                data.putDouble("value", (double) value);
            } else if (value instanceof Boolean) {
                data.putBoolean("value", (boolean) value);
            } else if (value instanceof Integer) {
                data.putInt("value", (int) value);
            }
        }

        // Use event forwarder if available (TurboModule), otherwise use legacy emission
        if (forwarder != null) {
            forwarder.sendEvent("RNMusicControlEvent", data);
        } else {
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("RNMusicControlEvent", data);
        }
    }

    private final ReactApplicationContext context;
    private int notificationId;
    private MusicControlTurboModule.MusicControlEventForwarder eventForwarder;

    MusicControlEventEmitter(ReactApplicationContext context, int notificationId) {
        this.context = context;
        this.notificationId = notificationId;
    }
    
    MusicControlEventEmitter(ReactApplicationContext context, int notificationId, 
                           MusicControlTurboModule.MusicControlEventForwarder forwarder) {
        this.context = context;
        this.notificationId = notificationId;
        this.eventForwarder = forwarder;
    }

    public void onPlay() {
        sendEvent(context, "play", null, eventForwarder);
    }

    public void onPause() {
        sendEvent(context, "pause", null, eventForwarder);
    }

    public void onStop() {
        stopForegroundService();
        sendEvent(context, "stop", null, eventForwarder);
    }

    public void onSkipToNext() {
        sendEvent(context, "nextTrack", null, eventForwarder);
    }

    public void onSkipToPrevious() {
        sendEvent(context, "previousTrack", null, eventForwarder);
    }

    public void onSeekTo(long pos) {
        sendEvent(context, "seek", pos / 1000D, eventForwarder);
    }

    public void onFastForward() {
        sendEvent(context, "skipForward", null, eventForwarder);
    }

    public void onRewind() {
        sendEvent(context, "skipBackward", null, eventForwarder);
    }

    public void onSetRating(float rating) {
        sendEvent(context, "setRating", rating, eventForwarder);
    }

    public void onSetRating(boolean hasHeartOrThumb) {
        sendEvent(context, "setRating", hasHeartOrThumb, eventForwarder);
    }

    public void onVolumeChange(int volume) {
        sendEvent(context, "volume", volume, eventForwarder);
    }

    private void stopForegroundService() {
        NotificationManagerCompat.from(context).cancel(notificationId);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Intent myIntent =
                    new Intent(context, MusicControlNotification.NotificationService.class);
            context.stopService(myIntent);
        }
    }
}
