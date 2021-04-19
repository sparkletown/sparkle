import React, { useEffect, useState } from "react";
import {
  Room,
  Participant,
  connect,
  LocalParticipant,
  RemoteParticipant,
} from "twilio-video";
import { useFirebase } from "react-redux-firebase";

import { useUser } from "hooks/useUser";
import { useWorldUsersById } from "hooks/users";

export const usePosterVideo = (venueId: string) => {
  const [room, setRoom] = useState<Room>();
  const [videoError, setVideoError] = useState<string>("");
  const [participants, setParticipants] = useState<
    Array<LocalParticipant | RemoteParticipant>
  >([]);

  const { user, profile } = useUser();
  const { worldUsersById } = useWorldUsersById();
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      if (!user) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: venueId,
      });
      setToken(response.data.token);
    })();
  }, [firebase, venueId, user]);

  const connectToVideoRoom = () => {
    if (!token) return;
    setVideoError("");

    connect(token, {
      name: venueId,
    }).then((room) => {
      setRoom(room);
    });
  };

  useEffect(() => {
    const localParticipant = room?.localParticipant;
    if (!localParticipant) return;

    setParticipants((prevParticipants) => [
      // Hopefully prevents duplicate users in the participant list
      ...prevParticipants.filter(
        (p) => p.identity !== localParticipant.identity
      ),
      localParticipant,
    ]);
  }, [room?.localParticipant]);

  useEffect(() => {
    if (!token) return;

    let localRoom: Room;

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

    connect(token, {
      name: venueId,
    })
      .then((room) => {
        setRoom(room);
        localRoom = room;
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      })
      .catch((error) => setVideoError(error.message));
  }, [venueId, token]);

  console.log({
    token,
    room,
    participants,
  });

  return {
    participants: [...participants],
  };
};
