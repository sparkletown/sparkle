import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import Video from "twilio-video";

const useTwilioRoom = (roomName) => {
  const { user, users } = useSelector((state) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));
  const [token, setToken] = useState();
  const firebase = useFirebase();
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    (async () => {
      if (!user || !users) return;

      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: user.uid,
        room: roomName,
      });
      setToken(response.data.token);
    })();
  }, [user, users]);

  useEffect(() => {
    if (!token) return;
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
      // [1,2,3,4,5,6,7,8,9,10,11,12,13].forEach(() => participantConnected(room.localParticipant))
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);
  return { participants };
};

export default useTwilioRoom;
