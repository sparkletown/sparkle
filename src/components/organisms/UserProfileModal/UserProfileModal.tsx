import React from "react";
import { Modal } from "react-bootstrap";

import "./UserProfileModal.scss";
import Chatbox from "../Chatbox";

export interface User {
  id: string;
  gratefulFor?: string;
  islandCompanion?: string;
  likeAboutParties?: string;
  partyName?: string;
  pictureUrl?: string;
}

interface PropTypes {
  userProfile?: User;
  show: boolean;
  onHide: () => void;
}

const UserProfileModal: React.FunctionComponent<PropTypes> = ({
  show,
  onHide,
  userProfile,
}) => {
  if (!userProfile) {
    return <></>;
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body>
        <div className="modal-container modal-container_profile">
          <div className="profile-information-container">
            <div className="profile-basics">
              <div className="profile-pic">
                <img
                  src={userProfile.pictureUrl || "/default-profile-pic.png"}
                  alt="profile"
                />
              </div>
              <div className="profile-text">
                <h2 className="italic">
                  {userProfile.partyName || "Captain Party"}
                </h2>
              </div>
            </div>
            <div className="profile-extras">
              <p className="light question">Dream desert island companion:</p>
              <h6>{userProfile.islandCompanion || "Hermann Melville"}</h6>
              <p className="light question">Grateful for:</p>
              <h6>{userProfile.gratefulFor || "My consciousness"}</h6>
              <p className="light question">I like parties because of:</p>
              <h6>
                {userProfile.likeAboutParties || "Because they're joyful"}
              </h6>
            </div>
          </div>
          <div className="private-chat-container">
            <Chatbox discussionPartner={userProfile} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserProfileModal;
