import React, { useCallback, useMemo, useState } from "react";
import { noop } from "lodash";
import Twilio from "twilio-video";

import { getTwilioVideoToken } from "api/video";

import {
  EventSubscription,
  SubscribeToParticipantEvent,
} from "./internalTypes";
import {
  AudioTrack,
  LocalParticipant,
  Participant,
  StateUpdateCallback,
  StateUpdateCallbackParams,
  VideoCommsContextType,
  VideoCommsProviderProps,
  VideoCommsStatus,
  VideoTrack,
} from "./types";

export const VideoCommsContext = React.createContext<VideoCommsContextType>({
  status: VideoCommsStatus.Disconnected,
  joinChannel: () => {},
  disconnect: () => {},
  remoteParticipants: [],
  shareScreen: () => {},
  startAudio: noop,
  stopAudio: noop,
  startVideo: noop,
  stopVideo: noop,
  isTransmittingAudio: false,
  isTransmittingVideo: false,
});

// @debt These four functions could be combined.
const wrapRemoteVideoTrack = (track: Twilio.RemoteVideoTrack): VideoTrack => {
  return {
    kind: "video",
    id: track.sid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
  };
};

const wrapLocalVideoTrack = (track: Twilio.LocalVideoTrack): VideoTrack => {
  return {
    kind: "video",
    id: track.id,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
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

const wrapLocalAudioTrack = (track: Twilio.LocalAudioTrack): AudioTrack => {
  return {
    kind: "audio",
    id: track.id,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
    enabled: track.isEnabled,
  };
};

/**
 * This provides an interface over the top of Twilio. It is designed to
 * work outside of React as much as possible to avoid the complexity of dealing
 * with hooks.
 *
 * Instead, the method triggerStatusUpdate is used to let React know that the
 * state of the video call has changed.
 */
const TwilioImpl = (onStateUpdateCallback: StateUpdateCallback) => {
  let remoteParticipants: Participant[] = [];
  let room: Twilio.Room | undefined;
  let status = VideoCommsStatus.Disconnected;
  let participantEventSubscriptions: Map<
    Twilio.RemoteParticipant,
    EventSubscription[]
  > = new Map();
  let isTransmittingAudio = true;
  let isTransmittingVideo = true;

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

  // TODO, maybe the subscription management can go into it's own class to keep
  // things tidy
  const subscribeToParticipantEvent: SubscribeToParticipantEvent = (
    participant,
    eventName,
    callback
  ) => {
    participant.on(eventName, callback);
    let existing = participantEventSubscriptions.get(participant);
    if (!existing) {
      // TODO Come back to this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      existing = [[eventName, callback]];
    } else {
      // TODO Come back to this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      existing = [...existing, [eventName, callback]];
    }
    // TODO Come back to this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    participantEventSubscriptions.set(participant, existing);
  };

  const unsubscribeParticipantEvents = (
    participant: Twilio.RemoteParticipant
  ) => {
    const toUnsubscribe = participantEventSubscriptions.get(participant) || [];
    for (const [eventName, callbackFn] of toUnsubscribe) {
      participant.off(eventName, callbackFn);
    }
    participantEventSubscriptions.delete(participant);
  };

  const unsubscribeAllParticipantEvents = () => {
    for (const [
      participant,
      subscriptions,
    ] of participantEventSubscriptions.entries()) {
      for (const [eventName, callbackFn] of subscriptions) {
        participant.off(eventName, callbackFn);
      }
    }
    participantEventSubscriptions = new Map();
  };

  const participantConnected = (participant: Twilio.RemoteParticipant) => {
    remoteParticipants.push({
      id: participant.sid,
      audioTracks: [],
      videoTracks: remotePublicationsToTracks(participant.videoTracks),
    });
    [
      "trackSubscribed",
      "trackUnsubscribed",
      "trackEnabled",
      "trackDisabled",
    ].forEach((eventName) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      subscribeToParticipantEvent(participant, eventName, recalculateStatus);
    });
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

  const joinChannel = async (userId: string, newChannelId: string) => {
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
      video: true, // TODO Add these to the join method so we can join without video etc
      audio: true,
      enableDscp: true,
    })
      .then((newRoom: Twilio.Room) => {
        room = newRoom;

        // TODO track these properly so they're easy to unsubscribe from
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
        const screenTrack = new Twilio.LocalVideoTrack(stream.getTracks()[0]);
        if (!room) {
          console.error("Attempted to share screen before room connected");
          return;
        }
        room.localParticipant.publishTrack(screenTrack).then(() => {
          if (!room) {
            console.error("Attempted to share screen before room connected");
            return;
          }

          // TODO
          // screenTrack.mediaStreamTrack.onended = () => { shareScreenHandler() };

          recalculateStatus();
        });
      })
      .catch(() => {
        alert("Could not share the screen.");
      });
  };

  const recalculateStatus = () => {
    // TODO This should clone everything so that react isn't seeing internal
    // versions of the state. Or, use immutable versions of everything.
    // Ideally, just make everything immutable
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
    room.localParticipant.audioTracks.forEach((track) => {
      track.track.enable();
    });
    isTransmittingAudio = true;
    recalculateStatus();
  };
  const stopAudio = () => {
    if (!room) {
      console.warn("stopAudio called from invalid state");
      return;
    }
    room.localParticipant.audioTracks.forEach((track) => {
      track.track.disable();
    });
    isTransmittingAudio = false;
    recalculateStatus();
  };
  const startVideo = () => {
    if (!room) {
      console.warn("startVideo called from invalid state");
      return;
    }
    room.localParticipant.videoTracks.forEach((track) => {
      track.track.enable();
    });
    isTransmittingVideo = true;
    recalculateStatus();
  };
  const stopVideo = () => {
    if (!room) {
      console.warn("stopVideo called from invalid state");
      return;
    }
    room.localParticipant.videoTracks.forEach((track) => {
      track.track.disable();
    });
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
    .map((vt) => vt.track && wrapLocalVideoTrack(vt.track))
    .filter(notNull);
};

const localPublicationsToAudioTracks = (
  publications: Map<String, Twilio.LocalAudioTrackPublication>
): AudioTrack[] => {
  return Array.from(publications.values())
    .map((at) => at.track && wrapLocalAudioTrack(at.track))
    .filter(notNull);
};

export const VideoCommsProvider: React.FC<VideoCommsProviderProps> = ({
  userId,
  children,
}) => {
  const [status, setStatus] = useState<VideoCommsStatus>(
    VideoCommsStatus.Disconnected
  );
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant>();
  const [remoteParticipants, setRemoteParticipants] = useState<Participant[]>(
    []
  );
  const [isTransmittingAudio, setIsTransmittingAudio] = useState(true);
  const [isTransmittingVideo, setIsTransmittingVideo] = useState(true);

  const twilioCallback = useCallback((update: StateUpdateCallbackParams) => {
    // TODO All these state updates should be batched into one.
    setLocalParticipant(update.localParticipant);
    setStatus(update.status);
    setRemoteParticipants(update.remoteParticipants);
    setIsTransmittingAudio(update.isTransmittingAudio);
    setIsTransmittingVideo(update.isTransmittingVideo);
  }, []);

  const twilioImpl = useMemo(() => TwilioImpl(twilioCallback), [
    twilioCallback,
  ]);

  const contextState: VideoCommsContextType = {
    status,
    localParticipant,
    remoteParticipants,
    joinChannel: twilioImpl.joinChannel,
    disconnect: twilioImpl.disconnect,
    shareScreen: twilioImpl.shareScreen,
    isTransmittingAudio,
    isTransmittingVideo,
    startAudio: twilioImpl.startAudio,
    stopAudio: twilioImpl.stopAudio,
    startVideo: twilioImpl.startVideo,
    stopVideo: twilioImpl.stopVideo,
  };

  return (
    <VideoCommsContext.Provider value={contextState}>
      {children}
    </VideoCommsContext.Provider>
  );
};
