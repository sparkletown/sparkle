import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn, useSearchParam } from "react-use";

import { externalUrlAdditionalProps, venueInsideUrl } from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";

import { updateTheme } from "pages/VenuePage/helpers";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";
import { NotFound } from "components/atoms/NotFound";

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
  const returnUrl = useSearchParam("returnUrl") ?? undefined;

  const { user } = useUser();

  const { spaceSlug } = useSpaceParams();
  const { space, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);

  const { world, isLoaded: isWorldLoaded } = useCurrentWorld({
    worldId: space?.worldId,
  });

  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData & Record<string, boolean>
  >({
    mode: "onChange",
  });

  const proceed = useCallback(() => {
    // @debt Should we throw an error here rather than defaulting to empty string?
    const nextUrl = spaceSlug ? venueInsideUrl(spaceSlug) : returnUrl ?? "";

    history.push(nextUrl);
  }, [history, returnUrl, spaceSlug]);

  useEffect(() => {
    if (!isWorldLoaded) return;

    // Skip this screen if there are no code of conduct questions
    if (!world?.questions?.code?.length) {
      proceed();
    }
  }, [isWorldLoaded, proceed, world?.questions?.code?.length]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: CodeOfConductFormData) => {
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

  if (isSpaceLoaded && !space) {
    return <NotFound />;
  }

  if (!space || !isWorldLoaded) {
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
                  name={question.name}
                  id={question.name}
                  ref={register({
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
