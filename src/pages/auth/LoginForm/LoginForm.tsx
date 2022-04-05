import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { Spacer } from "components/attendee/Spacer";
import firebase from "firebase/compat/app";

import { STRING_SPACE } from "settings";

import { SpaceWithId, WorldWithId } from "types/id";

import { errorMessage, errorStatus } from "utils/error";

import { useSocialSignIn } from "hooks/useSocialSignIn";

import CN from "pages/auth/auth.module.scss";
import { SocialLogin } from "pages/auth/SocialLogin";

interface LoginFormProps {
  displayRegisterForm: () => void;
  displayPasswordResetForm: () => void;
  closeAuthenticationModal?: () => void;
  afterUserIsLoggedIn?: (data?: LoginFormData) => void;
  world: WorldWithId;
  space: SpaceWithId;
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
  world,
  space,
}) => {
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

  return (
    <div data-bem="LoginForm" className={CN.container}>
      <form
        data-bem="LoginForm__form"
        className={CN.form}
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
      >
        <Spacer marginSize="large">
          <h1>Log in to Sparkle</h1>
        </Spacer>
        {errors.backend && (
          <div className={CN.error}>
            Oops! Something went wrong. Please try again or use another method
            to create an account
          </div>
        )}
        <Spacer>
          {
            // @debt Input label is skewed by applying it to ::after pseudo element, this is a workaround
          }
          <span>Email</span>
          <Input
            name="email"
            variant="login"
            border="border"
            placeholder="Enter your email"
            register={register}
            rules={{ required: true }}
          />
          {errors.email && errors.email.type === "required" && (
            <span className={CN.error}>Email is required</span>
          )}
          {errors.email &&
            ["firebase", "validation"].includes(errors.email.type) && (
              <span className={CN.error}>{errors.email.message}</span>
            )}
        </Spacer>
        <Spacer>
          {
            // @debt Input label is skewed by applying it to ::after pseudo element, this is a workaround
          }
          <span>Password</span>
          <Input
            type="password"
            name="password"
            variant="login"
            border="border"
            placeholder="Enter your password"
            register={register}
            rules={{ required: true }}
          />
          {errors.password && errors.password.type === "required" && (
            <div className={CN.error}>Password is required</div>
          )}

          <button className={CN.link} onClick={displayPasswordResetForm}>
            Forgot your password?
          </button>
        </Spacer>
        <Spacer />
        <Spacer>
          <Button
            variant="login-primary"
            type="submit"
            disabled={!formState.isValid}
          >
            Log in
          </Button>
        </Spacer>
        {world.hasSocialLoginEnabled && (
          <SocialLogin
            onGoogle={handleGoogleSignIn}
            onFacebook={handleFacebookSignIn}
          />
        )}
        <Spacer />
        <Spacer>
          <div className={CN.center}>
            <span className={CN.info}>Don&apos;t have an account yet?</span>
            {STRING_SPACE}
            <button className={CN.link} onClick={displayRegisterForm}>
              Sign up
            </button>
          </div>
        </Spacer>
      </form>
    </div>
  );
};
