import React from "react";

import { User } from "types/User";

import { WithId } from "utils/id";

import { UserAvatar } from "components/atoms/UserAvatar";

import styles from "./OnlineUser.module.scss";

export interface OnlineUserProps {
  user: WithId<User>;
  onClick?: () => void;
}

export const OnlineUser: React.FC<OnlineUserProps> = ({ user, onClick }) => {
  return (
    <div className={styles.onlineUserContainer} onClick={onClick}>
      <UserAvatar containerClassName={styles.avatarContainer} user={user} />
      <div>{user.partyName}</div>
    </div>
  );
};
