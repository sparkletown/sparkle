import React from "react";
import { useForm, useFormState } from "react-hook-form";
import firebase from "firebase/compat/app";

import { VenueAccessMode } from "types/VenueAcccess";

import { errorMessage, errorStatus } from "utils/error";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useSocialSignIn } from "hooks/useSocialSignIn";

import { TicketCodeField } from "components/organisms/TicketCodeField";

import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";
import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import fIcon from "assets/icons/facebook-social-icon.svg";
import gIcon from "assets/icons/google-social-icon.svg";

import FORMS from "scss/attendee/form.module.scss";

export interface LoginFormProps {
  displayRegisterForm: () => void;
  displayPasswordResetForm: () => void;
  closeAuthenticationModal?: () => void;
  afterUserIsLoggedIn?: (data?: LoginFormData) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  code: string;
  backend?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  displayRegisterForm,
  displayPasswordResetForm,
  closeAuthenticationModal,
  afterUserIsLoggedIn,
}) => {
  const { world, space, isLoading } = useWorldAndSpaceByParams();
  const { signInWithGoogle, signInWithFacebook } = useSocialSignIn();

  const {
    register,
    handleSubmit,
    formState,
    setError,
    control,
    clearErrors,
  } = useForm<LoginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { errors } = useFormState({ control });

  // @debt is `null` the best choice here? we might better show here a loading or error screen instead
  if (!space || !world) return null;

  const clearBackendErrors = () => {
    clearErrors("backend");
  };

  const signIn = ({ email, password }: LoginFormData) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const postSignInCheck = (data?: LoginFormData) => {
    afterUserIsLoggedIn?.(data);

    closeAuthenticationModal?.();
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!space) return;
    try {
      await signIn(data);

      postSignInCheck(data);
    } catch (error) {
      const status = errorStatus(error);
      const message = errorMessage(error);

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
        setError("backend", {
          type: "firebase",
          message:
            "Please check your email or password or contact your event organizer",
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      postSignInCheck();
    } catch {
      setError("backend", { type: "firebase", message: "Error" });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const auth = await signInWithFacebook();

      if (auth.message) {
        setError("backend", { type: "firebase", message: "Error" });

        return;
      }

      postSignInCheck();
    } catch {
      setError("backend", { type: "firebase", message: "Error" });
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!space || !world) {
    return <NotFoundFallback />;
  }

  return (
    <div className="form-container">
      <div className="secondary-action">
        {`Don't have an account yet?`}
        <br />
        <span className={FORMS.inlineLink} onClick={displayRegisterForm}>
          Register instead!
        </span>
      </div>

      <h3>Log in to your account</h3>
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
            })}
          />
          {errors.password && errors.password.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </div>

        {space.access === VenueAccessMode.Codes && (
          <TicketCodeField register={register} error={errors?.code} />
        )}

        <ButtonNG
          className="auth-input"
          variant="primary"
          type="submit"
          disabled={!formState.isValid}
        >
          Log in
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
            Log in with Google
          </ButtonNG>
          <ButtonNG
            className="auth-input"
            type="submit"
            onClick={handleFacebookSignIn}
          >
            <div className="social-icon">
              <img src={fIcon} alt="asd" />
            </div>
            Log in with Facebook
          </ButtonNG>
        </div>
      )}

      <div className="secondary-action">
        {`Forgot your password?`}
        <br />
        <span className={FORMS.inlineLink} onClick={displayPasswordResetForm}>
          Reset your password
        </span>
      </div>
    </div>
  );
};
