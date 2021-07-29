import React from "react";
import Modal from "react-bootstrap/Modal";
import { ProfileModalContentBasicInfo } from "./ProfileModalBasicInfo/ProfileModalContentBasicInfo";
import { ProfileModalQuestions } from "./ProfileModalQuestions/ProfileModalQuestions";
import { ProfileModalLinks } from "./ProfileModalLinks/ProfileModalLinks";
import { ProfileModalBadges } from "./ProfileModalBadges/ProfileModalBadges";
import { WithId } from "../../../utils/id";
import { AnyVenue } from "../../../types/venues";

import "./ProfileModal.scss";
import "./UserProfileModal.scss";

interface Props {
  venue: WithId<AnyVenue>;
  show: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ venue, show, onClose }) => {
  return (
    <Modal
      className="ProfileModal UserProfileModal"
      show={show}
      onHide={onClose}
    >
      <Modal.Body className="ProfileModal__body">
        <ProfileModalContentBasicInfo />
        <ProfileModalQuestions containerClassName="ProfileModal__section" />
        <ProfileModalLinks containerClassName="ProfileModal__section" />
        <ProfileModalBadges
          venue={venue}
          containerClassName={"ProfileModal__section"}
        />
      </Modal.Body>
    </Modal>
  );
};
