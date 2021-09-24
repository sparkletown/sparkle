import React from "react";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

import { ButtonNG } from "components/atoms/ButtonNG";

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
  const isCurrentUser = useIsCurrentUser(user.id);

  return (
    <ButtonNG
      // @debt temporarily disable is online functionality
      variant={!isCurrentUser ? "primary" : "secondary"}
      className={classNames("ProfileModalButtons", containerClassName, {
        // @debt temporarily disable is online functionality
        // "ProfileModalButtons--online": !isCurrentUser && isOnline,
      })}
      onClick={onClick}
    >
      {isCurrentUser ? "Log out" : "Send message"}
    </ButtonNG>
  );
};
