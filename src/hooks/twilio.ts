import { useCallback, useEffect, useState } from "react";
import { useAsync } from "react-use";
import firebase from "firebase/app";
import {
  AudioTrack,
  connect,
  LocalParticipant,
  LocalVideoTrack,
  RemoteParticipant,
  Room,
  Track,
  VideoTrack,
} from "twilio-video";

import { getUser } from "api/profile";
import { useTwilioVideoToken } from "api/video";

import { ParticipantWithUser } from "types/rooms";
import { User } from "types/User";

import { WithId } from "utils/id";
import { logIfCannotFindExistingParticipant } from "utils/room";
import {
  appendTrack,
  filterTrack,
  isAudioTrack,
  isLocalAudioTrack,
  isLocalVideoTrack,
  isVideoTrack,
  trackMapToAudioTracks,
  trackMapToVideoTracks,
} from "utils/twilio";

import { useShowHide } from "./useShowHide";

export interface UseParticipantStateProps {
  participant?: LocalParticipant | RemoteParticipant;
  defaultMute: boolean;
  defaultVideoHidden: boolean;
}

/**
 * Manage the state of the audio/video tracks (including mute, hiding video, etc) for
 * the provided Twilio Participant.
 *
 * @param participant
 * @param defaultMute
 * @param defaultVideoHidden
 *
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/Participant.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/LocalParticipant.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/RemoteParticipant.html
 *
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/LocalVideoTrack.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/RemoteVideoTrack.html
 *
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/LocalAudioTrack.html
 * @see https://media.twiliocdn.com/sdk/js/video/releases/2.9.0/docs/RemoteAudioTrack.html
 */
export const useParticipantState = ({
  participant,
  defaultMute,
  defaultVideoHidden,
}: UseParticipantStateProps) => {
  // Audio / Video tracks
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

  useEffect(() => {
    if (!participant) return;

    setVideoTracks(trackMapToVideoTracks(participant.videoTracks));
    setAudioTracks(trackMapToAudioTracks(participant.audioTracks));

    const trackSubscribed = (track: Track) => {
      if (isVideoTrack(track)) {
        setVideoTracks(appendTrack(track));
      } else if (isAudioTrack(track)) {
        setAudioTracks(appendTrack(track));
      }
    };

    const trackUnsubscribed = (track: Track) => {
      if (isVideoTrack(track)) {
        setVideoTracks(filterTrack(track));
      } else if (isAudioTrack(track)) {
        setAudioTracks(filterTrack(track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      participant.off("trackSubscribed", trackSubscribed);
      participant.off("trackUnsubscribed", trackUnsubscribed);

      setVideoTracks([]);
      setAudioTracks([]);
    };
  }, [participant]);

  // Mute/unmute audio
  const {
    isShown: isAudioOn,

    setShown: setMuted,
    toggle: toggleMuted,
    show: unmuteAudio,
    hide: muteAudio,
  } = useShowHide(!defaultMute);

  const isMuted = !isAudioOn;

  useEffect(() => {
    if (isMuted) {
      // Mute all of our localAudioTracks
      audioTracks
        .filter(isLocalAudioTrack)
        .forEach((localAudioTrack) => localAudioTrack.disable());
    } else {
      // Unmute all of our localAudioTracks
      audioTracks
        .filter(isLocalAudioTrack)
        .forEach((localAudioTrack) => localAudioTrack.enable());
    }
  }, [audioTracks, isMuted]);

  // Show/hide video
  const {
    isShown: isVideoShown,

    show: showVideo,
    hide: hideVideo,
    toggle: toggleVideo,
  } = useShowHide(!defaultVideoHidden);

  const isVideoHidden = !isVideoShown;

  useEffect(() => {
    if (isVideoHidden) {
      // Pause all of our localVideoTracks
      videoTracks
        .filter(isLocalVideoTrack)
        .forEach((localVideoTrack) => localVideoTrack.disable());
    } else {
      // Unpause all of our localVideoTracks
      videoTracks
        .filter(isLocalVideoTrack)
        .forEach((localVideoTrack) => localVideoTrack.enable());
    }
  }, [videoTracks, isVideoHidden]);

  return {
    videoTracks,
    audioTracks,

    isMuted,
    setMuted,
    muteAudio,
    unmuteAudio,
    toggleMuted,

    isVideoHidden,
    hideVideo,
    showVideo,
    toggleVideo,
  };
};

export interface UseVideoRoomStateProps {
  user?: WithId<User>;
  roomName?: string;
  activeParticipantByDefault?: boolean;
}

export const useVideoRoomState = ({
  user,
  roomName,
  activeParticipantByDefault = true,
}: UseVideoRoomStateProps) => {
  const { value: token } = useTwilioVideoToken({ userId: user?.id, roomName });

  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<
    ParticipantWithUser<LocalParticipant | RemoteParticipant>[]
  >([]);

  const disconnect = useCallback(() => {
    setRoom((currentRoom) => {
      if (currentRoom?.localParticipant?.state !== "connected")
        return currentRoom;

      currentRoom.localParticipant.tracks.forEach((trackPublication) => {
        (trackPublication.track as LocalVideoTrack).stop();
      });

      currentRoom.disconnect();

      return undefined;
    });
  }, []);

  const {
    isShown: isActiveParticipant,

    show: becomeActiveParticipant,
    hide: becomePassiveParticipant,
  } = useShowHide(activeParticipantByDefault);

  const participantConnected = useCallback(
    async (participant: RemoteParticipant) => {
      const user = await getUser(participant.identity);

      setParticipants((prevParticipants) => [
        ...prevParticipants,
        {
          participant: participant,
          user,
        },
      ]);
    },
    []
  );

  const participantDisconnected = useCallback(
    (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) => {
        logIfCannotFindExistingParticipant(prevParticipants, participant);
        return prevParticipants.filter(
          (p) => p.participant.identity !== participant.identity
        );
      });
    },
    []
  );

  const { loading: roomLoading } = useAsync(async () => {
    if (!token || !roomName) return;

    // https://media.twiliocdn.com/sdk/js/video/releases/2.7.1/docs/global.html#ConnectOptions
    await connect(token, {
      name: roomName,
      video: isActiveParticipant,
      audio: isActiveParticipant,
      enableDscp: true,
    }).then(setRoom);
  }, [roomName, token, isActiveParticipant]);

  useEffect(() => () => disconnect(), [disconnect]);

  const { loading: participantsLoading } = useAsync(async () => {
    if (!room || !user) return;

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);

    const remoteParticipants = Array.from(room.participants.values());
    const remoteUsers: WithId<User>[] = await firebase
      .firestore()
      .collection("users")
      .where(
        firebase.firestore.FieldPath.documentId(),
        "in",
        remoteParticipants.map((p) => p.identity)
      )
      .get()
      .then(({ docs }) => docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    const remoteParticipantsWithUsers = remoteUsers.map((user, i) => ({
      participant: remoteParticipants[i],
      user,
    }));

    const localParticipantWithUser = {
      participant: room.localParticipant,
      user,
    };

    setParticipants(
      room.localParticipant
        ? [localParticipantWithUser, ...remoteParticipantsWithUsers]
        : remoteParticipantsWithUsers
    );

    // Do we need `.off`? It looks like it's not in the docs
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room, user, participantConnected, participantDisconnected]);

  return {
    token,

    room,
    participants,
    participantsLoading: participantsLoading || roomLoading,

    disconnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
