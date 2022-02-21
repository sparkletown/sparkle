import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { ACCOUNT_CODE_QUESTIONS_URL } from "settings";

import { Question } from "types/Question";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useUser } from "hooks/useUser";

import { updateTheme } from "pages/VenuePage/helpers";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";
import { NotFound } from "components/atoms/NotFound";

import { updateUserProfile } from "./helpers";

// @debt refactor the questions related styles from Account.scss into Questions.scss
import "./ProfileQuestions.scss";

export interface QuestionsFormData {
  islandCompanion: string;
  gratefulFor: string;
  likeAboutParties: string;
  [key: string]: string;
}

export const ProfileQuestions: React.FC = () => {
  const history = useHistory();

  const { user } = useUser();

  const { worldSlug, spaceSlug } = useSpaceParams();
  const { world, space, isLoaded } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

  const { handleSubmit, formState, register } = useForm<QuestionsFormData>({
    mode: "onChange",
  });

  const proceed = useCallback(
    () =>
      history.push(
        generateUrl({
          route: ACCOUNT_CODE_QUESTIONS_URL,
          required: ["worldSlug"],
          params: { worldSlug, spaceSlug },
        })
      ),
    [history, worldSlug, spaceSlug]
  );

  useEffect(() => {
    if (!isLoaded) return;

    // Skip this screen if there are no profile questions for the world
    if (!world?.questions?.profile?.length) {
      proceed();
    }
  }, [isLoaded, proceed, world]);

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

  // @debt Maybe add something more pretty for UX here, in the vein of NotFound (with custom message)
  if (!spaceSlug) {
    return <>Error: Missing required spaceSlug param</>;
  }

  if (isLoaded && !space) {
    return <NotFound />;
  }

  if (!isLoaded) {
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
          {profileQuestions?.map((question: Question, i) => (
            <div
              key={question.name}
              className="ProfileQuestions__question form-group"
            >
              <label className="input-block input-centered">
                <strong>{question.text}</strong>
                <textarea
                  className="input-block input-centered"
                  placeholder={question.text}
                  {...register(question.name)}
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
