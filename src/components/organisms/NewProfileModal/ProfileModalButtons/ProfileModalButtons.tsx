import { useUser } from "../../../../hooks/useUser";
import { User } from "../../../../types/User";
import { WithId } from "../../../../utils/id";
import { Button } from "../../../atoms/Button";
import "./ProfileModalButtons.scss";
import React, { useMemo } from "react";
import { ContainerClassName } from "../../../../types/utility";
import { useIsOnline } from "../../../../hooks/useIsOnline";

interface Props extends ContainerClassName {
  openChat: () => void;
  chosenUser: WithId<User>;
}

export const ProfileModalButtons: React.FC<Props> = ({
  containerClassName,
  openChat,
  chosenUser,
}: Props) => {
  const { userWithId: currentUser } = useUser();

  const isOnline = useIsOnline(chosenUser.id);

  const sendMessageButtonStyle = useMemo(
    () => (isOnline ? { backgroundColor: "#78B553" } : {}),
    [isOnline]
  );

  return (
    <>
      {currentUser?.id !== chosenUser?.id && (
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
