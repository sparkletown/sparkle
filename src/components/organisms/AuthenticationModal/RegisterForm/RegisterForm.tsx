import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { ConfirmationModal } from "components/admin/ConfirmationModal/ConfirmationModal";
import { differenceInYears, parseISO } from "date-fns";
import firebase from "firebase/compat/app";

import {
  ACCOUNT_PROFILE_VENUE_PARAM_URL,
  DEFAULT_REQUIRES_DOB,
} from "settings";

import { checkIsCodeValid, checkIsEmailWhitelisted } from "api/auth";

import {
  SpaceId,
  SpaceSlug,
  SpaceWithId,
  WorldSlug,
  WorldWithId,
} from "types/id";
import { VenueAccessMode } from "types/VenueAcccess";

import { errorCode, errorMessage, errorStatus } from "utils/error";
import { isTruthy } from "utils/types";
import { generateUrl } from "utils/url";

import { useAnalytics } from "hooks/useAnalytics";
import { useSocialSignIn } from "hooks/useSocialSignIn";

import { updateUserPrivate } from "pages/Account/helpers";

import { LoginFormData } from "components/organisms/AuthenticationModal/LoginForm/LoginForm";
import { TicketCodeField } from "components/organisms/TicketCodeField";

import { ButtonNG } from "components/atoms/ButtonNG";

import fIcon from "assets/icons/facebook-social-icon.svg";
import gIcon from "assets/icons/google-social-icon.svg";

import FORMS from "scss/attendee/form.module.scss";

const validateDateOfBirth = (stringDate: string) => {
  const yearsDifference = differenceInYears(new Date(), parseISO(stringDate));
  return yearsDifference >= 18 && yearsDifference <= 100;
};

export interface RegisterFormInput {
  email: string;
  password: string;
  code: string;
  date_of_birth: string;
  backend?: string;
}

export interface RegisterData {
  date_of_birth: string;
}

