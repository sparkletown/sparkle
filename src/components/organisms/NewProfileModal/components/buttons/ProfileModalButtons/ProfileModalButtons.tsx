import React from "react";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useIsOnline } from "hooks/useIsOnline";

import { ButtonNG } from "../../../../../atoms/ButtonNG";

import "./ProfileModalButtons.scss";

export interface ProfileModalButtonsProps extends ContainerClassName {
  onClick: () => void;
  user: WithId<User>;
}

export const ProfileModalButtons: React.FC<ProfileModalButtonsProps> = ({
  containerClassName,
  onClick,
  user,
}) => {
  const { isOnline } = useIsOnline(user.id);
  const isCurrentUser = useIsCurrentUser(user);

  return (
    <ButtonNG
      variant={!isCurrentUser && !isOnline ? "primary" : "secondary"}
      className={classNames("ProfileModalButtons", containerClassName, {
        "ProfileModalButtons--online": !isCurrentUser && isOnline,
      })}
      onClick={onClick}
    >
      {isCurrentUser ? "Log out" : "Send message"}
    </ButtonNG>
  );
};
