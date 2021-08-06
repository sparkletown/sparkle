import {
  profileModalWideButtonCustomStyle,
  profileModalWideButtonCustomStyleGrey,
} from "components/organisms/NewProfileModal/utilities";
import { useSameUser } from "hooks/useIsSameUser";
import { User } from "types/User";
import { WithId } from "utils/id";
import { Button } from "components/atoms/Button";
import "./ProfileModalButtons.scss";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import { useIsOnline } from "hooks/useIsOnline";

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
  const sameUser = useSameUser(viewingUser);

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
