#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <MediaPlayer/MediaPlayer.h>

// Conditional import for TurboModule support
#ifdef RCT_NEW_ARCH_ENABLED
#import <ReactCommon/RCTTurboModule.h>
#import "MusicControlManager-TurboModule.h"
#endif

@interface MusicControlManager : RCTEventEmitter <RCTBridgeModule
#ifdef RCT_NEW_ARCH_ENABLED
, RCTTurboModule, Spec
#endif
>

@end
