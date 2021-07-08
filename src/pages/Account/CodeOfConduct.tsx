import React, { useCallback, useEffect } from "react";
import { isLoaded } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAsyncFn, useSearchParam } from "react-use";

import { IS_BURN } from "secrets";

import { currentVenueSelectorData } from "utils/selectors";
import { externalUrlAdditionalProps, venueInsideUrl } from "utils/url";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

import { LoadingPage } from "components/molecules/LoadingPage";
import { Loading } from "components/molecules/Loading";

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

export interface CodeOfConductQuestion {
  name: keyof CodeOfConductFormData;
  text: string;
  link?: string;
}

/**
 * @debt remove this along with Playa cleanup
 * @deprecated
 */
const BURN_CODE_OF_CONDUCT_QUESTIONS: CodeOfConductQuestion[] = [
  {
    name: "commonDecency",
    text:
      "I will endeavor not to create indecent experiences or content, and understand my actions may be subject to review and possible disciplinary action",
  },
  {
    name: "tenPrinciples",
    text:
      "I agree to abide by the Ten Principles of Burning Man at the online burn",
    link: "https://burningman.org/culture/philosophical-center/10-principles/",
  },
  {
    name: "termsAndConditions",
    text: "I agree to SparkleVerse's Terms and Conditions",
    link: "https://sparklever.se/terms-and-conditions",
  },
];

export const CodeOfConduct: React.FC = () => {
  const history = useHistory();
  const returnUrl = useSearchParam("returnUrl") ?? undefined;

  const { user, userWithId } = useUser();

  const venueId = useVenueId();

  // @debt this should probably be retrieving the sovereign venue
  // @debt replace this with useConnectCurrentVenueNG or similar?
  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelectorData);

  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
  } = useForm<CodeOfConductFormData>({
    mode: "onChange",
    // @ts-ignore @debt Figure a way to type this properly
    defaultValues: {
      ...userWithId,
    },
  });

  const proceed = useCallback(() => {
    // @debt Should we throw an error here rather than defaulting to empty string?
    const nextUrl = venueId ? venueInsideUrl(venueId) : returnUrl ?? "";

    history.push(nextUrl);
  }, [history, returnUrl, venueId]);

  useEffect(() => {
    if (!venue) return;

    // Skip this screen if there are no code of conduct questions for the venue
    if (!venue?.code_of_conduct_questions.length) {
      proceed();
    }
  }, [proceed, venue]);

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

  if (!venue) {
    return <LoadingPage />;
  }

  const codeOfConductQuestions = IS_BURN
    ? BURN_CODE_OF_CONDUCT_QUESTIONS
    : venue.code_of_conduct_questions;

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
                {/* @debt we should probably be rendering the question.name here as a label */}
                {/*<strong>{question.name}</strong>*/}
                <label
                  htmlFor={question.name}
                  className={`checkbox ${
                    watch(question.name) && "checkbox-checked"
                  }`}
                >
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
                {
                  /* @ts-ignore @debt questions should be typed if possible */
                  errors[question.name]?.type === "required" && (
                    <span className="input-error">Required</span>
                  )
                }
              </div>
            ))}

            <div className="input-group">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-centered"
                disabled={!formState.isValid || isUpdating}
              >
                Enter the event
              </button>
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
