import React, { useCallback, useEffect } from "react";
import { isLoaded } from "react-redux-firebase";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import { QuestionType } from "types/Question";

import { currentVenueSelectorData } from "utils/selectors";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { updateUserProfile } from "./helpers";

// @debt refactor the questions related styles from Account.scss into Questions.scss
import "./Account.scss";

import "./Questions.scss";

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
}

export const Questions: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const { user, userWithId } = useUser();

  const venueId = useVenueId();

  // @debt this should probably be retrieving the sovereign venue
  // @debt replace this with useConnectCurrentVenueNG or similar?
  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelectorData);

  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
    // @ts-ignore @debt Figure a way to type this properly
    defaultValues: {
      ...userWithId,
    },
  });

  const proceed = useCallback(() => {
    history.push(`/account/code-of-conduct${location.search}`);
  }, [history, location.search]);

  useEffect(() => {
    if (!venue) return;

    // Skip this screen if there are no profile questions for the venue
    if (!venue?.profile_questions.length) {
      proceed();
    }
  }, [proceed, venue]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: QuestionsFormData) => {
      if (!user) return;

      await updateUserProfile(user.uid, data);

      proceed();
    },
    [proceed, user]
  );

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

  if (!venueId) {
    return <>Error: Missing required venueId param</>;
  }

  if (isLoaded(venue) && !venue) {
    return <>Error: venue not found for venueId={venueId}</>;
  }

  if (!venue) {
    return <LoadingPage />;
  }

  const headerMessage =
    "To help other Hubbers find and get to know you, tell us a little about yourself.";
  const REQUIRED_QUESTIONS_NUMBER = 1;

  return (
    <div className="Questions page-container questions-container">
      <div className="hero-logo github" />
      <div className="login-container">
        <h2 className="header-message">{headerMessage}</h2>

        <p className="subheader-message">
          This will help your fellow partygoers break the ice
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {venue.profile_questions.map((question: QuestionType, index) => (
            <div key={question.name} className="Questions__question form-group">
              <label className="input-block input-centered">
                <p>
                  {question.name}
                  {index < REQUIRED_QUESTIONS_NUMBER && "*"}
                </p>
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  placeholder={question.text}
                  ref={register()}
                />
              </label>
            </div>
          ))}

          <div className="input-group">
            <button
              type="submit"
              className="btn btn-primary btn-block btn-centered"
              disabled={!formState.isValid || isUpdating}
            >
              Save answers and continue
            </button>
            {isUpdating && <Loading />}
            {httpError && (
              <span className="input-error">{httpError.message}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
