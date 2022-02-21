import {
  AudioTrack,
  JoinChannelOptions,
  Participant,
  StateUpdateCallback,
  TrackId,
  VideoCommsStatus,
  VideoSource,
  VideoTrack,
} from "components/attendee/VideoComms/types";
import Twilio from "twilio-video";

import { getTwilioVideoToken } from "api/video";

import { isDefined } from "utils/types";

const TRACK_NAME_SCREENSHARE = "screenshare";

const determineTrackSource = (track: Tracklike) =>
  track.name === TRACK_NAME_SCREENSHARE
    ? VideoSource.Screenshare
    : VideoSource.Webcam;

interface Tracklike {
  name: string;
  attach: () => void;
  detach: () => void;
  isEnabled: boolean;
}

const wrapRemoteVideoTrack = (track: Twilio.RemoteVideoTrack): VideoTrack => ({
  kind: "video",
  id: track.sid as TrackId,
  attach: track.attach.bind(track),
  detach: track.detach.bind(track),
  twilioTrack: track,
  enabled: track.isEnabled,
  sourceType: determineTrackSource(track),
});

const wrapLocalVideoPublication = ({
  track,
  trackSid,
}: Twilio.LocalVideoTrackPublication): VideoTrack => ({
  kind: "video",
  id: trackSid as TrackId,
  attach: track.attach.bind(track),
  detach: track.detach.bind(track),
  twilioTrack: track,
  enabled: track.isEnabled,
  sourceType: determineTrackSource(track),
});

const wrapRemoteAudioTrack = (track: Twilio.RemoteAudioTrack): AudioTrack => ({
  kind: "audio",
  id: track.sid as TrackId,
  attach: track.attach.bind(track),
  detach: track.detach.bind(track),
  twilioTrack: track,
  enabled: track.isEnabled,
});

const wrapLocalAudioPublication = ({
  track,
  trackSid,
}: Twilio.LocalAudioTrackPublication): AudioTrack => ({
  kind: "audio",
  id: trackSid as TrackId,
  attach: track.attach.bind(track),
  detach: track.detach.bind(track),
  twilioTrack: track,
  enabled: track.isEnabled,
});

const remotePublicationsToTracks = (
  publications: Map<String, Twilio.RemoteVideoTrackPublication>
): VideoTrack[] => {
  return Array.from(publications.values())
    .map(({ track }) => track && wrapRemoteVideoTrack(track))
    .filter(isDefined);
};

const remotePublicationsToAudioTracks = (
  publications: Map<String, Twilio.RemoteAudioTrackPublication>
): AudioTrack[] => {
  return Array.from(publications.values())
    .map(({ track }) => track && wrapRemoteAudioTrack(track))
    .filter(isDefined);
};

const localPublicationsToVideoTracks = (
  publications: Map<String, Twilio.LocalVideoTrackPublication>
): VideoTrack[] => {
  return Array.from(publications.values())
    .map((p) => p.track && wrapLocalVideoPublication(p))
    .filter(isDefined);
};

const localPublicationsToAudioTracks = (
  publications: Map<String, Twilio.LocalAudioTrackPublication>
): AudioTrack[] => {
  return Array.from(publications.values())
    .map((p) => p.track && wrapLocalAudioPublication(p))
    .filter(isDefined);
};

const wrapLocalParticipant = (room: Twilio.Room) => ({
  twilioId: room.localParticipant.sid,
  sparkleId: room.localParticipant.identity,
  audioTracks: localPublicationsToAudioTracks(
    room.localParticipant.audioTracks
  ),
  videoTracks: localPublicationsToVideoTracks(
    room.localParticipant.videoTracks
  ),
});

/**
 * This provides an interface over the top of Twilio. It is designed to
 * work outside of React as much as possible to avoid the complexity of dealing
 * with hooks.
 *
 * Instead, the method triggerStatusUpdate is used to let React know that the
 * state of the video call has changed.
 *
 * It is expected that this is not used directly by developers and all
 * interactions happen via the hooks and components provided in VideoComms.
 */
