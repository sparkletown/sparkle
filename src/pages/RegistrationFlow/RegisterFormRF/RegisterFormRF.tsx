import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { getYear } from "date-fns";
import firebase from "firebase/app";
import { pick } from "lodash";

import { SPARKLE_TERMS_AND_CONDITIONS_URL } from "settings";

import { checkIsCodeValid, checkIsEmailWhitelisted } from "api/auth";

import { VenueAccessMode } from "types/VenueAcccess";

import { venueSelector } from "utils/selectors";
import { isDefined } from "utils/types";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { updateUserPrivate } from "pages/Account/helpers";
import {
  validateDateOfBirth,
  validateDateOfBirthInfo,
} from "pages/RegistrationFlow/utils-rf";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { ButtonRF } from "../ButtonRF";
import { CheckboxWrapRF } from "../CheckboxWrapRF";
import { ConfirmationModalRF } from "../ConfirmationModalRF";
import { DivRF } from "../DivRF";
import { InputWrapRF } from "../InputWrapRF";
import { SpanRF } from "../SpanRF";

import "./RegisterFormRF.scss";

// @debt temporary switches for development only, should be removed
const ALWAYS_REQUIRE_CODES = false;
const ALWAYS_REQUIRE_BIRTH = false;
const USE_CALENDAR_CONTROL = false;

export interface RegisterFormRfProps {
  onLogin: () => void;
  onReset: () => void;
  onFinish?: () => void;
  onClose: () => void;
}

export interface RegisterFormRfData {
  email: string;
  password: string;
  code: string;
  date_of_birth: string;
  backend?: string;
}

const sparkleTermsAndConditions = {
  name: `I agree to SparkleVerse Ltd's terms of use and privacy policy.`,
  text: `I agree to SparkleVerse Ltd's terms of use and privacy policy.`,
  link: SPARKLE_TERMS_AND_CONDITIONS_URL,
};

