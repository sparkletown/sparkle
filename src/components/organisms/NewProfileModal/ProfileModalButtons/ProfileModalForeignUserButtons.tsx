import { User } from "../../../../types/User";
import { WithId } from "../../../../utils/id";
import { Button } from "../../../atoms/Button";
import "./ProfileModalForeignUserButtons.scss";
import React, { useMemo } from "react";
import { ContainerClassName } from "../../../../types/utility";
import { useIsOnline } from "../../../../hooks/useIsOnline";
import { useSameUser } from "../../../../hooks/useIsSameUser";

interface Props extends ContainerClassName {
  openChat: () => void;
  viewingUser: WithId<User>;
}

export const ProfileModalForeignUserButtons: React.FC<Props> = ({
  containerClassName,
  openChat,
  viewingUser,
}: Props) => {
  const { isOnline } = useIsOnline(viewingUser.id);
  const sameUser = useSameUser(viewingUser);

  const sendMessageButtonStyle = useMemo(
    () => (isOnline ? { backgroundColor: "#78B553" } : {}),
    [isOnline]
  );

  return (
    <>
      {!sameUser && (
        <div className={containerClassName}>
          <Button
            customClass={"ProfileModalButtons__button"}
            customStyle={sendMessageButtonStyle}
            onClick={openChat}
          >
            Send message
          </Button>
        </div>
      )}
    </>
  );
};
