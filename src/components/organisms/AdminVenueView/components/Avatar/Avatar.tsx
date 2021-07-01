import React from "react";
import classNames from "classnames";

import { User, UserStatus } from "types/User";

import { WithId } from "utils/id";

import "./Avatar.scss";

interface AvatarProps {
  user: WithId<User>;
  size?: 16 | 24 | 32 | 64;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = "24" }) => {
  const status = user?.status;
  const anonFree = !user?.anonMode;
  const cn = classNames({
    Avatar: true,
    "Avatar--available": anonFree && status === UserStatus.available,
    "Avatar--busy": anonFree && status === UserStatus.busy,
    "Avatar--unknown-status": anonFree && status,
    "Avatar--no-status": anonFree && !status,
    [`Avatar--${size}`]: size,
  });

  return (
    <div className={cn}>
      <img className="Avatar__image" src={user?.pictureUrl} alt="profile" />
      <div className="Avatar__dot">&nbsp;</div>
    </div>
  );
};
