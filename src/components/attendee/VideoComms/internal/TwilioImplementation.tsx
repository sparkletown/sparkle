import Twilio from "twilio-video";

import { getTwilioVideoToken } from "api/video";

import {
  AudioTrack,
  Participant,
  StateUpdateCallback,
  VideoCommsStatus,
  VideoSource,
  VideoTrack,
} from "../types";

const TRACK_NAME_SCREENSHARE = "screenshare";

const getTrackSource = (track: Twilio.VideoTrack) =>
  track.name === TRACK_NAME_SCREENSHARE
    ? VideoSource.Screenshare
    : VideoSource.Webcam;

// @debt These four functions could be combined.
const wrapRemoteVideoTrack = (track: Twilio.RemoteVideoTrack): VideoTrack => {
  return {
    kind: "video",
    id: track.sid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
    sourceType: getTrackSource(track),
  };
};

const wrapLocalVideoPublication = (
  publication: Twilio.LocalVideoTrackPublication
): VideoTrack => {
  const track = publication.track;
  return {
    kind: "video",
    id: publication.trackSid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
    sourceType: getTrackSource(track),
  };
};

const wrapRemoteAudioTrack = (track: Twilio.RemoteAudioTrack): AudioTrack => {
  return {
    kind: "audio",
    id: track.sid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
  };
};

const wrapLocalAudioPublication = (
  publication: Twilio.LocalAudioTrackPublication
): AudioTrack => {
  const track = publication.track;
  return {
    kind: "audio",
    id: publication.trackSid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
  };
};

/**
 * Used with filter to allow Typescript to convert arrays that might have nulls
 * in them into arrays of just a specific type.
 */
const notNull = <T,>(value: T | null): value is T => value !== null;

const remotePublicationsToTracks = (
  publications: Map<String, Twilio.RemoteVideoTrackPublication>
): VideoTrack[] => {
  return Array.from(publications.values())
    .map((vt) => vt.track && wrapRemoteVideoTrack(vt.track))
    .filter(notNull);
};

const remotePublicationsToAudioTracks = (
  publications: Map<String, Twilio.RemoteAudioTrackPublication>
): AudioTrack[] => {
  return Array.from(publications.values())
    .map((at) => at.track && wrapRemoteAudioTrack(at.track))
    .filter(notNull);
};

const localPublicationsToVideoTracks = (
  publications: Map<String, Twilio.LocalVideoTrackPublication>
): VideoTrack[] => {
  return Array.from(publications.values())
    .map((p) => p.track && wrapLocalVideoPublication(p))
    .filter(notNull);
};

const localPublicationsToAudioTracks = (
  publications: Map<String, Twilio.LocalAudioTrackPublication>
): AudioTrack[] => {
  return Array.from(publications.values())
    .map((p) => p.track && wrapLocalAudioPublication(p))
    .filter(notNull);
};

/**
 * This provides an interface over the top of Twilio. It is designed to
 * work outside of React as much as possible to avoid the complexity of dealing
 * with hooks.
 *
 * Instead, the method triggerStatusUpdate is used to let React know that the
 * state of the video call has changed.
 */
export const TwilioImpl = (onStateUpdateCallback: StateUpdateCallback) => {
  let remoteParticipants: Participant[] = [];
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

  const updateLocalParticipant = () => {
    if (!room) {
      return undefined;
    }
    return {
      id: room.localParticipant.sid,
      audioTracks: localPublicationsToAudioTracks(
        room.localParticipant.audioTracks
      ),
      videoTracks: localPublicationsToVideoTracks(
        room.localParticipant.videoTracks
      ),
      // @debt Maybe these methods are in the wrong place.
    };
  };

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
    remoteParticipants.push({
      id: participant.sid,
      audioTracks: [],
      videoTracks: remotePublicationsToTracks(participant.videoTracks),
    });
    for (const eventName of subscribedEvents) {
      participant.on(eventName, recalculateStatus);
    }
    recalculateStatus();
  };

  const participantDisconnected = (participant: Twilio.RemoteParticipant) => {
    remoteParticipants = remoteParticipants.filter(
      (p) => p.id !== participant.sid
    );
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
      id: participant.sid,
      audioTracks,
      videoTracks,
    };
  };

  const joinChannel = async (
    userId: string,
    newChannelId: string,
    enableVideo: boolean,
    enableAudio: boolean
  ) => {
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
    remoteParticipants = [];
    recalculateStatus();
  };

  const shareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        // The name of the track is used to identify that this is a screenshare
        // rather than a webcam source. This can then be used when displaying
        // the stream
        const screenTrack = new Twilio.LocalVideoTrack(stream.getTracks()[0], {
          logLevel: "off",
          name: TRACK_NAME_SCREENSHARE,
        });
        if (!room) {
          console.error("Attempted to share screen before room connected");
          return;
        }
        room.localParticipant.publishTrack(screenTrack).then(() => {
          if (!room) {
            console.error("Attempted to share screen before room connected");
            return;
          }

          recalculateStatus();
        });
        screenTrack.mediaStreamTrack.onended = () => {
          if (!room) {
            return;
          }
          room.localParticipant.unpublishTrack(screenTrack);
          recalculateStatus();
        };
      })
      .catch(() => {
        alert("Could not share the screen.");
      });
  };

  const recalculateStatus = () => {
    // This isn't particularly performant. However, we generally don't get
    // a lot of state changes happening during a call so this is probably ok.
    // It's more important to present a simple API than it is to overly fixate
    // on performance
    const localParticipant = updateLocalParticipant();
    const remoteParticipants = Array.from(
      room?.participants.values() || []
    ).map(wrapRemoteParticipant);

    onStateUpdateCallback({
      localParticipant,
      status,
      remoteParticipants,
      isTransmittingAudio,
      isTransmittingVideo,
    });
  };

  const startAudio = () => {
    if (!room) {
      console.warn("startAudio called from invalid state");
      return;
    }
    if (!room.localParticipant.audioTracks.size) {
      // This situation arises when the local participant joins a call without
      // audio enabled at the start. Create the audio stream now.
      Twilio.createLocalAudioTrack().then((localAudioTrack) => {
        if (!room) {
          return;
        }
        room.localParticipant.publishTrack(localAudioTrack).then(() => {
          recalculateStatus();
        });
      });
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
  const startVideo = () => {
    if (!room) {
      console.warn("startVideo called from invalid state");
      return;
    }
    if (!room.localParticipant.videoTracks.size) {
      // This situation arises when the local participant joins a call without
      // video enabled at the start. Create the video stream now.
      Twilio.createLocalVideoTrack().then((localVideoTrack) => {
        if (!room) {
          return;
        }
        room.localParticipant.publishTrack(localVideoTrack).then(() => {
          recalculateStatus();
        });
      });
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
    console.log("stopping video");
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