export const TwilioClient = (onStateUpdateCallback: StateUpdateCallback) => {
  let room: Twilio.Room | undefined;
  let status = VideoCommsStatus.Disconnected;
  let isTransmittingAudio = true;
  let isTransmittingVideo = true;

  const subscribedEvents = [
    "trackSubscribed",
    "trackUnsubscribed",
    "trackEnabled",
    "trackDisabled",
  ];

  const unsubscribeParticipantEvents = (
    participant: Twilio.RemoteParticipant
  ) => {
    for (const eventName of subscribedEvents) {
      participant.off(eventName, recalculateStatus);
    }
  };

  const unsubscribeAllParticipantEvents = () => {
    if (!room) {
      return;
    }
    for (const [, participant] of room.participants) {
      unsubscribeParticipantEvents(participant);
    }
  };

  const participantConnected = (participant: Twilio.RemoteParticipant) => {
    for (const eventName of subscribedEvents) {
      participant.on(eventName, recalculateStatus);
    }
    recalculateStatus();
  };

  const participantDisconnected = (participant: Twilio.RemoteParticipant) => {
    unsubscribeParticipantEvents(participant);
    recalculateStatus();
  };

  const wrapRemoteParticipant = (
    participant: Twilio.RemoteParticipant
  ): Participant => {
    const videoTracks = remotePublicationsToTracks(participant.videoTracks);
    const audioTracks = remotePublicationsToAudioTracks(
      participant.audioTracks
    );
    return {
      twilioId: participant.sid,
      sparkleId: participant.identity,
      audioTracks,
      videoTracks,
    };
  };

  const joinChannel = async ({
    userId,
    channelId: newChannelId,
    enableVideo,
    enableAudio,
  }: JoinChannelOptions) => {
    if (room) {
      console.error(
        "Attempting to join channel before disconnecting. Call disconnect first."
      );
      return;
    }
    status = VideoCommsStatus.Connecting;
    recalculateStatus();

    const token = await getTwilioVideoToken({
      userId,
      roomName: newChannelId,
    });
    if (!token) {
      console.error("Failed to get twilio token");
      status = VideoCommsStatus.Errored;
      recalculateStatus();
      return;
    }

    await Twilio.connect(token, {
      video: enableVideo,
      audio: enableAudio,
      enableDscp: true,
    })
      .then((newRoom: Twilio.Room) => {
        room = newRoom;
        isTransmittingAudio = enableAudio;
        isTransmittingVideo = enableVideo;

        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);

        status = VideoCommsStatus.Connected;

        recalculateStatus();
      })
      .catch((error) => {
        status = VideoCommsStatus.Errored;
        recalculateStatus();
      });
  };

  const disconnect = () => {
    // This method is as best effort as possible so that it can be used as a way
    // to reset the state of the system
    if (room && room.localParticipant.state === "connected") {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);

      room.localParticipant.tracks.forEach((trackPublication) => {
        const track = trackPublication.track;
        if (
          track instanceof Twilio.LocalVideoTrack ||
          track instanceof Twilio.LocalAudioTrack
        ) {
          track.stop();
        }
      });
      room.disconnect();
    }
    unsubscribeAllParticipantEvents();
    room = undefined;
    status = VideoCommsStatus.Disconnected;
    recalculateStatus();
  };

  const shareScreen = async () => {
    if (!room) {
      console.error("Attempted to share screen before room connected");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stream = await navigator.mediaDevices.getDisplayMedia();
    // The name of the track is used to identify that this is a screenshare
    // rather than a webcam source. This can then be used when displaying
    // the stream
    const screenTrack = new Twilio.LocalVideoTrack(stream.getTracks()[0], {
      logLevel: "off",
      name: TRACK_NAME_SCREENSHARE,
    });
    await room.localParticipant.publishTrack(screenTrack);
    recalculateStatus();

    screenTrack.mediaStreamTrack.onended = () => {
      if (!room) {
        return;
      }
      room.localParticipant.unpublishTrack(screenTrack);
      recalculateStatus();
    };
  };

  const recalculateStatus = () => {
    // This isn't particularly performant. However, we generally don't get
    // a lot of state changes happening during a call so this is probably ok.
    // It's more important to present a simple API than it is to overly fixate
    // on performance
    if (!room) {
      onStateUpdateCallback({
        status,
        remoteParticipants: [],
        isTransmittingAudio: false,
        isTransmittingVideo: false,
      });
      return;
    }

    const localParticipant = wrapLocalParticipant(room);
    const remoteParticipants = Array.from(room.participants.values()).map(
      wrapRemoteParticipant
    );

    onStateUpdateCallback({
      localParticipant,
      status,
      remoteParticipants,
      isTransmittingAudio,
      isTransmittingVideo,
    });
  };

  const startAudio = async () => {
    if (!room) {
      console.warn("startAudio called from invalid state");
      return;
    }
    if (!room.localParticipant.audioTracks.size) {
      // This situation arises when the local participant joins a call without
      // audio enabled at the start. Create the audio stream now.
      // Update the UI whilst we're publishing the streams
      isTransmittingAudio = true;
      recalculateStatus();

      const localAudioTrack = await Twilio.createLocalAudioTrack();
      await room.localParticipant.publishTrack(localAudioTrack);
      recalculateStatus();
    }
    for (const track of room.localParticipant.audioTracks.values()) {
      track.track.enable();
    }
    isTransmittingAudio = true;
    recalculateStatus();
  };
  const stopAudio = () => {
    if (!room) {
      console.warn("stopAudio called from invalid state");
      return;
    }
    for (const track of room.localParticipant.audioTracks.values()) {
      track.track.disable();
    }
    isTransmittingAudio = false;
    recalculateStatus();
  };
  const startVideo = async () => {
    if (!room) {
      console.warn("startVideo called from invalid state");
      return;
    }
    if (!room.localParticipant.videoTracks.size) {
      // This situation arises when the local participant joins a call without
      // video enabled at the start. Create the video stream now.
      isTransmittingVideo = true;
      recalculateStatus();

      const localVideoTrack = await Twilio.createLocalVideoTrack();
      await room.localParticipant.publishTrack(localVideoTrack);
      recalculateStatus();
    }
    for (const track of room.localParticipant.videoTracks.values()) {
      track.track.enable();
    }
    isTransmittingVideo = true;
    recalculateStatus();
  };
  const stopVideo = () => {
    if (!room) {
      console.warn("stopVideo called from invalid state");
      return;
    }
    for (const track of room.localParticipant.videoTracks.values()) {
      track.track.disable();
    }
    isTransmittingVideo = false;
    recalculateStatus();
  };

  return {
    joinChannel,
    disconnect,
    shareScreen,
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
  };
};
