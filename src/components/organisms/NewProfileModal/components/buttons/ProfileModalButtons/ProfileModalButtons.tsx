import React, { useMemo } from "react";

import { useIsOnline } from "hooks/useIsOnline";
import { useIsSameUser } from "hooks/useIsSameUser";

import { Button } from "components/atoms/Button";

import { profileModalWideButtonCustomStyle } from "types/profileModal";
import { profileModalWideButtonCustomStyleGrey } from "types/profileModal";
import { User } from "types/User";
import { WithId } from "utils/id";
import { ContainerClassName } from "types/utility";

import "./ProfileModalButtons.scss";

interface Props extends ContainerClassName {
  onClick: () => void;
  viewingUser: WithId<User>;
}

export const ProfileModalButtons: React.FC<Props> = ({
  containerClassName,
  onClick,
  viewingUser,
}: Props) => {
  const { isOnline } = useIsOnline(viewingUser.id);
  const sameUser = useIsSameUser(viewingUser);

  const sendMessageButtonStyle = useMemo(
    () =>
      sameUser
        ? profileModalWideButtonCustomStyleGrey
        : isOnline
        ? {
            ...profileModalWideButtonCustomStyle,
            backgroundColor: "#78B553",
          }
        : profileModalWideButtonCustomStyle,
    [isOnline, sameUser]
  );

  return (
    <>
      <div className={containerClassName}>
        <Button
          customClass={"ProfileModalButtons__button"}
          customStyle={sendMessageButtonStyle}
          onClick={onClick}
        >
          {sameUser ? "Log out" : "Send message"}
        </Button>
      </div>
    </>
  );
};
