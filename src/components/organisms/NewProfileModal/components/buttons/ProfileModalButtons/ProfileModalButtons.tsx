import React from "react";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useIsOnline } from "hooks/useIsOnline";

import { Button } from "components/atoms/Button";

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
    <>
      <div className={containerClassName}>
        <Button
          customClass={classNames("ProfileModalButtons__button", {
            "ProfileModalButtons__button--online": !isCurrentUser && isOnline,
            "ProfileModalButtons__button--primary": !isCurrentUser && !isOnline,
          })}
          onClick={onClick}
        >
          {isCurrentUser ? "Log out" : "Send message"}
        </Button>
      </div>
    </>
  );
};
