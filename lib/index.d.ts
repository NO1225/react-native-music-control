import { Command } from "./types";
export { Command };
declare type TSetPlayingInfo = {
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
    artwork?: string | {
        uri: string;
    };
};
declare type TUpdatePlayingInfo = {
    bufferedTime?: number;
    speed?: number;
    state?: number;
    maxVolume?: number;
    volume?: number;
    rating?: number;
    elapsedTime?: number;
};
declare type TOnSeekCommand = {
    actionCommand: Command.seek;
    cb: (position: number) => void;
};
declare type TOnSetRatingCommand = {
    actionCommand: Command.setRating;
    cb: (rating: number) => void;
};
declare type TOnVolumeChangedCommand = {
    actionCommand: Command.volume;
    cb: (volume: number) => void;
};
declare type TOnCommand = {
    actionCommand: Command.play | Command.pause | Command.stop | Command.nextTrack | Command.previousTrack | Command.skipForward | Command.skipBackward;
    cb: () => void;
} | TOnSeekCommand | TOnSetRatingCommand | TOnVolumeChangedCommand;
declare type TAndroidControl = "skipForward" | "skipBackward" | "nextTrack" | "previousTrack" | "play" | "pause" | "togglePlayPause" | "stop" | "seek" | "setRating" | "volume" | "remoteVolume" | "closeNotification";
declare type TIosControl = "pause" | "play" | "changePlaybackPosition" | "stop" | "togglePlayPause" | "enableLanguageOption" | "disableLanguageOption" | "nextTrack" | "previousTrack" | "seekForward" | "seekBackward" | "skipBackward" | "skipForward";
declare type TControl = TAndroidControl | TIosControl;
declare type TNotificationCloseOptions = "always" | "paused" | "never";
declare type TControlOptions = {
    interval?: number;
    when?: TNotificationCloseOptions;
};
declare const MusicControl: {
    STATE_PLAYING: any;
    STATE_PAUSED: any;
    STATE_ERROR: any;
    STATE_STOPPED: any;
    STATE_BUFFERING: any;
    RATING_HEART: any;
    RATING_THUMBS_UP_DOWN: any;
    RATING_3_STARS: any;
    RATING_4_STARS: any;
    RATING_5_STARS: any;
    RATING_PERCENTAGE: any;
    enableBackgroundMode: (enable: boolean) => void;
    setNowPlaying: (info: TSetPlayingInfo) => void;
    setPlayback: (info: TUpdatePlayingInfo) => void;
    updatePlayback: (info: TUpdatePlayingInfo) => void;
    resetNowPlaying: () => void;
    enableControl: (controlName: TControl, enable: boolean, options?: TControlOptions) => void;
    handleCommand: (commandName: Command, value: any) => void;
    setNotificationId: (notificationId: any, channelId: any) => void;
    on: (onCommand: TOnCommand) => void;
    off: (actionName: Command) => void;
    stopControl: () => void;
    handleAudioInterruptions: (enable: boolean) => void;
};
export default MusicControl;
