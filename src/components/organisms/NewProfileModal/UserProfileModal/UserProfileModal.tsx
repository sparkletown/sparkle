import { ProfileModalContent } from "components/organisms/NewProfileModal/ProfileModal/ProfileModalContent";
import { UserProfileModalContent } from "components/organisms/NewProfileModal/UserProfileModal/UserProfileModalContent";
import { useBooleanState } from "hooks/useBooleanState";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { User } from "types/User";
import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";
import "./UserProfileModal.scss";

interface Props {
  user: WithId<User>;
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({
  venue,
  show,
  user,
  onClose,
}: Props) => {
  const [editMode, turnOnEditMode, turnOffEditMode] = useBooleanState(false);

  return (
    <Modal
      style={{ display: "flex" }}
      className="UserProfileModal"
      show={show}
      onHide={onClose}
    >
      <Modal.Body className="UserProfileModal__body">
        {editMode ? (
          <UserProfileModalContent
            user={user}
            venue={venue}
            onCancelEditing={turnOffEditMode}
          />
        ) : (
          <ProfileModalContent
            viewingUser={user}
            venue={venue}
            onEditMode={turnOnEditMode}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};
