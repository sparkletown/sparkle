import React, { useMemo } from "react";
import { UserState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";
import { PLAYA_AVATAR_SIZE } from "settings";

interface PropsType {
  user: WithId<User> | undefined;
  state: UserState;
  zoom: number;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

export const Avatar: React.FunctionComponent<PropsType> = ({
  user,
  state,
  zoom,
  setSelectedUserProfile,
}) => {
  const top = useMemo(() => state.y - PLAYA_AVATAR_SIZE / 2, [state.y]);
  const left = useMemo(() => state.x - PLAYA_AVATAR_SIZE / 2, [state.x]);

  if (!user) return <></>;

  return (
    <div
      className="avatar they"
      style={{ top, left }}
      onClick={() => setSelectedUserProfile(user)}
    >
      <span className="img-vcenter-helper" />
      <img
        className="profile-image"
        src={user.pictureUrl}
        alt={user.partyName}
        title={user.partyName}
      />
    </div>
  );
};
