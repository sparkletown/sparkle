import React, { useEffect } from "react";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useFirebase } from "react-redux-firebase";
import Room from "./Video/Room";
import { User, VideoState } from "types/User";
import { WithId } from "utils/id";

type PropsType = {
  setSelectedUserProfile: (user: WithId<User>) => void;
};

const ROOM_PREFIX = "user-";

const VideoChatLayer: React.FunctionComponent<PropsType> = ({
  setSelectedUserProfile,
}) => {
  const firebase = useFirebase();
  const { user, profile } = useUser();
  const partygoers = useSelector((state) => state.firestore.data.partygoers);

  // Join your own chat when someone else joins your chat.
  // Only applicable if you're not already in a room.
  useEffect(() => {
    const joinUserVideoChat = (ownerUid: string) => {
      if (!user) return;
      const video: VideoState = {
        inRoomOwnedBy: ownerUid,
      };
      firebase.firestore().doc(`users/${user.uid}`).update({ video: video });
    };

    const alreadyInChat = profile?.video?.inRoomOwnedBy !== undefined;
    if (!user || alreadyInChat) return;
    if (
      Object.keys(partygoers).find(
        (uid) => partygoers[uid].video?.inRoomOwnedBy === user.uid
      )
    ) {
      joinUserVideoChat(user.uid);
    }
  }, [firebase, profile, user, partygoers]);

  if (!user || !profile || !profile.video) return <></>;
  const roomOwnerUid = profile.video.inRoomOwnedBy;
  if (roomOwnerUid === undefined) return <></>;

  const updateVideoState = (update: VideoState) => {
    firebase
      .firestore()
      .doc(`users/${user.uid}`)
      .update({ video: { ...profile.video, ...update } });
  };

  // Host leaving ends the chat
  const leave = () => {
    const inMyOwnRoom = user.uid === profile.video?.inRoomOwnedBy;
    if (inMyOwnRoom) {
      updateVideoState({ myRoomIsDisbanded: true });
    } else {
      updateVideoState({});
    }
  };

  const disbanded = partygoers[roomOwnerUid].video?.myRoomIsDisbanded === true;
  const removed = partygoers[
    roomOwnerUid
  ].video?.removedParticipantUids?.includes(user.uid);

  if (disbanded || removed) {
    leave();
    return <></>;
  }

  const inRoom = profile.video.inRoomOwnedBy !== undefined;
  if (!inRoom) return <></>;

  const roomName = ROOM_PREFIX + profile.video.inRoomOwnedBy;
  const host = user.uid === profile.video.inRoomOwnedBy;

  const removeParticipant = (uid: string) => {
    if (!host || !profile.video) return;
    const removed = profile.video.removedParticipantUids || [];
    if (!removed.includes(uid)) {
      removed.push(uid);
    }
    updateVideoState({
      removedParticipantUids: removed,
    });
  };

  return (
    <Room
      roomName={roomName}
      host={host}
      setSelectedUserProfile={setSelectedUserProfile}
      leave={leave}
      removeParticipant={removeParticipant}
    />
  );
};

export default VideoChatLayer;
