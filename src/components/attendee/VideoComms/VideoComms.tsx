import React, { useCallback, useMemo, useState } from "react";
import Twilio, {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteParticipant,
  Room,
} from "twilio-video";

import { getTwilioVideoToken } from "api/video";

export enum VideoCommsStatus {
  Disconnected = "DISCONNECTED",
  Connecting = "CONNECTING",
  Connected = "CONNECTED",
  Errored = "ERRORED",
}

export const VideoCommsContext = React.createContext<VideoCommsContextType>({
  status: VideoCommsStatus.Disconnected,
  joinChannel: () => {},
  disconnect: () => {},
  remoteParticipants: [],
});

interface VideoCommsProviderProps {
  userId: string;
  children: React.ReactNode;
}

interface Track {
  kind: "video" | "audio";
}

interface VideoTrack extends Track {
  attach: (el: HTMLVideoElement) => void;
  kind: "video";
}

interface AudioTrack extends Track {
  kind: "audio";
}

export interface Participant {
  /**
   * ID of the participant - used for communication with the video platform
   */
  id: string;

  /**
   * Video tracks
   */
  videoTracks: VideoTrack[];

  /**
   * Audio tracks
   */
  audioTracks: AudioTrack[];
}

type JoinChannelFunc = (userId: string, channelId: string) => void;
type DisconnectFunc = () => void;
type StartAudioFunc = () => void;
type StopAudioFunc = () => void;
type StartVideoFunc = () => void;
type StopVideoFunc = () => void;
type StartScreenshareFunc = () => void;
type StopScreenshareFunc = () => void;

export interface LocalParticipant extends Participant {
  startAudio: () => void;
  stopAudio: () => void;
  stopVideo: () => void;
  startVideo: () => void;

  isTransmittingAudio: boolean;
  isTransmittingVideo: boolean;
}

interface VideoCommsContextType {
  channelId?: string;
  status: VideoCommsStatus;
  joinChannel: JoinChannelFunc;
  disconnect: DisconnectFunc;

  localParticipant?: LocalParticipant;
  remoteParticipants: Participant[];
}

export interface VideoCommsImplementation {
  joinChannel: JoinChannelFunc;
  disconnect: DisconnectFunc;

  stopLocalAudio: StopAudioFunc;
  startLocalAudio: StartAudioFunc;
  stopLocalVideo: StopVideoFunc;
  startLocalVideo: StartVideoFunc;

  // TODO implement this
  startScreenshare: StartScreenshareFunc;
  stopScreenshare: StopScreenshareFunc;
}

interface HasNullableTrack {
  track: VideoTrack | null;
}

interface StateUpdateCallbackParams {
  localParticipant?: LocalParticipant;
  remoteParticipants: Participant[];
  status: VideoCommsStatus;
}

type StateUpdateCallback = (update: StateUpdateCallbackParams) => void;

/**
 * This class provides an interface over the top of Twilio. It is designed to
 * work outside of React as much as possible to avoid the complexity of dealing
 * with hooks.
 *
 * Instead, the method triggerStatusUpdate is used to let React know that the
 * state of the video call has changed.
 *
 * The downside of this, is that anyone maintaining this code needs to be aware
 * of how closures and `this` interact. e.g. remember to use `bind`.
 */
class TwilioImpl {
  remoteParticipants: Participant[];
  onStateUpdateCallback: StateUpdateCallback;
  room?: Room;
  localParticipant?: LocalParticipant;
  status: VideoCommsStatus;
  participantEventSubscriptions: Map<
    RemoteParticipant,
    [string, (...args: unknown[]) => void][]
  >;

  constructor(onStateUpdateCallback: StateUpdateCallback) {
    this.remoteParticipants = [];
    this.onStateUpdateCallback = onStateUpdateCallback;
    this.status = VideoCommsStatus.Disconnected;
    this.participantEventSubscriptions = new Map();
  }

  // TODO, maybe the subscription management can go into it's own class to keep
  // things tidy
  subscribeToParticipantEvent(
    participant: RemoteParticipant,
    eventName: string,
    callback: (...args: unknown[]) => void
  ) {
    participant.on(eventName, callback);
    let existing = this.participantEventSubscriptions.get(participant);
    if (!existing) {
      existing = [[eventName, callback]];
    } else {
      existing = [...existing, [eventName, callback]];
    }
    this.participantEventSubscriptions.set(participant, existing);
  }

  unsubscribeParticipantEvents(participant: RemoteParticipant) {
    const toUnsubscribe =
      this.participantEventSubscriptions.get(participant) || [];
    for (const [eventName, callbackFn] of toUnsubscribe) {
      participant.off(eventName, callbackFn);
    }
    this.participantEventSubscriptions.delete(participant);
  }

  unsubscribeAllParticipantEvents() {
    for (const [
      participant,
      subscriptions,
    ] of this.participantEventSubscriptions.entries()) {
      for (const [eventName, callbackFn] of subscriptions) {
        participant.off(eventName, callbackFn);
      }
    }
    this.participantEventSubscriptions = new Map();
  }

