import React, { useState, useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";
import LocalParticipant from "./LocalParticipant";
import Participant from "./Participant";
import "./Room.scss";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { User } from "types/User";

interface RoomProps {
  roomName: string;
  setUserList: (val: User[]) => void;
  setParticipantCount?: (val: number) => void;
  hasChairs?: boolean;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  setUserList,
  setParticipantCount,
  hasChairs = true,
}) => {
  const [room, setRoom] = useState<Video.Room>();
  const [participants, setParticipants] = useState<Array<Video.Participant>>(
    []
  );

  const { user } = useUser();
  const users = useSelector((state) => state.firestore.data.partygoers);
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      if (!user) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: roomName,
      });
      setToken(response.data.token);
    })();
  }, [firebase, roomName, user]);

  useEffect(() => {
    if (!token) return;

    let localRoom: Video.Room;

    const participantConnected = (participant: Video.Participant) => {
      setParticipants((prevParticipants) => [
        // Hopefully prevents duplicate users in the participant list
        ...prevParticipants.filter((p) => p.identity !== participant.identity),
        participant,
      ]);
      if (setParticipantCount) {
        setParticipantCount(participants.length + 2);
      }
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
      if (setParticipantCount) {
        setParticipantCount(participants.length + 1);
      }
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      localRoom = room;
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
      // [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16].forEach(() =>
      //   participantConnected(room.localParticipant)
      // );
      if (setParticipantCount) {
        setParticipantCount(room.participants.size + 1);
      }
    });

    return () => {
      if (localRoom && localRoom.localParticipant.state === "connected") {
        localRoom.localParticipant.tracks.forEach(function (trackPublication) {
          //@ts-ignored
          trackPublication.track.stop(); //@debt typing does this work?
        });
        localRoom.disconnect();
      }
    };
  }, [roomName, setRoom, token, participants.length, setParticipantCount]);

  useEffect(() => {
    if (!room) return;

    setUserList([
      ...participants.map((p) => users[p.identity]),
      users[room.localParticipant.identity],
    ]);
  }, [participants, setUserList, users, room]);

  if (!token) {
    return <></>;
  }

  // Ordering of participants:
  // 1. Me
  // 2. Bartender, if found (only one allowed)
  // 3. Rest of the participants, in order

  // Only allow the first bartender to appear as bartender
  const userIdentity = room?.localParticipant?.identity;
  const meIsBartender =
    users && userIdentity
      ? users[userIdentity]?.data?.[roomName]?.bartender
      : undefined;

  // Video stream and local participant take up 2 slots
  // Ensure capacity is always even, so the grid works
  const capacity = 2 + participants.length + (participants.length % 2);

  const meComponent = room ? (
    <div className={`participant-container-${capacity}`}>
      <LocalParticipant
        key={room.localParticipant.sid}
        participant={room.localParticipant}
        profileData={users[room.localParticipant.identity]}
        profileDataId={room.localParticipant.identity}
        bartender={meIsBartender}
      />
    </div>
  ) : null;

  const othersComponents = participants.map((participant, index) => {
    if (!participant) {
      return null;
    }

    const bartender = !!meIsBartender
      ? users[participant.identity]?.data?.[roomName]?.bartender
      : undefined;

    return (
      <div
        key={participant.identity}
        className={`participant-container-${capacity}`}
      >
        <Participant
          key={`${participant.sid}-${index}`}
          participant={participant}
          profileData={users[participant.identity]}
          profileDataId={participant.identity}
          bartender={bartender}
        />
      </div>
    );
  });

  const emptyComponents = hasChairs
    ? [...Array(participants.length % 2)].map((e, index) => (
        <div
          key={`empty-participant-${index}`}
          className={`participant-container-${capacity}`}
        >
          <img
            className="empty-chair-image"
            src="/empty-chair.png"
            alt="empty chair"
          />
        </div>
      ))
    : [];

  return <>{[meComponent, ...othersComponents, ...emptyComponents]}</>;
};

export default Room;
