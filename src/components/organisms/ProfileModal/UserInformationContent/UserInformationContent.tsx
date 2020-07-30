import React from "react";
import { QuestionType } from "types/Question";
import { useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import { Venue } from "types/Venue";
import { DEFAULT_PROFILE_VALUES } from "../constants";
import { useUser } from "hooks/useUser";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  setIsEditMode: (value: boolean) => void;
  setIsPasswordEditMode: (value: boolean) => void;
  hideModal: () => void;
}

const UserInformationContent: React.FunctionComponent<PropsType> = ({
  setIsEditMode,
  setIsPasswordEditMode,
  hideModal,
}) => {
  const { user, profile } = useUser();
  const { venue, profileQuestions } = useSelector(
    (state) =>
      ({
        profileQuestions: state.firestore.data.currentVenue.profile_questions,
        venue: state.firestore.ordered.currentVenue[0],
      } as {
        venue: Venue;
        profileQuestions: QuestionType[];
      })
  );

  const history = useHistory();
  const firebase = useFirebase();
  const logout = () => {
    firebase.auth().signOut();
    // we need to hide the modal because if we already are on the Entrance Page, history.push has no effect
    hideModal();
    history.push(`/v/${venue?.id}`);
  };

  if (!user) return <></>;

  return (
    <>
      <h1 className="title modal-title">My Profile</h1>
      <div className="user-information">
        <img
          className="profile-icon profile-modal-avatar"
          src={profile?.pictureUrl || DEFAULT_PROFILE_IMAGE}
          alt="profile avatar"
          width="50"
          height="50"
        />
        <div className="text-container">
          <h2 className="title ellipsis-text">
            {profile?.partyName || DEFAULT_PROFILE_VALUES.partyName}
          </h2>
          <div className="ellipsis-text">{user.email}</div>
        </div>
      </div>
      {profileQuestions &&
        profileQuestions.map((question: QuestionType) => (
          <div key={question.name} className="question-section">
            <div className="question">{question.text}</div>
            <div className="answer">
              {
                // @ts-ignore question.name is a correct index for type User
                (profile && profile[question.name]) ||
                  DEFAULT_PROFILE_VALUES.questionAnswer
              }
            </div>
          </div>
        ))}

      <input
        className="btn button btn-primary"
        value="Edit profile"
        onClick={() => setIsEditMode(true)}
        type="button"
      />
      <input
        className="btn button"
        value="Change password"
        type="button"
        onClick={() => setIsPasswordEditMode(true)}
      />
      <input
        className="btn button"
        value="Log out"
        onClick={logout}
        type="button"
      />
    </>
  );
};

export default UserInformationContent;
