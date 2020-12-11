import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import React, { useCallback } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { IS_BURN } from "secrets";
import { QuestionType } from "types/Question";
import { Badges } from "components/organisms/Badges";
import { DEFAULT_PROFILE_VALUES } from "../constants";
import { updateUserProfile } from "pages/Account/helpers";
import { useVenueId } from "hooks/useVenueId";
import { venueLandingUrl } from "utils/url";
import {
  currentVenueSelector,
  currentVenueSelectorData,
} from "utils/selectors";

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
