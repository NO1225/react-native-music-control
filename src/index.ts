/**
 * @providesModule MusicControl
 */
import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
  // @ts-ignore
} from "react-native";
// @ts-ignore
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";
// @ts-ignore
import constants from "./constants";
import { Command } from "./types";

export { Command };

const NativeMusicControl = NativeModules.MusicControlManager;
let handlers: { [key in Command]?: (value: any) => void } = {};
let listenerOfNativeMusicControl: any = null;
const IS_ANDROID = Platform.OS === "android";
type TSetPlayingInfo = {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  description?: string;
  date?: string;
  duration?: number;
  color?: number;
  colorized?: boolean;
  notificationIcon?: string;
  rating?: number | boolean;
  artwork?: string | { uri: string };
};

type TUpdatePlayingInfo = {
  bufferedTime?: number;
  speed?: number;
  state?: number;
  maxVolume?: number;
  volume?: number;
  rating?: number;
  elapsedTime?: number;
};

type TOnSeekCommand = {
  actionCommand: Command.seek;
  cb: (position: number) => void;
};

type TOnSetRatingCommand = {
  actionCommand: Command.setRating;
  cb: (rating: number) => void;
};

type TOnVolumeChangedCommand = {
  actionCommand: Command.volume;
  cb: (volume: number) => void;
};

type TOnCommand =
  | {
      actionCommand:
        | Command.play
        | Command.pause
        | Command.stop
        | Command.nextTrack
        | Command.previousTrack
        | Command.skipForward
        | Command.skipBackward;
      cb: () => void;
    }
  | TOnSeekCommand
  | TOnSetRatingCommand
  | TOnVolumeChangedCommand;

type TControl =
  | "skipForward"
  | "skipBackward"
  | "nextTrack"
  | "previousTrack"
  | "play"
  | "pause"
  | "togglePlayPause"
  | "stop"
  | "seek"
  | "setRating"
  | "volume"
  | "remoteVolume"
  | "closeNotification";

type TNotificationCloseOptions = "always" | "paused" | "never";

type TControlOptions = {
  // Only with skipForward and skipBackward
  interval?: number;
  // only with closeNotification
  when?: TNotificationCloseOptions;
};

const MusicControl = {
  STATE_PLAYING: constants.STATE_PLAYING,
  STATE_PAUSED: constants.STATE_PAUSED,
  STATE_ERROR: constants.STATE_ERROR,
  STATE_STOPPED: constants.STATE_STOPPED,
  STATE_BUFFERING: constants.STATE_BUFFERING,

  RATING_HEART: constants.RATING_HEART,
  RATING_THUMBS_UP_DOWN: constants.RATING_THUMBS_UP_DOWN,
  RATING_3_STARS: constants.RATING_3_STARS,
  RATING_4_STARS: constants.RATING_4_STARS,
  RATING_5_STARS: constants.RATING_5_STARS,
  RATING_PERCENTAGE: constants.RATING_PERCENTAGE,

  enableBackgroundMode: function (enable: boolean) {
    NativeMusicControl.enableBackgroundMode(enable);
  },
  setNowPlaying: function (info: TSetPlayingInfo) {
    // Check if we have an android asset from react style image require
    if (info.artwork) {
      info.artwork = resolveAssetSource(info.artwork) || info.artwork;
    }

    NativeMusicControl.setNowPlaying(info);
  },
  setPlayback: function (info: TUpdatePlayingInfo): void {
    // Backwards compatibility. Use updatePlayback instead.
    NativeMusicControl.updatePlayback(info);
  },
  updatePlayback: function (info: TUpdatePlayingInfo): void {
    NativeMusicControl.updatePlayback(info);
  },
  resetNowPlaying: function () {
    NativeMusicControl.resetNowPlaying();
  },
  enableControl: function (
    controlName: TControl,
    enable: boolean,
    options: TControlOptions = {}
  ) {
    NativeMusicControl.enableControl(controlName, enable, options || {});
  },
  handleCommand: function (commandName: Command, value: any) {
    if (handlers[commandName]) {
      //@ts-ignore
      handlers[commandName](value);
    }
  },
  setNotificationId: function (notificationId: any, channelId: any) {
    if (IS_ANDROID) {
      NativeMusicControl.setNotificationIds(notificationId, channelId);
    }
  },
  on: function (onCommand: TOnCommand) {
    if (!listenerOfNativeMusicControl) {
      listenerOfNativeMusicControl = (
        IS_ANDROID
          ? DeviceEventEmitter
          : new NativeEventEmitter(NativeMusicControl)
      ).addListener("RNMusicControlEvent", (event) => {
        MusicControl.handleCommand(event.name, event.value);
      });
    }
    handlers[onCommand.actionCommand] = onCommand.cb;
  },
  off: function (actionName: Command): void {
    delete handlers[actionName];
    if (!Object.keys(handlers).length && listenerOfNativeMusicControl) {
      listenerOfNativeMusicControl.remove();
      listenerOfNativeMusicControl = null;
    }
  },
  stopControl: function (): void {
    if (listenerOfNativeMusicControl) {
      listenerOfNativeMusicControl.remove();
      listenerOfNativeMusicControl = null;
    }
    Object.keys(handlers).map((key) => {
      //@ts-ignore
      delete handlers[key];
    });
    NativeMusicControl.stopControl();
  },
  handleAudioInterruptions: function (enable: boolean): void {
    NativeMusicControl.observeAudioInterruptions(enable);
  },
};

export default MusicControl;
