import React, { useState } from "react";
import NavBar from "components/molecules/NavBar";
import { useSelector } from "react-redux";
import { profileQuestions } from "pages/Account/constants";
import "./EditProfilePage.scss";
import { QuestionType } from "types/Question";
import EditProfileModal from "components/organisms/EditProfileModal";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

const EditProfilePage = () => {
  const history = useHistory();
  const firebase = useFirebase();
  const { user, users } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));
  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    firebase.auth().signOut();
    history.push("/");
  };

  return user && users ? (
    <>
      <NavBar />
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
              onClick={() => setShowModal(true)}
              type="button"
            />
            <input
              className="btn button"
              value="Change password"
              type="button"
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
            {profileQuestions.map((question: QuestionType) => (
              <div className="question-section">
                <div className="question">{question.text}</div>
                <div className="answer">{users[user.uid][question.name]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EditProfileModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  ) : (
    <></>
  );
};

export default EditProfilePage;
