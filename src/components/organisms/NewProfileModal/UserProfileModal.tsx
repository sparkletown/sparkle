import { ProfileModalEditButtons } from "components/organisms/NewProfileModal/buttons/ProfileModalEditButtons/ProfileModalEditButtons";
import { ProfileModalChangePassword } from "components/organisms/NewProfileModal/ProfileModalChangePassword/ProfileModalChangePassword";
import { useBooleanState } from "hooks/useBooleanState";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { ProfileModalBasicInfo } from "./header/ProfileModalBasicInfo/ProfileModalBasicInfo";
import { ProfileModalQuestions } from "./ProfileModalQuestions/ProfileModalQuestions";
import { ProfileModalLinks } from "./links/ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "./ProfileModalBadges/ProfileModalBadges";
import { WithId } from "utils/id";
import { AnyVenue } from "types/venues";
import "./UserProfileModal.scss";
import "./ProfileModal.scss";
import { useUser } from "hooks/useUser";
import { ProfileModalEditLinks } from "./links/ProfileModalEditLinks/ProfileModalEditLinks";

interface Props {
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ venue, show, onClose }) => {
  const { userWithId: user } = useUser();
  const [editMode, turnOnEditMode, turnOffEditMode] = useBooleanState(true);

  return (
    <Modal
      style={{ display: "flex" }}
      className="ProfileModal UserProfileModal"
      show={show}
      onHide={onClose}
    >
      <Modal.Body className="ProfileModal__body">
        {user && (
          <>
            <ProfileModalBasicInfo
              editMode={editMode}
              onEdit={turnOnEditMode}
              viewingUser={user}
              containerClassName="ProfileModal__section"
            />
            <ProfileModalQuestions
              viewingUser={user}
              editMode={editMode}
              containerClassName="ProfileModal__section"
            />
            {editMode && user?.profileLinks ? (
              <ProfileModalEditLinks
                containerClassName="ProfileModal__section"
                links={user.profileLinks}
              />
            ) : (
              <ProfileModalLinks
                viewingUser={user}
                containerClassName="ProfileModal__section"
              />
            )}
            {!editMode && (
              <ProfileModalBadges
                viewingUser={user}
                venue={venue}
                containerClassName={"ProfileModal__section"}
              />
            )}
            {editMode && (
              <ProfileModalChangePassword containerClassName="ProfileModal__section" />
            )}
            {editMode && (
              <ProfileModalEditButtons
                onSaveClick={() => {}}
                onCancelClick={turnOffEditMode}
                saveChangesDisabled={false}
                containerClassName="UserProfileModal__edit-buttons"
              />
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
