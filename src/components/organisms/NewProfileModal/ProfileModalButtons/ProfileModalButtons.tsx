import { useUser } from "../../../../hooks/useUser";
import { User } from "../../../../types/User";
import { WithId } from "../../../../utils/id";
import { Button } from "../../../atoms/Button";
import "./ProfileModalButtons.scss";
import React from "react";

interface Props {
  openChat: () => void;
  chosenUser: WithId<User>;
  containerClassName?: string;
}

export const ProfileModalButtons: React.FC<Props> = ({
  containerClassName,
  openChat,
  chosenUser,
}: Props) => {
  const { userWithId: currentUser } = useUser();

  return (
    <>
      {currentUser?.id === chosenUser?.id && (
        <div className={containerClassName}>
          <Button customClass="ProfileModalButtons__button" onClick={openChat}>
            Send message
          </Button>
        </div>
      )}
    </>
  );
};
