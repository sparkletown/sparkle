import React, { useEffect, useMemo, useState } from "react";
import Video, {
  Room,
  Participant,
  connect,
  LocalParticipant,
  RemoteParticipant,
} from "twilio-video";
import { useFirebase } from "react-redux-firebase";

import { useUser } from "hooks/useUser";
import { useWorldUsersById } from "hooks/users";
import { withId, WithId } from "utils/id";
import { User } from "types/User";

export const usePosterVideo = (venueId: string) => {
  const [room, setRoom] = useState<Room>();
  const [videoError, setVideoError] = useState<string>("");
  const [participants, setParticipants] = useState<
    Array<LocalParticipant | RemoteParticipant>
  >([]);

  const [hasVideo, setHasVideo] = useState(false);

  const { user, profile } = useUser();
  const { worldUsersById } = useWorldUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  const userId = user?.uid;

  const localParticipant = room?.localParticipant;

  useEffect(() => {
    (async () => {
      if (!userId) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: userId,
        room: venueId,
      });
      setToken(response.data.token);
    })();
  }, [firebase, venueId, userId]);

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
    })
      .then((room) => {
        setRoom(room);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      })
      .catch((error) => setVideoError(error.message));
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

  console.log({ participants, activeParticipants, passiveListerens });

  return {
    activeParticipants,
    passiveListerens,

    isMeActiveParticipant,

    turnVideoOn,
    turnVideoOff,
  };
};
