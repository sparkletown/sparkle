import React from "react";
import { Modal } from "react-bootstrap";

import "./UserProfileModal.scss";
import Chatbox from "../Chatbox";
import { useSelector } from "react-redux";
import { User } from "types/User";

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
  const { user, usersordered, venue } = useSelector((state: any) => ({
    user: state.user,
    usersordered: state.firestore.ordered.users,
    venue: state.firestore.data.currentVenue,
  }));

  if (!userProfile) {
    return <></>;
  }

  // @TODO: Need to figure out why it's sometimes not set
  // state.firestore.data.users vs state.firestore.ordered.users
  let fullUserProfile;
  if (!userProfile.id) {
    fullUserProfile = {
      ...userProfile,
      id: usersordered.find(
        (u: User) => u.pictureUrl === userProfile.pictureUrl
      )?.id,
    };
  } else {
    fullUserProfile = userProfile;
  }

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
              {venue.profile_questions?.map((question: any) => (
                <>
                  <p className="light question">{question.text}</p>
                  <h6>
                    {(userProfile as any)?.[question.name] ||
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
          {fullUserProfile.id !== user.uid && (
            <div className="private-chat-container">
              <Chatbox isInProfileModal discussionPartner={fullUserProfile} />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserProfileModal;
