import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isLoaded } from "react-redux-firebase";
import { useHistory, useLocation } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { QuestionType } from "types/Question";
import { Question } from "types/venues";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateUserProfile } from "pages/Account/helpers";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { ButtonRF } from "../ButtonRF";
import { DivRF } from "../DivRF";
import { LogoRF } from "../LogoRF";
import { PaneRF } from "../PaneRF";
import { SpanRF } from "../SpanRF";

import "./QuestionsRF.scss";

// @debt temporary data for development only, should be removed
const MOCK_QUESTIONS: Question[] = [
  // {
  //   name: "question-01",
  //   text: "text for question 1",
  // },
  // {
  //   name: "question-02",
  //   text: "text for question 2",
  //   link: "#",
  // },
];

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
}

export const QuestionsRF: React.FC = () => {
  const venueId = useVenueId();
  const { user } = useUser();
  const location = useLocation();
  const history = useHistory();
  const { sovereignVenue, isSovereignVenueLoading } = useSovereignVenue({
    venueId,
  });

  const questions = sovereignVenue?.profile_questions?.length
    ? sovereignVenue?.profile_questions
    : MOCK_QUESTIONS;

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const proceed = useCallback(
    () => history.push(`/account/code-of-conduct${location.search}`),
    [history, location.search]
  );

  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
  });

  useEffect(() => {
    if (!sovereignVenue) return;

    // Skip this screen if there are no profile questions for the venue
    if (!questions?.length) {
      proceed();
    }
  }, [proceed, sovereignVenue, questions]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: QuestionsFormData) => {
      if (!user) return;

      await updateUserProfile(user.uid, data);

      proceed();
    },
    [proceed, user]
  );

  if (!venueId) {
    console.error(QuestionsRF.name, "Error: Missing required venueId param");
    return <NotFound fullScreen />;
  }

  if (!venue && isLoaded(venue)) {
    console.error(
      QuestionsRF.name,
      "Error: Missing venue for venueId:",
      venueId
    );
    return <NotFound fullScreen />;
  }
  if (!venue || isSovereignVenueLoading) {
    return <LoadingPage />;
  }

  return (
    <PaneRF className="QuestionsRF">
      <LogoRF />
      <DivRF variant="title">Complete your profile</DivRF>
      <DivRF variant="subtitle">
        This will help fellow burners to know more about you.
      </DivRF>

      <form onSubmit={handleSubmit(onSubmit)}>
        {questions?.map((question: QuestionType) => (
          <DivRF key={question.name}>
            <label className="mod--flex-col">
              <strong>{question.name}</strong>
              <textarea
                name={question.name}
                placeholder={question.text}
                ref={register()}
              />
            </label>
          </DivRF>
        ))}

        <DivRF className="mod--flex-row">
          <ButtonRF variant="seethrough" onClick={proceed}>
            Skip
          </ButtonRF>
          <ButtonRF
            variant="primary"
            type="submit"
            disabled={!formState.isValid || isUpdating}
            loading={isUpdating}
          >
            Next
          </ButtonRF>
        </DivRF>
        <Loading displayWhile={isUpdating} />
        <SpanRF variant="error">{httpError?.message}</SpanRF>
      </form>
    </PaneRF>
  );
};
