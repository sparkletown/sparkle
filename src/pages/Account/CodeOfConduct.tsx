import React, { useCallback, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { NotFound } from "components/shared/NotFound";

import {
  externalUrlAdditionalProps,
  generateAttendeeInsideUrl,
} from "utils/url";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";

import { updateUserProfile } from "./helpers";

// @debt refactor the questions related styles from Account.scss into CodeOfConduct.scss
import "./Account.scss";
import "./CodeOfConduct.scss";

export interface CodeOfConductFormData {
  contributeToExperience: string;
  cheerBand: string;
  greatNight: string;
  willingToImprovise: string;
  commonDecency: string;
  tenPrinciples: string;
  termsAndConditions: string;
  regionalBurn: string;
}

export const CodeOfConduct: React.FC = () => {
  const history = useHistory();

  const { user } = useUser();

  const {
    world,
    space,
    isLoaded,
    worldSlug,
    spaceSlug,
  } = useWorldAndSpaceByParams();

  const { register, handleSubmit, control, formState, watch } = useForm<
    CodeOfConductFormData & Record<string, boolean>
  >({
    mode: "onChange",
  });

  const { errors } = useFormState({ control });

  const proceed = useCallback(() => {
    // @debt Should we throw an error here rather than defaulting to empty string?
    const nextUrl = generateAttendeeInsideUrl({ worldSlug, spaceSlug });

    history.push(nextUrl);
  }, [history, worldSlug, spaceSlug]);

  useEffect(() => {
    if (!isLoaded) return;

    // Skip this screen if there are no code of conduct questions
    if (!world?.questions?.code?.length) {
      proceed();
    }
  }, [isLoaded, proceed, world?.questions?.code?.length]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: CodeOfConductFormData) => {
      if (!user) return;
      await updateUserProfile(user.uid, data);

      proceed();
    },
    [proceed, user]
  );

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

  const codeOfConductQuestions = world?.questions?.code ?? [];

  return (
    <div className="CodeOfConduct page-container">
      <div className="CodeOfConduct__form">
        <div>
          <h2 className="CodeOfConduct__title">
            Final step: agree to our terms
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            {codeOfConductQuestions.map((question) => (
              <div className="input-group" key={question.name}>
                <label
                  htmlFor={question.name}
                  className={`checkbox ${
                    watch(question.name) && "checkbox-checked"
                  }`}
                >
                  {question.name}:{" "}
                  {question.link && (
                    <a href={question.link} {...externalUrlAdditionalProps}>
                      {question.text}
                    </a>
                  )}
                  {!question.link && question.text}
                </label>

                <input
                  type="checkbox"
                  id={question.name}
                  {...register(question.name, {
                    required: true,
                  })}
                />
                {errors[question.name]?.type === "required" && (
                  <span className="input-error">Required</span>
                )}
              </div>
            ))}

            <div className="input-group">
              <ButtonNG
                variant="primary"
                type="submit"
                disabled={!formState.isValid || isUpdating}
              >
                Enter the event
              </ButtonNG>
              {isUpdating && <Loading />}
              {httpError && (
                <span className="input-error">{httpError.message}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
