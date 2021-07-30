import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ProfileModalBasicInfo } from "./display/ProfileModalBasicInfo/ProfileModalBasicInfo";
import { ProfileModalQuestions } from "./display/ProfileModalQuestions/ProfileModalQuestions";
import { ProfileModalLinks } from "./display/ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "./display/ProfileModalBadges/ProfileModalBadges";
import { WithId } from "../../../utils/id";
import { AnyVenue } from "../../../types/venues";

import "./ProfileModal.scss";
import "./UserProfileModal.scss";
import { useUser } from "../../../hooks/useUser";

interface Props {
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ venue, show, onClose }) => {
  const { userWithId: user } = useUser();
  const [editMode, setEditMode] = useState(false);

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
              onEdit={() => setEditMode(true)}
              viewingUser={user}
              containerClassName="ProfileModal__section"
            />
            <ProfileModalQuestions
              viewingUser={user}
              editMode={editMode}
              containerClassName="ProfileModal__section"
            />
            <ProfileModalLinks
              viewingUser={user}
              containerClassName="ProfileModal__section"
            />
            <ProfileModalBadges
              viewingUser={user}
              venue={venue}
              containerClassName={"ProfileModal__section"}
            />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
