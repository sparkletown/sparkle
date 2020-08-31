import React from "react";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useFirebase } from "react-redux-firebase";
import Room from "./Video/Room";
import { User, VideoState } from "types/User";
import { WithId } from "utils/id";
import { PROJECT_ID } from "secrets";

type PropsType = {
  setSelectedUserProfile: (user: WithId<User>) => void;
};

const ROOM_PREFIX = PROJECT_ID + "-";

const VideoChatLayer: React.FunctionComponent<PropsType> = ({
  setSelectedUserProfile,
}) => {
  const firebase = useFirebase();
  const { user, profile } = useUser();
  const partygoers = useSelector((state) => state.firestore.data.partygoers);

  if (!user || !profile || !profile.video) return <></>;
  const roomOwnerUid = profile.video.inRoomOwnedBy;
  if (roomOwnerUid === undefined) return <></>;

  const updateVideoState = (update: VideoState) => {
    firebase.firestore().doc(`users/${user.uid}`).update({ video: update });
  };

  const leave = () => {
    profile.video = {};
    updateVideoState({});
  };

  const removed = partygoers[
    roomOwnerUid
  ]?.video?.removedParticipantUids?.includes(user.uid);

  if (removed) {
    leave();
    return <></>;
  }

  // Shortcut out if not in a room
  if (profile.video.inRoomOwnedBy === undefined) return <></>;

  const roomName = ROOM_PREFIX + profile.video.inRoomOwnedBy;
  const host = user.uid === profile.video.inRoomOwnedBy;

  const removeParticipant = (uid: string) => {
    if (!host || !profile.video) return;
    const removed = profile.video.removedParticipantUids || [];
    if (!removed.includes(uid)) {
      removed.push(uid);
    }
    updateVideoState({
      ...profile.video,
      removedParticipantUids: removed,
    });
  };

  return (
    <Room
      roomName={roomName}
      hostUid={profile.video.inRoomOwnedBy}
      setSelectedUserProfile={setSelectedUserProfile}
      leave={leave}
      removeParticipant={removeParticipant}
    />
  );
};

export default VideoChatLayer;
