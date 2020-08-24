import React, { useMemo } from "react";
import { UserState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";

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
  const top = useMemo(() => state.y, [state.y]);
  const left = useMemo(() => state.x, [state.x]);

  if (!user) return <></>;

  return (
    <div
      className="avatar"
      style={{ top, left }}
      onClick={() => setSelectedUserProfile(user)}
    >
      <span className="helper" />
      <img
        className="profile-image"
        src={user.pictureUrl}
        alt={user.partyName}
        title={user.partyName}
      />
    </div>
  );
};
