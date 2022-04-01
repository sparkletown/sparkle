export enum RetunableMediaSource {
  notTuned = "NOT_TUNED",
  channel = "CHANNEL",
  webcam = "WEBCAM",
  screenshare = "SCREENSHARE",
  embed = "EMBED,",
}

type ChannelSettings = {
  // Channel definitions are copied to the element when the element is "tuned"
  // and this means that we don't have to worry about someone changing or
  // deleting the channel from admin whilst the element is tuned to it.
  channelName: string;
  channelUrl: string;
  sourceType: RetunableMediaSource.channel;
};

type WebcamSettings = {
  webcamUserId: string;
  sourceType: RetunableMediaSource.webcam;
};

type ScreenshareSettings = {
  screenshareUserId: string;
  sourceType: RetunableMediaSource.screenshare;
};

type EmbedSettings = {
  embedUrl: string;
  sourceType: RetunableMediaSource.embed;
};

export type NotTunedSettings = {
  sourceType: RetunableMediaSource.notTuned;
};

export type RetunableMediaElementSettings =
  | ChannelSettings
  | WebcamSettings
  | ScreenshareSettings
  | EmbedSettings
  | NotTunedSettings;
