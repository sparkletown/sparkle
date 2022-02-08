import React, { useCallback, useMemo, useState } from "react";
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
});

// @debt These four functions could be combined.
const wrapRemoteVideoTrack = (track: Twilio.RemoteVideoTrack): VideoTrack => {
  return {
    kind: "video",
    id: track.sid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
  };
};

const wrapLocalVideoTrack = (track: Twilio.LocalVideoTrack): VideoTrack => {
  return {
    kind: "video",
    id: track.id,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
  };
};

const wrapRemoteAudioTrack = (track: Twilio.RemoteAudioTrack): AudioTrack => {
  return {
    kind: "audio",
    id: track.sid,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
  };
};

const wrapLocalAudioTrack = (track: Twilio.LocalAudioTrack): AudioTrack => {
  return {
    kind: "audio",
    id: track.id,
    attach: track.attach.bind(track),
    detach: track.detach.bind(track),
    twilioTrack: track,
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
  let localParticipant: LocalParticipant | undefined;
  let status = VideoCommsStatus.Disconnected;
  let participantEventSubscriptions: Map<
    Twilio.RemoteParticipant,
    EventSubscription[]
  > = new Map();

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
      existing = [[eventName, callback]];
    } else {
      existing = [...existing, [eventName, callback]];
    }
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
    subscribeToParticipantEvent(participant, "trackSubscribed", (track) =>
      onTrackSubscribed(participant, track)
    );
    subscribeToParticipantEvent(participant, "trackUnsubscribed", (track) =>
      onTrackUnsubscribed(participant, track)
    );
    triggerStatusUpdate();
  };

  const participantDisconnected = (participant: Twilio.RemoteParticipant) => {
    remoteParticipants = remoteParticipants.filter(
      (p) => p.id !== participant.sid
    );
    unsubscribeParticipantEvents(participant);
    triggerStatusUpdate();
  };

  const onTrackSubscribed = (
    participant: Twilio.RemoteParticipant,
    track: Twilio.RemoteTrack
  ) => {
    const mappedParticipant = remoteParticipants.find(
      (p) => p.id === participant.sid
    );
    if (!mappedParticipant) {
      // TODO probably warn
      return;
    }

    if (track.kind === "video") {
      mappedParticipant.videoTracks.push(wrapRemoteVideoTrack(track));
    } else if (track.kind === "audio") {
      mappedParticipant.audioTracks.push(wrapRemoteAudioTrack(track));
    }
    triggerStatusUpdate();
  };

  const onTrackUnsubscribed = (
    participant: Twilio.RemoteParticipant,
    track: Twilio.RemoteTrack
  ) => {
    // @debt duplicated of finding participant
    const mappedParticipant = remoteParticipants.find(
      (p) => p.id === participant.sid
    );
    if (!mappedParticipant) {
      // TODO probably warn
      return;
    }
    if (track.kind === "video") {
      mappedParticipant.videoTracks = mappedParticipant.videoTracks.filter(
        (t) => t.id !== track.sid
      );
    }
    if (track.kind === "audio") {
      mappedParticipant.audioTracks = mappedParticipant.audioTracks.filter(
        (t) => t.id !== track.sid
      );
    }

    triggerStatusUpdate();
  };

  const joinChannel = async (userId: string, newChannelId: string) => {
    if (room) {
      console.error(
        "Attempting to join channel before disconnecting. Call disconnect first."
      );
      return;
    }
    status = VideoCommsStatus.Connecting;
    triggerStatusUpdate();

    const token = await getTwilioVideoToken({
      userId,
      roomName: newChannelId,
    });
    if (!token) {
      console.error("Failed to get twilio token");
      status = VideoCommsStatus.Errored;
      triggerStatusUpdate();
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
        localParticipant = {
          id: room.localParticipant.sid,
          audioTracks: localPublicationsToAudioTracks(
            room.localParticipant.audioTracks
          ),
          videoTracks: localPublicationsToVideoTracks(
            room.localParticipant.videoTracks
          ),
          startAudio: () => {},
          stopAudio: () => {},
          startVideo: () => {},
          stopVideo: () => {},
          isTransmittingAudio: false,
          isTransmittingVideo: false,
        };

        triggerStatusUpdate();
      })
      .catch((error) => {
        status = VideoCommsStatus.Errored;
        triggerStatusUpdate();
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
    triggerStatusUpdate();
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

          // TODO Extract this as it is repetitive
          console.log(
            "I want to update local particiapnt",
            room.localParticipant
          );
          localParticipant = {
            id: room.localParticipant.sid,
            audioTracks: [], // Array.from(room.localParticipant.audioTracks.values()),
            videoTracks: localPublicationsToVideoTracks(
              room.localParticipant.videoTracks
            ),
            startAudio: () => {},
            stopAudio: () => {},
            startVideo: () => {},
            stopVideo: () => {},
            isTransmittingAudio: false,
            isTransmittingVideo: false,
          };

          triggerStatusUpdate();
        });
      })
      .catch(() => {
        alert("Could not share the screen.");
      });
  };

  const triggerStatusUpdate = () => {
    // TODO This should clone everything so that react isn't seeing internal
    // versions of the state. Or, use immutable versions of everything.
    // Ideally, just make everything immutable
    onStateUpdateCallback({
      localParticipant,
      status,
      remoteParticipants: [...remoteParticipants],
    });
  };

  return {
    joinChannel,
    disconnect,
    shareScreen,
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

  const twilioCallback = useCallback((update: StateUpdateCallbackParams) => {
    setLocalParticipant(update.localParticipant);
    setStatus(update.status);
    setRemoteParticipants(update.remoteParticipants);
  }, []);

  const twilioImpl = useMemo(
    () => TwilioImpl(twilioCallback),
    [twilioCallback]
  );

  const joinChannelCallback = useCallback(
    async (userId, newChannelId) => {
      twilioImpl.joinChannel(userId, newChannelId);
    },
    [twilioImpl]
  );

  const disconnectCallback = useCallback(() => {
    twilioImpl.disconnect();
  }, [twilioImpl]);

  const shareScreenCallback = useCallback(() => {
    twilioImpl.shareScreen();
  }, [twilioImpl]);

  const contextState: VideoCommsContextType = {
    status,
    localParticipant,
    remoteParticipants,
    joinChannel: joinChannelCallback,
    disconnect: disconnectCallback,
    shareScreen: shareScreenCallback,
  };

  return (
    <VideoCommsContext.Provider value={contextState}>
      {children}
    </VideoCommsContext.Provider>
  );
};
