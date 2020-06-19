import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./EditProfilePage.scss";
import { QuestionType } from "types/Question";
import EditProfileModal from "components/organisms/EditProfileModal";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import ChangePasswordModal from "components/organisms/ChangePasswordModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { PARTY_NAME } from "config";

const EditProfilePage = () => {
  const history = useHistory();
  const firebase = useFirebase();
  const { user, users, profileQuestions } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
    profileQuestions:
      state.firestore.data.config?.[PARTY_NAME].profile_questions,
  }));
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const logout = () => {
    firebase.auth().signOut();
    history.push("/");
  };

  return user && users ? (
    <WithNavigationBar>
      <div className="container edit-profile-page-container">
        <div className="row">
          <div className="col">
            <h1 className="title edit-profile-title">My Profile</h1>
            <div>
              <div className="profile-information">
                <img
                  className="profile-icon edit-profile-avatar"
                  src={users[user.uid].pictureUrl}
                  alt="profile avatar"
                  width="200"
                  height="200"
                />
                <div className="text-container">
                  <h2 className="title ellipsis-text">
                    {users[user.uid].partyName}
                  </h2>
                  <div className="ellipsis-text">{user.email}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <input
              className="btn button btn-primary"
              value="Edit profile"
              onClick={() => setShowEditProfileModal(true)}
              type="button"
            />
            <input
              className="btn button"
              value="Change password"
              type="button"
              onClick={() => setShowChangePasswordModal(true)}
            />
            <input
              className="btn button"
              value="Log out"
              onClick={logout}
              type="button"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            {profileQuestions &&
              profileQuestions.map((question: QuestionType) => (
                <div className="question-section">
                  <div className="question">{question.text}</div>
                  <div className="answer">{users[user.uid][question.name]}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {showEditProfileModal && (
        <EditProfileModal
          show={showEditProfileModal}
          onHide={() => setShowEditProfileModal(false)}
        />
      )}
      {showChangePasswordModal && (
        <ChangePasswordModal
          show={showChangePasswordModal}
          onHide={() => setShowChangePasswordModal(false)}
        />
      )}
    </WithNavigationBar>
  ) : (
    <></>
  );
};

export default EditProfilePage;
