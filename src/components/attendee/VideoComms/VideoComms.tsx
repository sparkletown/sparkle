import React, { useCallback, useState } from "react";
import { useList } from "react-use";
import Twilio, { RemoteParticipant, Room } from "twilio-video";

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

const useParticipantSubscriptions = () => {
  const [, setParticipantSubscriptions] = useState<
    Map<RemoteParticipant, [string, () => void][]>
  >(new Map());

  const subscribeToParticipantEvent = useCallback(
    (participant: RemoteParticipant, eventName, callbackFn) => {
      participant.on(eventName, callbackFn);
      setParticipantSubscriptions((prevSubscriptions) => {
        let existing = prevSubscriptions.get(participant);
        if (!existing) {
          existing = [[eventName, callbackFn]];
        } else {
          existing = [...existing, [eventName, callbackFn]];
        }
        const newSubscriptions = new Map(prevSubscriptions);
        newSubscriptions.set(participant, existing);
        return newSubscriptions;
      });
    },
    []
  );

  const unsubscribeParticipantEvents = useCallback(
    (participant: RemoteParticipant) => {
      setParticipantSubscriptions((prevSubscriptions) => {
        const toUnsubscribe = prevSubscriptions.get(participant) || [];
        for (const [eventName, callbackFn] of toUnsubscribe) {
          participant.off(eventName, callbackFn);
        }
        const newSubscriptions = new Map(prevSubscriptions);
        newSubscriptions.delete(participant);
        return newSubscriptions;
      });
    },
    []
  );

  const unsubcribeAllParticipantEvents = useCallback(() => {
    setParticipantSubscriptions((prevSubscriptions) => {
      for (const [participant, subscriptions] of prevSubscriptions.entries()) {
        for (const [eventName, callbackFn] of subscriptions) {
          participant.off(eventName, callbackFn);
        }
      }
      return new Map();
    });
  }, []);

  return {
    subscribeToParticipantEvent,
    unsubscribeParticipantEvents,
    unsubcribeAllParticipantEvents,
  };
};

export const VideoCommsProvider: React.FC<VideoCommsProviderProps> = ({
  userId,
  children,
}) => {
  const [room, setRoom] = useState<Room>();
  const [status, setStatus] = useState<VideoCommsStatus>(
    VideoCommsStatus.Disconnected
  );
  const [
    remoteParticipants,
    {
      set: setRemoteParticipants,
      upsert: upsertRemoteParticipant,
      filter: filterRemoteParticipants,
    },
  ] = useList<Participant>([]);
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant>();
  const {
    subscribeToParticipantEvent,
    unsubscribeParticipantEvents,
    unsubcribeAllParticipantEvents,
  } = useParticipantSubscriptions();

  const modifyParticipant = useCallback(
    (participantId, modifyFn) => {
      setRemoteParticipants((prevRemoteParticipants) => {
        return prevRemoteParticipants.map((p) => {
          if (p.id !== participantId) {
            return p;
          }
          return modifyFn(p);
        });
      });
    },
    [setRemoteParticipants]
  );

  const onTrackSubscribed = useCallback(
    (participant: RemoteParticipant, track: VideoTrack | AudioTrack) => {
      if (track.kind === "video") {
        modifyParticipant(
          participant.sid,
          (prevParticipant: RemoteParticipant) => {
            return {
              ...prevParticipant,
              videoTracks: [...prevParticipant.videoTracks, track],
            };
          }
        );
      }
    },
    [modifyParticipant]
  );
  const joinChannelCallback = useCallback(
    async (userId, newChannelId) => {
      if (room) {
        console.error(
          "Attempting to join channel before disconnecting. Call disconnect first."
        );
        return;
      }
      setStatus(VideoCommsStatus.Connecting);
      // TODO Async stuff, loading, etc.
      const token = await getTwilioVideoToken({
        userId,
        roomName: newChannelId,
      });
      if (!token) {
        console.error("Failed to get twilio token");
        setStatus(VideoCommsStatus.Errored);
        return;
      }

      await Twilio.connect(token, {
        video: true, // TODO Add these to the method
        audio: true,
        enableDscp: true,
      })
        .then((room: Twilio.Room) => {
          const participantConnected = (participant: RemoteParticipant) => {
            console.debug(
              "participantConnected",
              participant,
              participant.state
            );
            upsertRemoteParticipant((p) => p.id === participant.sid, {
              id: participant.sid,
              audioTracks: [],
              videoTracks: publicationsToTracks(participant.videoTracks),
            });

            subscribeToParticipantEvent(
              participant,
              "trackSubscribed",
              (track: VideoTrack | AudioTrack) => {
                onTrackSubscribed(participant, track);
              }
            );
            subscribeToParticipantEvent(
              participant,
              "trackUnsubscribed",
              (track: VideoTrack | AudioTrack) => {
                onTrackSubscribed(participant, track);
              }
            );
            // Unsubscribe..
          };
          const participantDisconnected = (participant: RemoteParticipant) => {
            console.debug("participantDisconnected", participant);
            filterRemoteParticipants((p) => p.id !== participant.sid);
            unsubscribeParticipantEvents(participant);
          };

          room.on("participantConnected", participantConnected);
          room.on("participantDisconnected", participantDisconnected);
          room.participants.forEach(participantConnected);

          // Set the room etc
          setRoom(room);
          setStatus(VideoCommsStatus.Connected);
          setLocalParticipant({
            id: room.localParticipant.sid,
            audioTracks: Array.from(room.localParticipant.audioTracks.values()),
            videoTracks: publicationsToTracks(
              room.localParticipant.videoTracks
            ),
            startAudio: () => {},
            stopAudio: () => {},
            startVideo: () => {},
            stopVideo: () => {},
            isTransmittingAudio: false,
            isTransmittingVideo: false,
          });
          // TODO
        })
        .catch((error) => {
          setStatus(VideoCommsStatus.Errored);
          // TODO
        });
    },
    [
      filterRemoteParticipants,
      onTrackSubscribed,
      room,
      subscribeToParticipantEvent,
      unsubscribeParticipantEvents,
      upsertRemoteParticipant,
    ]
  );

  const disconnectCallback = useCallback(() => {
    // TODO
    // This could happen *during* a connection attempt. Need to make best
    // attempts to disconnect cleanly
    // Including stopping any connection in progress
    console.debug("Disconnecting");
    unsubcribeAllParticipantEvents();
    setRoom(() => undefined);
  }, [unsubcribeAllParticipantEvents]);

  const contextState: VideoCommsContextType = {
    status,
    channelId: room?.sid,
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
