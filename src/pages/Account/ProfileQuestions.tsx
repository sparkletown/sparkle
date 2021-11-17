import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isLoaded } from "react-redux-firebase";
import { useHistory, useLocation } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { ACCOUNT_CODE_QUESTIONS_URL } from "settings";

import { Question } from "types/Question";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";
import { useSpaceParams } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";

import { updateUserProfile } from "./helpers";

// @debt refactor the questions related styles from Account.scss into Questions.scss
import "./ProfileQuestions.scss";

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
}

export const ProfileQuestions: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const { user } = useUser();

  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);

  const { world, isLoaded: isWorldLoaded } = useCurrentWorld({
    worldId: space?.worldId,
  });

  const { register, handleSubmit, formState } = useForm<QuestionsFormData>({
    mode: "onChange",
  });

  const proceed = useCallback(() => {
    history.push(`${ACCOUNT_CODE_QUESTIONS_URL}${location.search}`);
  }, [history, location.search]);

  useEffect(() => {
    if (!isWorldLoaded) return;

    // Skip this screen if there are no profile questions for the world
    if (!world?.questions?.profile?.length) {
      proceed();
    }
  }, [isWorldLoaded, proceed, world]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: QuestionsFormData) => {
      if (!user) return;

      await updateUserProfile(user.uid, data);

      proceed();
    },
    [proceed, user]
  );

  useEffect(() => {
    if (!space) return;

    // @debt replace this with useCss?
    updateTheme(space);
  }, [space]);

  if (!spaceSlug) {
    return <>Error: Missing required spaceSlug param</>;
  }

  if (isLoaded(space) && !space) {
    return <>Error: venue not found for spaceSlug={spaceSlug}</>;
  }

  if (!space || !isWorldLoaded) {
    return <LoadingPage />;
  }

  const profileQuestions = world?.questions?.profile;
  const numberOfQuestions = profileQuestions?.length ?? 0;
  const headerMessage = `Now complete your profile by answering ${
    numberOfQuestions === 1 ? "this question" : "some short questions"
  }`;

  return (
    <div className="ProfileQuestions">
      <div className="hero-logo sparkle" />
      <div className="ProfileQuestions__container">
        <h2 className="header-message">{headerMessage}</h2>

        <p className="subheader-message">
          This will help your fellow partygoers break the ice
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {profileQuestions?.map((question: Question) => (
            <div
              key={question.name}
              className="ProfileQuestions__question form-group"
            >
              <label className="input-block input-centered">
                <strong>{question.text}</strong>
                <textarea
                  className="input-block input-centered"
                  name={question.name}
                  placeholder={question.text}
                  ref={register()}
                />
              </label>
            </div>
          ))}

          <div>
            <ButtonNG
              variant="primary"
              type="submit"
              disabled={!formState.isValid || isUpdating}
            >
              Save answers and continue
            </ButtonNG>
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
