import React, { useMemo } from "react";
import { UserState } from "types/RelayMessage";
import { User } from "types/User";
import { WithId } from "utils/id";
import { toPixels } from "utils/units";

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
  const top = useMemo(() => toPixels(state.y, zoom, scale), [
    state.y,
    scale,
    zoom,
  ]);
  const left = useMemo(() => toPixels(state.x, zoom, scale), [
    state.x,
    scale,
    zoom,
  ]);

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
