import React from "react";
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
  const { userWithId, profile } = useUser();

  return (
    <Modal
      className="ProfileModal UserProfileModal"
      show={show}
      onHide={onClose}
    >
      <Modal.Body className="ProfileModal__body">
        {userWithId && profile && (
          <>
            <ProfileModalBasicInfo user={userWithId} />
            <ProfileModalQuestions
              profile={profile}
              containerClassName="ProfileModal__section"
            />
            <ProfileModalLinks
              user={userWithId}
              containerClassName="ProfileModal__section"
            />
            <ProfileModalBadges
              user={userWithId}
              venue={venue}
              containerClassName={"ProfileModal__section"}
            />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
