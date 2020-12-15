import React, { useState } from "react";
import firebase from "firebase/app";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { SPARKLE_TERMS_AND_CONDITIONS_URL } from "settings";

import { venueSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import { useSelector } from "hooks/useSelector";

import { CodeOfConductFormData } from "pages/Account/CodeOfConduct";
import { updateUserPrivate } from "pages/Account/helpers";
import { DateOfBirthField } from "components/organisms/DateOfBirthField";
import { TicketCodeField } from "components/organisms/TicketCodeField";
import { ConfirmationModal } from "components/atoms/ConfirmationModal/ConfirmationModal";
import { VenueAccessType } from "types/VenueAcccess";
import { getAccessTokenKey } from "utils/localStorage";

interface PropsType {
  displayLoginForm: () => void;
  displayPasswordResetForm: () => void;
  afterUserIsLoggedIn?: () => void;
  closeAuthenticationModal: () => void;
}

interface RegisterFormData {
  email: string;
  password: string;
  code: string;
  date_of_birth: string;
  backend?: string;
}

export interface CodeOfConductQuestion {
  name: keyof CodeOfConductFormData;
  text: string;
  link?: string;
}

export interface RegisterData {
  date_of_birth: string;
}

const sparkleTermsAndConditions = {
  name: `I agree to Sparkle's terms and conditions`,
  text: `I agree to Sparkle's terms and conditions`,
  link: SPARKLE_TERMS_AND_CONDITIONS_URL,
};

const RegisterForm: React.FunctionComponent<PropsType> = ({
  displayLoginForm,
  displayPasswordResetForm,
  afterUserIsLoggedIn,
  closeAuthenticationModal,
}) => {
  const history = useHistory();
  const venue = useSelector(venueSelector);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const signUp = ({ email, password }: RegisterFormData) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearError,
    watch,
    getValues,
  } = useForm<RegisterFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const clearBackendErrors = () => {
    clearError("backend");
  };

  if (!venue) {
    return <>Loading...</>;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setShowLoginModal(false);
      const auth = await signUp(data);

      if (venue.access?.includes(VenueAccessType.Codes)) {
        const result = await firebase
          .functions()
          .httpsCallable("access-checkAccess")({
          venueId: venue.id,
          code: data.code,
        });
        localStorage.setItem(getAccessTokenKey(venue.id), result.data.token);
      }
      if (venue.access?.includes(VenueAccessType.Emails)) {
        const result = await firebase
          .functions()
          .httpsCallable("access-checkAccess")({
          venueId: venue.id,
          email: data.email,
        });
        localStorage.setItem(getAccessTokenKey(venue.id), result.data.token);
      }

      if (auth.user && venue.requiresDateOfBirth) {
        updateUserPrivate(auth.user.uid, {
          date_of_birth: data.date_of_birth,
        });
      }

      afterUserIsLoggedIn && afterUserIsLoggedIn();

      closeAuthenticationModal();

      const accountProfileUrl = `/account/profile${
        venue.id ? `?venueId=${venue.id}` : ""
      }`;

      history.push(accountProfileUrl);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setShowLoginModal(true);
      }
      if (error.response?.status === 404) {
        setError(
          "email",
          "validation",
          `Email ${data.email} does not have a ticket; get your ticket at ${venue.ticketUrl}`
        );
      } else if (error.response?.status >= 500) {
        setError(
          "email",
          "validation",
          `Error checking ticket: ${error.message}`
        );
      } else {
        setError("backend", "firebase", error.message);
      }
    }
  };

  const hasTermsAndConditions = isTruthy(venue.termsAndConditions);
  const termsAndConditions = venue.termsAndConditions;

  const signIn = async () => {
    const { email, password } = getValues();
    await firebase.auth().signInWithEmailAndPassword(email, password);
  };

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
        <div className="register-form-title">First, create your account</div>
        <div>This will give you access to all sorts of events in Sparkle</div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
        className="form"
      >
        <div className="input-group">
          <input
            name="email"
            className="input-block input-centered"
            placeholder="Your email"
            ref={register({ required: true })}
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
            name="password"
            className="input-block input-centered"
            type="password"
            placeholder="Password"
            ref={register({
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
            Password must contain letters, numbers, and be at least 6 characters
            long
          </span>

          {errors.password && errors.password.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </div>

        {venue.access?.includes(VenueAccessType.Codes) && (
          <TicketCodeField register={register} error={errors?.code} />
        )}

        {venue.requiresDateOfBirth && (
          <DateOfBirthField register={register} error={errors?.date_of_birth} />
        )}

        {errors.backend && (
          <span className="input-error">{errors.backend.message}</span>
        )}

        <div className="input-group" key={sparkleTermsAndConditions.name}>
          <label
            htmlFor={sparkleTermsAndConditions.name}
            className={`checkbox input-info ${
              watch(sparkleTermsAndConditions.name) && "checkbox-checked"
            }`}
          >
            {sparkleTermsAndConditions.link && (
              <a
                href={sparkleTermsAndConditions.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sparkleTermsAndConditions.text}
              </a>
            )}
            {!sparkleTermsAndConditions.link && sparkleTermsAndConditions.text}
          </label>
          <input
            type="checkbox"
            name={sparkleTermsAndConditions.name}
            id={sparkleTermsAndConditions.name}
            ref={register({
              required: true,
            })}
          />
          {/* @ts-ignore @debt term should be typed if possible */}
          {errors?.[sparkleTermsAndConditions.name]?.type === "required" && (
            <span className="input-error">Required</span>
          )}
        </div>
        {hasTermsAndConditions &&
          termsAndConditions.map((term) => {
            /* @ts-ignore @debt term should be typed if possible */
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
                  name={term.name}
                  id={term.name}
                  ref={register({
                    required: true,
                  })}
                />
                {required && <span className="input-error">Required</span>}
              </div>
            );
          })}
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Create account"
          disabled={!formState.isValid}
        />
      </form>

      <div className="secondary-action">
        Already have an account?
        <br />
        <span className="link" onClick={displayLoginForm}>
          Login
        </span>
      </div>
    </div>
  );
};

export default RegisterForm;