export interface RegisterFormProps {
  displayLoginForm: () => void;
  displayPasswordResetForm: () => void;
  afterUserIsLoggedIn?: (data?: LoginFormData) => void;
  closeAuthenticationModal?: () => void;
  world: WorldWithId;
  space: SpaceWithId;
  spaceId: SpaceId;
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
  isWorldLoaded: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  displayLoginForm,
  afterUserIsLoggedIn,
  closeAuthenticationModal,
  spaceId,
  space,
  world,
  worldSlug,
  spaceSlug,
  isWorldLoaded,
}) => {
  const history = useHistory();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const analytics = useAnalytics({ venue: space });

  const { signInWithGoogle, signInWithFacebook } = useSocialSignIn();

  const signUp = ({ email, password }: RegisterFormInput) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const {
    register,
    handleSubmit,
    control,
    formState,
    setError,
    clearErrors,
    watch,
    getValues,
  } = useForm<RegisterFormInput & Record<string, string>>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { errors } = useFormState({ control });

  const clearBackendErrors = () => {
    clearErrors("backend");
  };

  const checkVenueAccessLevels = async (data: RegisterFormInput) => {
    if (space.access === VenueAccessMode.Emails) {
      const isEmailWhitelisted = await checkIsEmailWhitelisted({
        venueId: spaceId,
        email: data.email,
      });

      if (!isEmailWhitelisted.data) {
        setError("email", {
          type: "validation",
          message:
            "We can't find you! Please use the email from your invitation.",
        });
        return;
      }
    }

    if (space.access === VenueAccessMode.Codes) {
      const isCodeValid = await checkIsCodeValid({
        venueId: spaceId,
        code: data.code,
      });

      if (!isCodeValid.data) {
        setError("code", {
          type: "validation",
          message:
            "We can't find you! Please use the code from your invitation.",
        });
        return;
      }
    }
  };

  const postRegisterCheck = (
    authResult: firebase.auth.UserCredential,
    data: RegisterFormInput
  ) => {
    if (authResult.user && isDobRequired) {
      updateUserPrivate(authResult.user.uid, {
        date_of_birth: data.date_of_birth,
      }).catch((e) => console.error(RegisterForm.name, e));
    }

    analytics.trackSignUpEvent(data.email);
    afterUserIsLoggedIn?.(data);

    closeAuthenticationModal?.();
  };

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      setShowLoginModal(false);

      checkVenueAccessLevels(data).catch((e) =>
        console.error(RegisterForm.name, e)
      );

      const auth = await signUp(data);

      postRegisterCheck(auth, data);

      const profileUrl = generateUrl({
        route: ACCOUNT_PROFILE_VENUE_PARAM_URL,
        required: ["worldSlug", "spaceSlug"],
        params: { worldSlug, spaceSlug },
      });

      history.push(profileUrl);
    } catch (e) {
      const code = errorCode(e);
      const status = errorStatus(e);
      const message = errorMessage(e);

      if (code === "auth/email-already-in-use") {
        setShowLoginModal(true);
      }
      if (status === 404) {
        setError("email", {
          type: "validation",
          message: `Email ${data.email} does not have a ticket; get your ticket at ${space.ticketUrl}`,
        });
      } else if (status >= 500) {
        setError("email", {
          type: "validation",
          message: `Error checking ticket: ${message}`,
        });
      } else {
        setError("backend", { type: "firebase", message });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const { email, password, code, date_of_birth } = getValues();
    const formValues = { email, password, code, date_of_birth };
    checkVenueAccessLevels(formValues).catch((e) =>
      console.error(RegisterForm.name, e)
    );
    try {
      const auth = await signInWithGoogle();
      postRegisterCheck(auth, formValues);
    } catch (error) {
      setError("backend", { type: "firebase", message: "Error" });
    }
  };
  const handleFacebookSignIn = async () => {
    const { email, password, code, date_of_birth } = getValues();
    const formValues = { email, password, code, date_of_birth };
    checkVenueAccessLevels(formValues).catch((e) =>
      console.error(RegisterForm.name, e)
    );
    try {
      const auth = await signInWithFacebook();

      if (auth.message) {
        setError("backend", { type: "firebase", message: "Error" });
        return;
      }

      postRegisterCheck(auth, formValues);
    } catch {
      setError("backend", { type: "firebase", message: "Error" });
    }
  };

  const hasTermsAndConditions = isTruthy(space.termsAndConditions);
  const termsAndConditions = space.termsAndConditions;

  const signIn = async () => {
    const { email, password } = getValues();
    await firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const isDobRequired =
    isWorldLoaded && (world?.requiresDateOfBirth ?? DEFAULT_REQUIRES_DOB);

  return (
    <div className="form-container">
      {showLoginModal && (
        <ConfirmationModal
          header={"This account already exists."}
          message="Would you like to login with the same credentials?"
          onConfirm={signIn}
        />
      )}
      <div>
        <div className="register-form-title">Сreate your account</div>
      </div>
      {errors.backend && (
        <div className="auth-submit-error">
          <span className="auth-submit-error__message">
            Oops! Something went wrong. Please try again or use another method
            to create an account
          </span>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
        className="form"
      >
        <div className="input-group">
          <input
            className={FORMS.input}
            placeholder="Your email address"
            {...register("email", { required: true })}
          />
          {errors.email && errors.email.type === "required" && (
            <span className="input-error">Email is required</span>
          )}
          {errors.email &&
            ["firebase", "validation"].includes(errors.email.type) && (
              <span className="input-error">{errors.email.message}</span>
            )}
        </div>

        <div className="input-group">
          <input
            className={FORMS.input}
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
            })}
          />

          <span
            className={`input-${
              errors.password && errors.password.type === "pattern"
                ? "error"
                : "info"
            }`}
          >
            Password must contain letters and numbers
          </span>

          {errors.password && errors.password.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </div>

        {space.access === VenueAccessMode.Codes && (
          <TicketCodeField register={register} error={errors?.code} />
        )}

        {isDobRequired && (
          <div className="input-group">
            <input
              className={FORMS.input}
              type="date"
              {...register("date_of_birth", {
                required: true,
                validate: validateDateOfBirth,
              })}
            />
            <small className="input-info">
              You need to be 18 years old to attend this event. Please confirm
              your age.
            </small>
            {errors?.date_of_birth && (
              <span className="input-error">
                {errors?.date_of_birth?.type === "required" && (
                  <>Date of birth is required</>
                )}
                {errors?.date_of_birth?.type === "validate" && (
                  <div>You need to be at least 18 years of age.</div>
                )}
              </span>
            )}
          </div>
        )}

        {hasTermsAndConditions &&
          termsAndConditions.map((term) => {
            const required = errors?.[term.name]?.type === "required";
            return (
              <div className="input-group" key={term.name}>
                <label
                  htmlFor={term.name}
                  className={`checkbox ${
                    watch(term.name) && "checkbox-checked"
                  }`}
                >
                  {term.link && (
                    <a
                      href={term.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {term.text}
                    </a>
                  )}
                  {!term.link && term.text}
                </label>
                <input
                  type="checkbox"
                  id={term.name}
                  {...register(term.name, {
                    required: true,
                  })}
                />
                {required && <span className="input-error">Required</span>}
              </div>
            );
          })}
        <ButtonNG
          className="auth-input register"
          type="submit"
          variant="primary"
          disabled={!formState.isValid}
        >
          Create account
        </ButtonNG>
      </form>

      {world.hasSocialLoginEnabled && (
        <div className="social-auth-container">
          <span>or</span>
          <ButtonNG
            className="auth-input"
            type="submit"
            onClick={handleGoogleSignIn}
          >
            <div className="social-icon">
              <img src={gIcon} alt="asd" />
            </div>
            Sign up with Google
          </ButtonNG>
          <ButtonNG
            className="auth-input"
            type="submit"
            onClick={handleFacebookSignIn}
          >
            <div className="social-icon">
              <img src={fIcon} alt="asd" />
            </div>
            Sign up with Facebook
          </ButtonNG>
        </div>
      )}

      <div className="secondary-action">
        Already have an account?
        <br />
        <span className={FORMS.inlineLink} onClick={displayLoginForm}>
          Login
        </span>
      </div>
    </div>
  );
};