export const RegisterFormRF: React.FunctionComponent<RegisterFormRfProps> = ({
  onLogin,
  onReset,
  onFinish,
  onClose,
}) => {
  const history = useHistory();
  const venueFromSelector = useSelector(venueSelector);
  const venueId = useVenueId();
  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );
  const venue = venueFromSelector ?? currentVenue;

  const [showLoginModal, setShowLoginModal] = useState(false);

  const signUp = ({ email, password }: RegisterFormRfData) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearError,
    getValues,
  } = useForm<RegisterFormRfData & Record<string, string>>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [{ loading }, onSubmit] = useAsyncFn(
    async (data: RegisterFormRfData) => {
      if (!venue) return;

      const { code, email, date_of_birth } = data;
      const { access, id: venueId, requiresDateOfBirth, ticketUrl } = venue;

      try {
        setShowLoginModal(false);

        if (access === VenueAccessMode.Emails) {
          const { data: isEmailWhitelisted } = await checkIsEmailWhitelisted({
            venueId,
            email,
          });

          if (!isEmailWhitelisted) {
            setError(
              "email",
              "validation",
              "We can't find you! Please use the email from your invitation."
            );
            return;
          }
        }

        if (access === VenueAccessMode.Codes || ALWAYS_REQUIRE_CODES) {
          const { data: isCodeValid } = await checkIsCodeValid({
            venueId,
            code,
          });

          if (!isCodeValid) {
            setError(
              "code",
              "validation",
              "We can't find this code! Please use ticket code sent by email."
            );
            return;
          }
        }
        const { user } = await signUp(data);

        if (user && (requiresDateOfBirth || ALWAYS_REQUIRE_BIRTH)) {
          updateUserPrivate(user.uid, { date_of_birth }).catch((e) =>
            console.error(RegisterFormRF.name, "error:", e)
          );
        }

        onFinish?.();
        onClose();
        history.push(`/account/profile${venueId ? `?venueId=${venueId}` : ""}`);
      } catch ({ code, message, response }) {
        if (code === "auth/email-already-in-use") {
          setShowLoginModal(true);
        }
        if (response?.status === 404) {
          setError(
            "email",
            "validation",
            `Email ${email} does not have a ticket; get your ticket at ${ticketUrl}`
          );
        } else if (response?.status >= 500) {
          setError("email", "validation", `Error checking ticket: ${message}`);
        } else {
          setError("backend", "firebase", message);
        }
      }
    },
    [history, onClose, onFinish, setError, venue]
  );

  const clearBackendErrors = useCallback(() => clearError("backend"), [
    clearError,
  ]);

  const [, signIn] = useAsyncFn(async () => {
    const { email, password } = getValues();
    await firebase.auth().signInWithEmailAndPassword(email, password);
  }, [getValues]);

  if (!venue) {
    return isCurrentVenueLoaded ? <NotFound fullScreen /> : <LoadingPage />;
  }

  return (
    <DivRF className="RegisterFormRF mod--flex-col">
      {showLoginModal && (
        <ConfirmationModalRF
          title="This account already exists."
          message="Would you like to login with the same credentials?"
          onConfirm={signIn}
        />
      )}

      <DivRF variant="title">Create your account</DivRF>
      <DivRF variant="subtitle">
        This will give you access to all sorts of Sparkly things...
        <br />
        Please ensure you use the email associated with your ticket.
      </DivRF>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
        className="RegisterFormRF__form mod--flex-col"
      >
        <InputWrapRF
          required={errors?.email?.type === "required" && "Email is required"}
          error={
            (errors?.email?.type === "firebase" ||
              errors?.email?.type === "validation") &&
            errors?.email?.message
          }
        >
          <input
            name="email"
            placeholder="Your email"
            ref={register({ required: true })}
          />
        </InputWrapRF>

        <InputWrapRF
          className="RegisterFormRF__password"
          info={
            errors?.password?.type !== "pattern" &&
            "Password must contain letters, numbers, and be at least 6 characters long"
          }
          required={
            errors?.password?.type === "pattern" &&
            "Password must contain letters, numbers, and be at least 6 characters long"
          }
          error={
            errors?.password?.type === "required" && "Password is required"
          }
        >
          <input
            name="password"
            type="password"
            placeholder="Password"
            ref={register({
              required: true,
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
            })}
          />
        </InputWrapRF>

        {(venue.access === VenueAccessMode.Codes || ALWAYS_REQUIRE_CODES) && (
          <InputWrapRF
            error={
              errors?.code?.type === "required"
                ? "Enter the ticket code from your email. The code is required."
                : errors?.code?.message
            }
          >
            <input
              name="code"
              type="code"
              placeholder="Ticket Code From Your Email"
              ref={register({
                required: true,
              })}
            />
          </InputWrapRF>
        )}

        {/* @debt: the calendar style input validation needs fixing*/}
        {USE_CALENDAR_CONTROL &&
          (venue.requiresDateOfBirth || ALWAYS_REQUIRE_BIRTH) && (
            <InputWrapRF
              info={
                <>
                  You need to be 18 years old to attend this event.
                  <br />
                  Please confirm your age.
                </>
              }
              error={
                errors?.date_of_birth && (
                  <>
                    <SpanRF>
                      {errors?.date_of_birth.type === "required" &&
                        "Date of birth is required"}
                    </SpanRF>
                    <SpanRF>
                      {errors?.date_of_birth.type === "validate" &&
                        "You must be over 18 to attend this event"}
                    </SpanRF>
                  </>
                )
              }
            >
              <input
                className="RegisterFormRF__date-of-birth"
                name="date_of_birth"
                type="date"
                ref={register({
                  required: true,
                  validate: validateDateOfBirth,
                })}
              />
            </InputWrapRF>
          )}
        {!USE_CALENDAR_CONTROL && (
          <DivRF variant="secondary">
            This is an 18+ event, please confirm your date of birth to continue.
          </DivRF>
        )}
        {!USE_CALENDAR_CONTROL && (
          <DivRF className="RegisterFormRF__dob-container mod--flex-row">
            <InputWrapRF
              error={
                isDefined(errors?.month?.type) &&
                errors?.month?.type !== "validate" &&
                "Must be a valid month"
              }
            >
              <label>
                <SpanRF>Month</SpanRF>
                <input
                  className="RegisterFormRF__dob-month RegisterFormRF__dob-input"
                  name="month"
                  type="number"
                  aria-label="month"
                  ref={register({
                    required: true,
                    max: 12,
                    min: 1,
                    validate: () =>
                      validateDateOfBirthInfo(
                        pick(getValues(), ["day", "month", "year"])
                      ),
                  })}
                />
              </label>
            </InputWrapRF>
            <InputWrapRF
              error={
                isDefined(errors?.day?.type) &&
                errors?.day?.type !== "validate" &&
                "Must be a valid day"
              }
            >
              <label>
                <SpanRF>Day</SpanRF>
                <input
                  className="RegisterFormRF__dob-day RegisterFormRF__dob-input"
                  name="day"
                  type="number"
                  aria-label="day"
                  ref={register({
                    required: true,
                    max: 31,
                    min: 1,
                    validate: () =>
                      validateDateOfBirthInfo(
                        pick(getValues(), ["day", "month", "year"])
                      ),
                  })}
                />
              </label>
            </InputWrapRF>

            <InputWrapRF
              error={
                isDefined(errors?.year?.type) &&
                errors?.year?.type !== "validate" &&
                "Must be a valid year"
              }
            >
              <label>
                <SpanRF>Year</SpanRF>
                <input
                  className="RegisterFormRF__dob-year RegisterFormRF__dob-input"
                  name="year"
                  type="number"
                  aria-label="year"
                  ref={register({
                    required: true,
                    maxLength: 4,
                    minLength: 4,
                    max: getYear(new Date()),
                    min: 1900,
                    validate: () =>
                      validateDateOfBirthInfo(
                        pick(getValues(), ["day", "month", "year"])
                      ),
                  })}
                />
              </label>
            </InputWrapRF>
          </DivRF>
        )}
        {!USE_CALENDAR_CONTROL && (
          <SpanRF variant="error">
            {(errors?.year?.type === "validate" ||
              errors?.month?.type === "validate" ||
              errors?.day?.type === "validate") &&
              "You must be over 18 to attend this event"}
          </SpanRF>
        )}
        <SpanRF variant="error">{errors?.backend?.message}</SpanRF>

        <CheckboxWrapRF
          isExternal
          link={sparkleTermsAndConditions.link}
          label={sparkleTermsAndConditions.text}
          error={
            errors?.[sparkleTermsAndConditions.name]?.type === "required" &&
            "Required"
          }
        >
          <input
            name={sparkleTermsAndConditions.name}
            ref={register({
              required: true,
            })}
            type="checkbox"
          />
        </CheckboxWrapRF>

        {venue.termsAndConditions?.map(({ link, name, text }) => (
          <CheckboxWrapRF
            key={name}
            isExternal
            link={link}
            label={text}
            error={errors?.[name]?.type === "required" && "Required"}
          >
            <input
              name={name}
              ref={register({
                required: true,
              })}
              type="checkbox"
            />
          </CheckboxWrapRF>
        ))}
        <ButtonRF
          type="submit"
          disabled={!formState.isValid || loading}
          variant="primary"
          loading={formState.isSubmitting || loading}
        >
          Create account
        </ButtonRF>
      </form>

      <DivRF variant="secondary">
        Already have an account?
        <br />
        <ButtonRF className="LoginFormRF__login" isLink onClick={onLogin}>
          Login
        </ButtonRF>
      </DivRF>
    </DivRF>
  );
};
