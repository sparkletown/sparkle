import React from "react";

import { PLAYA_AVATAR_SIZE } from "../../../settings";

import { useRecentVenueUsers } from "hooks/users";

import { UserState } from "../../../types/RelayMessage";
import { User } from "../../../types/User";
import { WithId } from "../../../utils/id";

import AvatarImage from "./AvatarImage";
interface PropsType {
  user: WithId<User>;
  state: UserState;
  useProfilePicture: boolean;
}
const AvatarPartygoers: React.FC<PropsType> = ({
  user,
  state,
  useProfilePicture,
}) => {
  // @debt we don't have access to venueName here (but is legacy Playa template code to be removed so we don't mind), this is basically a noop
  const { recentVenueUsers } = useRecentVenueUsers({ venueName: undefined });
  const roomParticipants = user.video?.inRoomOwnedBy
    ? recentVenueUsers.filter(
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
          <AvatarImage
            user={participant}
            useProfilePicture={useProfilePicture}
          />
        </div>
      ))}
    </>
  );
};

export default AvatarPartygoers;
