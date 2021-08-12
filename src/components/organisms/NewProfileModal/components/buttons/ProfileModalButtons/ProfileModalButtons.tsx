import React, { useMemo } from "react";

import {
  profileModalWideButtonCustomStyle,
  profileModalWideButtonCustomStyleGrey,
} from "types/profileModal";
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

  const sendMessageButtonStyle = useMemo(
    () =>
      isCurrentUser
        ? profileModalWideButtonCustomStyleGrey
        : isOnline
        ? {
            ...profileModalWideButtonCustomStyle,
            backgroundColor: "#78B553",
          }
        : profileModalWideButtonCustomStyle,
    [isOnline, isCurrentUser]
  );

  return (
    <>
      <div className={containerClassName}>
        <Button
          customClass={"ProfileModalButtons__button"}
          customStyle={sendMessageButtonStyle}
          onClick={onClick}
        >
          {isCurrentUser ? "Log out" : "Send message"}
        </Button>
      </div>
    </>
  );
};
