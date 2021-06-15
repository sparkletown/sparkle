import React, { useCallback } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { IS_BURN } from "secrets";

import { QuestionType } from "types/Question";

import { UserStatusDropdown } from "components/atoms/UserStatusDropdown";
import { Button } from "components/atoms/Button";

import { UserAvatar } from "components/atoms/UserAvatar";
import { Badges } from "components/organisms/Badges";

import { updateUserProfile } from "pages/Account/helpers";

import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import { venueLandingUrl } from "utils/url";
import {
  currentVenueSelector,
  currentVenueSelectorData,
} from "utils/selectors";

import editIcon from "assets/icons/profile-edit-icon.svg";

// import { DEFAULT_PROFILE_VALUES } from "../constants";

import "./UserInformationContent.scss";

interface PropsType {
  setIsEditMode: (value: boolean) => void;
  setIsPasswordEditMode: (value: boolean) => void;
  hideModal: () => void;
}

// TODO: check DEFAULT_PROFILE_VALUES
// TODO: check UserInformationContent changes
const UserInformationContent: React.FunctionComponent<PropsType> = ({
  setIsEditMode,
  setIsPasswordEditMode,
  hideModal,
}) => {
  // temp
  const DEFAULT_PROFILE_VALUES = {
    partyName: "test partyName",
    questionAnswer: "test questionAnswer",
  };
  const { user, profile, userWithId } = useUser();
  const profileQuestions = useSelector(
    (state) => currentVenueSelectorData(state)?.profile_questions
  );
  const venueId = useVenueId();
  const venue = useSelector(currentVenueSelector);

  const history = useHistory();
  const firebase = useFirebase();

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    // we need to hide the modal because if we already are on the Entrance Page, history.push has no effect
    hideModal();
    history.push(IS_BURN ? "/enter" : venueId ? venueLandingUrl(venueId) : "/");
  }, [firebase, hideModal, history, venueId]);

  const toggleKidsMode = useCallback(async () => {
    if (user && profile) {
      profile.kidsMode = !profile?.kidsMode;
      await updateUserProfile(user.uid, { kidsMode: profile.kidsMode });
    }
  }, [profile, user]);

  const toggleAnonMode = useCallback(async () => {
    if (user && profile) {
      profile.anonMode = !profile?.anonMode;
      await updateUserProfile(user.uid, { anonMode: profile.anonMode });
    }
  }, [profile, user]);

  const toggleMirrorVideo = useCallback(async () => {
    if (user && profile) {
      profile.mirrorVideo = !profile?.mirrorVideo;
      await updateUserProfile(user.uid, { mirrorVideo: profile.mirrorVideo });
    }
  }, [profile, user]);

  if (!user || !userWithId) return null;

  return (
    <div className="UserInformationContent">
      <h1 className="UserInformationContent__title">My Profile</h1>

      <div className="UserInformationContent__information">
        <div>
          <UserAvatar user={userWithId} showStatus large />
        </div>
        <div className="UserInformationContent__text-container">
          <h3 className="UserInformationContent__user-name">
            {profile?.partyName || DEFAULT_PROFILE_VALUES.partyName}
          </h3>
          <div
            title={user.email ?? ""}
            className="UserInformationContent__ellipsis-text"
          >
            {user.email}
          </div>
          <div className="UserInformationContent__status-container">
            <span className="UserInformationContent__status-prefix">
              Available
            </span>
            <UserStatusDropdown />
          </div>
        </div>
        <Button
          customClass="UserInformationContent__edit"
          onClick={() => setIsEditMode(true)}
        >
          <img src={editIcon} alt="edit" />
        </Button>
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

      {IS_BURN && (
        <>
          <label
            htmlFor="chk-kidsMode"
            className={`checkbox ${profile?.kidsMode && "checkbox-checked"}`}
          >
            Kids Mode
          </label>
          <input
            type="checkbox"
            name="kidsMode"
            id="chk-kidsMode"
            defaultChecked={profile?.kidsMode || false}
            onClick={() => toggleKidsMode()}
          />
          <label
            htmlFor={"chk-anonMode"}
            className={`checkbox ${profile?.anonMode && "checkbox-checked"}`}
          >
            Anonymous Mode
          </label>
          <input
            type="checkbox"
            name={"anonMode"}
            id={"chk-anonMode"}
            defaultChecked={profile?.anonMode || false}
            onClick={() => toggleAnonMode()}
          />
        </>
      )}

      {venue?.showBadges && <Badges user={userWithId} currentVenue={venue} />}

      <label
        htmlFor="chk-mirrorVideo"
        className={`checkbox ${profile?.mirrorVideo && "checkbox-checked"}`}
      >
        Mirror my video
      </label>

      <input
        type="checkbox"
        name="mirrorVideo"
        id="chk-mirrorVideo"
        defaultChecked={profile?.mirrorVideo || false}
        onClick={() => toggleMirrorVideo()}
      />

      <Button
        customClass="UserInformationContent__button"
        onClick={() => setIsPasswordEditMode(true)}
      >
        Change password
      </Button>
      <Button customClass="UserInformationContent__button" onClick={logout}>
        Log out
      </Button>
    </div>
  );
};

export default UserInformationContent;