  participantConnected(participant: RemoteParticipant) {
    this.remoteParticipants.push({
      id: participant.sid,
      audioTracks: [],
      videoTracks: publicationsToTracks(participant.videoTracks),
    });
    this.subscribeToParticipantEvent(
      participant,
      "trackSubscribed",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Come back and fix the types here
      (track: VideoTrack | AudioTrack) =>
        this.onTrackSubscribed(participant, track)
    );
    this.triggerStatusUpdate();
  }

  participantDisconnected(participant: RemoteParticipant) {
    this.remoteParticipants = this.remoteParticipants.filter(
      (p) => p.id !== participant.sid
    );
    this.unsubscribeParticipantEvents(participant);
    this.triggerStatusUpdate();
  }

  onTrackSubscribed(
    participant: RemoteParticipant,
    track: VideoTrack | AudioTrack
  ) {
    if (track.kind === "video") {
      const mappedParticipant = this.remoteParticipants.find(
        (p) => p.id === participant.sid
      );
      if (!mappedParticipant) {
        // TODO probably warn
        return;
      }
      mappedParticipant.videoTracks.push(track);
    }
    this.triggerStatusUpdate();
  }

  onTrackUnsubscribed(
    participant: RemoteParticipant,
    track: VideoTrack | AudioTrack
  ) {
    if (track.kind === "video") {
      const mappedParticipant = this.remoteParticipants.find(
        (p) => p.id === participant.sid
      );
      if (!mappedParticipant) {
        // TODO probably warn
        return;
      }
      mappedParticipant.videoTracks = mappedParticipant.videoTracks.filter(
        (t) => t !== track
      );
    }
    this.triggerStatusUpdate();
  }

  async joinChannel(userId: string, newChannelId: string) {
    if (this.room) {
      console.error(
        "Attempting to join channel before disconnecting. Call disconnect first."
      );
      return;
    }
    this.status = VideoCommsStatus.Connecting;
    this.triggerStatusUpdate();

    const token = await getTwilioVideoToken({
      userId,
      roomName: newChannelId,
    });
    if (!token) {
      console.error("Failed to get twilio token");
      this.status = VideoCommsStatus.Errored;
      this.triggerStatusUpdate();
      return;
    }

    await Twilio.connect(token, {
      video: true, // TODO Add these to the join method so we can join without video etc
      audio: true,
      enableDscp: true,
    })
      .then((room: Twilio.Room) => {
        // TODO track these properly so they're easy to unsubscribe from
        room.on("participantConnected", this.participantConnected.bind(this));
        room.on(
          "participantDisconnected",
          this.participantDisconnected.bind(this)
        );
        room.participants.forEach(this.participantConnected.bind(this));

        // Set the room etc
        this.room = room;
        this.status = VideoCommsStatus.Connected;
        this.localParticipant = {
          id: room.localParticipant.sid,
          audioTracks: Array.from(room.localParticipant.audioTracks.values()),
          videoTracks: publicationsToTracks(room.localParticipant.videoTracks),
          startAudio: () => {},
          stopAudio: () => {},
          startVideo: () => {},
          stopVideo: () => {},
          isTransmittingAudio: false,
          isTransmittingVideo: false,
        };

        this.triggerStatusUpdate();
      })
      .catch((error) => {
        this.status = VideoCommsStatus.Errored;
        this.triggerStatusUpdate();
      });
  }

  disconnect() {
    // This method is as best effort as possible so that it can be used as a way
    // to reset the state of the system
    if (this.room && this.room.localParticipant.state === "connected") {
      this.room.localParticipant.tracks.forEach((trackPublication) => {
        const track = trackPublication.track;
        if (
          track instanceof LocalVideoTrack ||
          track instanceof LocalAudioTrack
        ) {
          track.stop();
        }
      });
      this.room.disconnect();
    }
    this.unsubscribeAllParticipantEvents();
    this.room = undefined;
    this.status = VideoCommsStatus.Disconnected;
    this.remoteParticipants = [];
    this.triggerStatusUpdate();
  }

  triggerStatusUpdate() {
    // TODO This should clone everything so that react isn't seeing internal
    // versions of the state. Or, use immutable versions of everything.
    // Ideally, just make everything immutable
    this.onStateUpdateCallback({
      localParticipant: this.localParticipant,
      status: this.status,
      remoteParticipants: [...this.remoteParticipants],
    });
  }
}

/**
 * Used with filter to allow Typescript to convert arrays that might have nulls
 * in them into arrays of just a specific type.
 */
const notNull = <T,>(value: T | null): value is T => value !== null;

const publicationsToTracks = (
  publications: Map<String, HasNullableTrack>
): VideoTrack[] => {
  return Array.from(publications.values())
    .map((vt) => vt.track)
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
    () => new TwilioImpl(twilioCallback),
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

  const contextState: VideoCommsContextType = {
    status,
    localParticipant,
    remoteParticipants,
    joinChannel: joinChannelCallback,
    disconnect: disconnectCallback,
  };

  return (
    <VideoCommsContext.Provider value={contextState}>
      {children}
    </VideoCommsContext.Provider>
  );
};
