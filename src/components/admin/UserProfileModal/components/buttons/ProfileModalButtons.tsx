import React from "react";
import { Button } from "components/admin/Button";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";

export interface ProfileModalButtonsProps {
  onClick: () => void;
  onEdit?: () => void;
  onModalClose: () => void;
  user: WithId<User>;
}

export const ProfileModalButtons: React.FC<ProfileModalButtonsProps> = ({
  onClick,
  onEdit,
  onModalClose,
  user,
}) => {
  const isCurrentUser = useIsCurrentUser(user.id);

  return (
    <>
      {isCurrentUser && <Button onClick={onEdit}>Edit profile</Button>}

      {!isCurrentUser && <Button onClick={onClick}>Send message</Button>}

      <Button onClick={onModalClose} variant="secondary">
        Cancel
      </Button>

      {isCurrentUser && (
        <Button onClick={onClick} variant="danger" className="mr-auto">
          Log out
        </Button>
      )}
    </>
  );
};
