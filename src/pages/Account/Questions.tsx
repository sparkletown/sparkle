import React, { useEffect } from "react";
import { isLoaded } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { QuestionType } from "types/Question";
import { RouterLocation } from "types/RouterLocation";

import { currentVenueSelectorData } from "utils/selectors";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

import { LoadingPage } from "components/molecules/LoadingPage";

import { updateUserProfile } from "./helpers";

import "./Account.scss";

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
}

export interface QuestionsProps {
  location: RouterLocation;
}

const Questions: React.FC<QuestionsProps> = ({ location }) => {
  const venueId = useVenueId();

  // @debt replace this with useConnectCurrentVenueNG or similar?
  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelectorData);

  const history = useHistory();
  const { user } = useUser();

  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
  });

  const proceed = () => {
    history.push(`/account/code-of-conduct${location.search}`);
  };

  const onSubmit = async (data: QuestionsFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    proceed();
  };

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

  // Skip this screen if there are no profile questions for the venue
  if (!venue?.profile_questions?.length) {
    proceed();
  }

  const numberOfQuestions = venue.profile_questions.length;
  const oneQuestionOnly = numberOfQuestions === 1;
  const headerMessage = oneQuestionOnly
    ? "Now complete your profile by answering this question"
    : "Now complete your profile by answering some short questions";

  return (
    <div className="page-container">
      <div className="hero-logo sparkle" />
      <div className="login-container">
        <h2 className="header-message">{headerMessage}</h2>

        <p className="subheader-message">
          This will help your fellow partygoers break the ice
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {venue.profile_questions &&
            venue.profile_questions.map((question: QuestionType) => (
              <div key={question.name} className="input-group">
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  placeholder={question.text}
                  ref={register()}
                />
              </div>
            ))}

          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Create profile"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default Questions;
