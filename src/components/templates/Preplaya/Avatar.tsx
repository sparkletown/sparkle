import React, { useMemo } from "react";
import { UserState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";

interface PropsType {
  user: WithId<User> | undefined;
  state: UserState;
  scale: number;
  zoom: number;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

export const Avatar: React.FunctionComponent<PropsType> = ({
  user,
  state,
  scale,
  zoom,
  setSelectedUserProfile,
}) => {
  const top = useMemo(() => state.y * scale, [state.y, scale]);
  const left = useMemo(() => state.x * scale, [state.x, scale]);

  if (!user) return <></>;

  return (
    <div
      className="avatar"
      style={{ top, left }}
      onClick={() => setSelectedUserProfile(user)}
    >
      <img
        className="profile-image"
        src={user.pictureUrl}
        alt={user.partyName}
        title={user.partyName}
      />
    </div>
  );
};
