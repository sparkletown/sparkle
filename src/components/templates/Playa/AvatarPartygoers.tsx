import React from "react";
import { useSelector } from "../../../hooks/useSelector";
import { PLAYA_AVATAR_SIZE } from "../../../settings";
import { UserState } from "../../../types/RelayMessage";
import { WithId } from "../../../utils/id";
import { User } from "../../../types/User";
interface PropsType {
  user: WithId<User>;
  state: UserState;
}
const AvatarPartygoers: React.FC<PropsType> = ({ user, state }) => {
  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);
  const roomParticipants = user.video?.inRoomOwnedBy
    ? partygoers.filter(
        (partygoer) =>
          partygoer.video?.inRoomOwnedBy === user?.video?.inRoomOwnedBy &&
          partygoer.id &&
          partygoer.id !== user.id
      )
    : [];

  const avatarPositions: { [key: number]: { top: number; left: number } } = {
    0: {
      top: state.y - PLAYA_AVATAR_SIZE / 1,
      left: state.x - PLAYA_AVATAR_SIZE / 1,
    },
    1: {
      top: state.y - PLAYA_AVATAR_SIZE / 0.8,
      left: state.x,
    },
    2: {
      top: state.y - PLAYA_AVATAR_SIZE / 2,
      left: state.x + PLAYA_AVATAR_SIZE / 1.7,
    },
    3: {
      top: state.y + PLAYA_AVATAR_SIZE * 0.3,
      left: state.x + PLAYA_AVATAR_SIZE / 3,
    },
    4: {
      top: state.y + PLAYA_AVATAR_SIZE * 0.5,
      left: state.x - PLAYA_AVATAR_SIZE / 1.7,
    },
    5: {
      top: state.y - PLAYA_AVATAR_SIZE / 6,
      left: state.x - PLAYA_AVATAR_SIZE * 1.2,
    },
  };

  if (!roomParticipants.length) {
    return <></>;
  }
  return (
    <>
      {roomParticipants.map((participant, index) => (
        <div
          key={index}
          className="avatar-small"
          style={avatarPositions[index]}
        >
          <img
            className="profile-image"
            src={participant?.pictureUrl}
            alt={""}
            title={""}
          />
        </div>
      ))}
    </>
  );
};

export default AvatarPartygoers;
