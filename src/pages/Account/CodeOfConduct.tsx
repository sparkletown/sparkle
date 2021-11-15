import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isLoaded } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useAsyncFn, useSearchParam } from "react-use";

import { externalUrlAdditionalProps, venueInsideUrl } from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

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
  const returnUrl = useSearchParam("returnUrl") ?? undefined;

  const { user } = useUser();

  const venueId = useVenueId();

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const { world, isLoaded: isWorldLoaded } = useCurrentWorld({
    worldId: venue?.worldId,
  });

  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData & Record<string, boolean>
  >({
    mode: "onChange",
  });

  const proceed = useCallback(() => {
    // @debt Should we throw an error here rather than defaulting to empty string?
    const nextUrl = venueId ? venueInsideUrl(venueId) : returnUrl ?? "";

    history.push(nextUrl);
  }, [history, returnUrl, venueId]);

  useEffect(() => {
    if (!isWorldLoaded) return;

    // Skip this screen if there are no code of conduct questions for the venue
    if (!world?.questions?.code?.length) {
      proceed();
    }
  }, [isWorldLoaded, proceed, venue, world?.questions?.code?.length]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data: CodeOfConductFormData) => {
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

  if (!venue || !isWorldLoaded) {
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
