import { profileModalWideButtonCustomStyle } from "components/organisms/NewProfileModal/ProfileModal";
import { User } from "types/User";
import { WithId } from "utils/id";
import { Button } from "components/atoms/Button";
import "./ProfileModalSendMessageButton.scss";
import React, { useMemo } from "react";
import { ContainerClassName } from "types/utility";
import { useIsOnline } from "hooks/useIsOnline";

interface Props extends ContainerClassName {
  openChat: () => void;
  viewingUser: WithId<User>;
}

export const ProfileModalSendMessageButton: React.FC<Props> = ({
  containerClassName,
  openChat,
  viewingUser,
}: Props) => {
  const { isOnline } = useIsOnline(viewingUser.id);

  const sendMessageButtonStyle = useMemo(
    () =>
      isOnline
        ? {
            backgroundColor: "#78B553",
            ...profileModalWideButtonCustomStyle,
          }
        : profileModalWideButtonCustomStyle,
    [isOnline]
  );

  return (
    <>
      <div className={containerClassName}>
        <Button
          customClass={"ProfileModalSendMessageButton__button"}
          customStyle={sendMessageButtonStyle}
          onClick={openChat}
        >
          Send message
        </Button>
      </div>
    </>
  );
};
