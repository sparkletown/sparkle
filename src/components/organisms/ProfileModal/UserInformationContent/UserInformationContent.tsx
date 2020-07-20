import React from "react";
import { useSelector } from "react-redux";
import { PARTY_NAME } from "config";
import { QuestionType } from "types/Question";
import { User as FUser } from "firebase/app";
import { useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import { Venue } from "pages/VenuePage/VenuePage";
import { User } from "types/User";

interface PropsType {
  setIsEditMode: (value: boolean) => void;
  setIsPasswordEditMode: (value: boolean) => void;
}

const UserInformationContent: React.FunctionComponent<PropsType> = ({
  setIsEditMode,
  setIsPasswordEditMode,
}) => {
  const { user, venue, users, profileQuestions } = useSelector(
    (state: any) =>
      ({
        user: state.user,
        users: state.firestore.data.users,
        profileQuestions:
          state.firestore.data.config?.[PARTY_NAME].profile_questions,
        venue: state.firestore.ordered.currentVenue[0],
      } as {
        user: FUser;
        venue: Venue;
        users: { [uid: string]: User };
        profileQuestions: QuestionType[];
      })
  );

  const history = useHistory();
  const firebase = useFirebase();
  const logout = () => {
    firebase.auth().signOut();
    history.push(`/venue/${venue?.id}`);
  };

  return (
    <>
      <h1 className="title modal-title">My Profile</h1>
      <div className="user-information">
        <img
          className="profile-icon profile-modal-avatar"
          src={users[user.uid].pictureUrl}
          alt="profile avatar"
          width="50"
          height="50"
        />
        <div className="text-container">
          <h2 className="title ellipsis-text">{users[user.uid].partyName}</h2>
          <div className="ellipsis-text">{user.email}</div>
        </div>
      </div>
      {profileQuestions &&
        profileQuestions.map((question: QuestionType) => (
          <div className="question-section">
            <div className="question">{question.text}</div>
            <div className="answer">
              {
                // @ts-ignore question.name is a correct index for type User
                users[user.uid][question.name]
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
