import VideoErrorModal from "components/organisms/Room/VideoErrorModal";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useSelector } from "hooks/useSelector";
import LocalParticipant from "components/organisms/Room/LocalParticipant";
import Video from "twilio-video";

import * as S from "./FireBarrel.styled";
import { BarrelPeple } from "./FireBarrel";
import { useUser } from "hooks/useUser";

interface PROPS {
  person: BarrelPeple;
  chairNumber: number;
  roomName?: string;
}

const FireSeat: React.FC<PROPS> = ({ person, chairNumber, roomName }) => {
  const [token, setToken] = useState<string>();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      if (!user || !!token) return;

      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: roomName,
      });

      console.log("response: ", user);

      setToken(response.data.token);
    })();
  }, [user, roomName, token]);

  const [room, setRoom] = useState<Video.Room>();
  const [videoError, setVideoError] = useState<string>("");

  useEffect(() => {
    return () => {
      if (room && room.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach(function (trackPublication) {
          //@ts-ignored
          trackPublication.track.stop(); //@debt typing does this work?
        });
        room.disconnect();
      }
    };
  }, [room]);

  const connectToVideoRoom = () => {
    if (!token) return;
    setVideoError("");

    Video.connect(token, { name: roomName })
      .then((room) => setRoom(room))
      .catch((error) => setVideoError(error.message));
  };

  const [participants, setParticipants] = useState<Array<Video.Participant>>(
    []
  );
  useEffect(() => {
    if (!token) return;
    let localRoom: Video.Room;
    const participantConnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) => [
        // Hopefully prevents duplicate users in the participant list
        ...prevParticipants.filter((p) => p.identity !== participant.identity),
        participant,
      ]);
    };

    const participantDisconnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) => {
        if (!prevParticipants.find((p) => p === participant)) {
          // Remove when root issue foudn and fixed
          console.error("Could not find disconnnected participant:");
          console.error(participant);
        }
        return prevParticipants.filter((p) => p !== participant);
      });
    };

    Video.connect(token, { name: roomName })
      .then((room) => {
        setRoom(room);
        localRoom = room;
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      })
      .catch((error) => {
        console.log("Error: ", error);
        setVideoError(error.message);
      });

    return () => {
      if (localRoom && localRoom.localParticipant.state === "connected") {
        localRoom.localParticipant.tracks.forEach((trackPublication) => {
          // @ts-ignored
          trackPublication.track.stop();
        });
        localRoom.disconnect();
      }
    };
  }, [participants, token, roomName]);

  const users = useSelector((state) => state.firestore.data.partygoers);
  const profileData = room ? users[room.localParticipant.identity] : undefined;

  return (
    <S.Chair isEmpty={false}>
      {user && room && profileData && (
        <LocalParticipant
          participant={room?.localParticipant}
          profileData={profileData}
          profileDataId={room?.localParticipant.identity}
          showIcon={false}
        />
      )}
      <VideoErrorModal
        show={!!videoError}
        onHide={() => setVideoError("")}
        errorMessage={videoError}
        onRetry={connectToVideoRoom}
        onBack={() => {}}
      />
    </S.Chair>
  );
};

export default FireSeat;
