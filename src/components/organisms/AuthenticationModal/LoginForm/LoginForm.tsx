import React from "react";
import { useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";

import { VenueAccessMode } from "types/VenueAcccess";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useSocialSignIn } from "hooks/useSocialSignIn";

import { TicketCodeField } from "components/organisms/TicketCodeField";

import { ButtonNG } from "components/atoms/ButtonNG";

import fIcon from "assets/icons/facebook-social-icon.svg";
import gIcon from "assets/icons/google-social-icon.svg";
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

const LoginForm: React.FunctionComponent<LoginFormProps> = ({
  displayRegisterForm,
  displayPasswordResetForm,
  closeAuthenticationModal,
  afterUserIsLoggedIn,
}) => {
  const firebase = useFirebase();

  const { signInWithGoogle, signInWithFacebook } = useSocialSignIn();

  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearError,
  } = useForm<LoginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  if (!space) return null;

  const clearBackendErrors = () => {
    clearError("backend");
  };

  const signIn = async ({ email, password }: LoginFormData) => {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const postSignInCheck = async (data?: LoginFormData) => {
    await afterUserIsLoggedIn?.(data);

    await closeAuthenticationModal?.();
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!space) return;
    try {
      await signIn(data);

      await postSignInCheck(data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError(
          "email",
          "validation",
          `Email ${data.email} does not have a ticket; get your ticket at ${space.ticketUrl}`
        );
      } else if (error.response?.status >= 500) {
        setError(
          "email",
          "validation",
          `Error checking ticket: ${error.message}`
        );
      } else {
        setError(
          "backend",
          "firebase",
          "Please check your email or password or contact your event organizer"
        );
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      postSignInCheck();
    } catch {
      setError("backend", "firebase", "Error");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const auth = await signInWithFacebook();

      if (auth.message) {
        setError("backend", "firebase", "Error");

        return;
      }

      postSignInCheck();
    } catch {
      setError("backend", "firebase", "Error");
    }
  };

  return (
    <div className="form-container">
      <div className="secondary-action">
        {`Don't have an account yet?`}
        <br />
        <span className="link" onClick={displayRegisterForm}>
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
            name="email"
            className="input-block input-centered auth-input"
            placeholder="Your email address"
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
            className="input-block input-centered auth-input"
            type="password"
            placeholder="Password"
            ref={register({
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

      {space.hasSocialLoginEnabled && (
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
        <span className="link" onClick={displayPasswordResetForm}>
          Reset your password
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
