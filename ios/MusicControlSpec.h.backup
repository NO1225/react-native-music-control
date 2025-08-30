#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#include <ReactCommon/TurboModule.h>

namespace facebook {
namespace react {

/**
 * C++ class to integrate with iOS TurboModule
 */
class JSI_EXPORT NativeMusicControlSpecJSI : public TurboModule {
 protected:
  NativeMusicControlSpecJSI(std::shared_ptr<CallInvoker> jsInvoker);

 public:
  virtual void enableBackgroundMode(jsi::Runtime &rt, bool enable) = 0;
  virtual void setNowPlaying(jsi::Runtime &rt, jsi::Object info) = 0;
  virtual void updatePlayback(jsi::Runtime &rt, jsi::Object info) = 0;
  virtual void resetNowPlaying(jsi::Runtime &rt) = 0;
  virtual void stopControl(jsi::Runtime &rt) = 0;
  virtual void enableControl(jsi::Runtime &rt, std::string controlName, bool enable, jsi::Object options) = 0;
  virtual void observeAudioInterruptions(jsi::Runtime &rt, bool enable) = 0;
  virtual void addListener(jsi::Runtime &rt, std::string eventName) = 0;
  virtual void removeListeners(jsi::Runtime &rt, double count) = 0;
};

} // namespace react
} // namespace facebook

#endif // RCT_NEW_ARCH_ENABLED
