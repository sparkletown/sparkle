import React from "react";
import { Modal } from "react-bootstrap";

import "./UserProfileModal.scss";
import Chatbox from "../Chatbox";
import { User } from "types/User";
import { useSelector } from "hooks/useSelector";

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
  const { venue } = useSelector((state) => ({
    usersordered: state.firestore.ordered.users,
    venue: state.firestore.data.currentVenue,
  }));

  if (!userProfile) {
    return <></>;
  }

  // @TODO: Need to figure out why it's sometimes not set
  // state.firestore.data.users vs state.firestore.ordered.users
  // const fullUserProfile = !userProfile.id
  //   ? {
  //       ...userProfile,
  //       id: usersordered.find((u) => u.pictureUrl === userProfile.pictureUrl)
  //         ?.id,
  //     }
  //   : userProfile;

  // REVISIT: remove the hack to cast to any below
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
              {venue.profile_questions?.map((question) => (
                <>
                  <p className="light question">{question.text}</p>
                  <h6>
                    {userProfile.data[question.name] || //@debt typing - look at the changelog, was this a bug?
                      "I haven't edited my profile to tell you yet"}
                  </h6>
                </>
              ))}
            </div>
            {userProfile.room && (
              <div className="profile-location">
                <p className="question">Suspected Location:</p>
                <h6 className="location">{userProfile.room}</h6>
              </div>
            )}
          </div>
          <div className="private-chat-container">
            <Chatbox isInProfileModal discussionPartner={userProfile} />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserProfileModal;
