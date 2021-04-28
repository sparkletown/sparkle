import { useEffect, useMemo, useState } from "react";
import Video, { Room, LocalParticipant, RemoteParticipant } from "twilio-video";
import firebase from "firebase/app";

import { withId, WithId } from "utils/id";

import { User } from "types/User";

import { useUser } from "hooks/useUser";
import { useWorldUsersById } from "hooks/users";

// TODO: create useVideoRoom hook and divide this into two hooks & refactor it
export const usePosterVideo = (venueId: string) => {
  const [room, setRoom] = useState<Room>();
  const [participants, setParticipants] = useState<
    Array<LocalParticipant | RemoteParticipant>
  >([]);
  const [token, setToken] = useState<string>();
  const [hasVideo, setHasVideo] = useState(false);

  const { userId } = useUser();
  const { worldUsersById } = useWorldUsersById();

  const localParticipant = room?.localParticipant;

  useEffect(() => {
    (async () => {
      if (!userId) return;

      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: userId,
        room: venueId,
      });
      setToken(response.data.token);
    })();
  }, [venueId, userId]);

  useEffect(() => {
    if (!localParticipant) return;

    setParticipants((prevParticipants) => [
      // Hopefully prevents duplicate users in the participant list
      ...prevParticipants.filter(
        (p) => p.identity !== localParticipant.identity
      ),
      localParticipant,
    ]);
  }, [localParticipant]);

  useEffect(() => {
    if (!token) return;

    const participantConnected = (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) => [
        participant,
        ...prevParticipants.filter((p) => p.identity !== participant.identity),
      ]);
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) => {
        return prevParticipants.filter((p) => p !== participant);
      });
    };

    Video.connect(token, {
      name: venueId,
      video: hasVideo,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });
  }, [venueId, token, hasVideo]);

  const turnVideoOn = () => {
    setHasVideo(true);
  };

  const turnVideoOff = () => {
    setHasVideo(false);
  };

  const { passiveListerens, activeParticipants } = useMemo(
    () =>
      participants.reduce<{
        passiveListerens: WithId<User>[];
        activeParticipants: (RemoteParticipant | LocalParticipant)[];
      }>(
        (acc, participant) => {
          if (participant.videoTracks.size === 0) {
            return {
              ...acc,
              passiveListerens: [
                ...acc.passiveListerens,
                withId(
                  worldUsersById[participant.identity],
                  participant.identity
                ),
              ],
            };
          }

          return {
            ...acc,
            activeParticipants: [...acc.activeParticipants, participant],
          };
        },
        {
          passiveListerens: [],
          activeParticipants: [],
        }
      ),
    [participants, worldUsersById]
  );

  const isMeActiveParticipant = !!activeParticipants.find(
    (participant) => participant.identity === userId
  );

  return {
    activeParticipants,
    passiveListerens,

    isMeActiveParticipant,

    turnVideoOn,
    turnVideoOff,
  };
};
