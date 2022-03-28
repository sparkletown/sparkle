export enum RetunableMediaSource {
  notTuned = "NOT_TUNED",
  channel = "CHANNEL",
  webcam = "WEBCAM",
  screenshare = "SCREENSHARE",
  embed = "EMBED,",
}

type ChannelSettings = {
  channelName: string;
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
