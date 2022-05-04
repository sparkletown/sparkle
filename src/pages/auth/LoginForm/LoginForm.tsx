import React, { useCallback } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useSearchParam } from "react-use";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { Spacer } from "components/attendee/Spacer";
import firebase from "firebase/compat/app";

import {
  PASSWORD_RESET_URL,
  QUICK_JOIN_PARAM_NAME,
  RETURN_URL_PARAM_NAME,
  SIGN_UP_URL,
  STRING_SPACE,
} from "settings";

import { errorMessage, errorStatus } from "utils/error";

import { useSocialSignIn } from "hooks/useSocialSignIn";

import CN from "pages/auth/auth.module.scss";
import { SocialLogin } from "pages/auth/SocialLogin";

import sparkleHeaderImage from "assets/images/sparkle-header.png";

interface LoginFormProps {}

export interface LoginFormData {
  email: string;
  password: string;
  code: string;
  backend?: string;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const history = useHistory();

  const proceedToRegisterPage = useCallback(() => {
    history.push({ pathname: SIGN_UP_URL, search: history.location.search });
  }, [history]);

  const proceedToPasswordResetPage = useCallback(() => {
    history.push({
      pathname: PASSWORD_RESET_URL,
      search: history.location.search,
    });
  }, [history]);

  const returnUrl = useSearchParam(RETURN_URL_PARAM_NAME);
  const shouldQuickJoin = useSearchParam(QUICK_JOIN_PARAM_NAME);

  const { signInWithGoogle } = useSocialSignIn();

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

  const clearBackendErrors = () => {
    clearErrors("backend");
  };

  const navigateToSource = () => {
    if (!returnUrl) return;

    history.push({
      pathname: returnUrl,
      search: `?${QUICK_JOIN_PARAM_NAME}=${shouldQuickJoin}`,
    });
  };

  const signIn = ({ email, password }: LoginFormData) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data);

      navigateToSource();
    } catch (error) {
      const status = errorStatus(error);
      const message = errorMessage(error);

      if (status >= 500) {
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

      navigateToSource();
    } catch {
      setError("backend", { type: "firebase", message: "Error" });
    }
  };

  return (
    <div data-bem="Login" className={CN.login}>
      <div data-bem="Login__logo" className={CN.logo}>
        <Spacer marginSize="none">
          <img src={sparkleHeaderImage} alt="" width="100%" />
        </Spacer>
      </div>
      <div data-bem="Login__contents" className={CN.contents}>
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
                Oops! Something went wrong. Please try again or use another
                method to create an account
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

              <button className={CN.link} onClick={proceedToPasswordResetPage}>
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
            <SocialLogin onGoogle={handleGoogleSignIn} />
            <Spacer />
            <Spacer>
              <div className={CN.center}>
                <span className={CN.info}>Don&apos;t have an account yet?</span>
                {STRING_SPACE}
                <button className={CN.link} onClick={proceedToRegisterPage}>
                  Sign up
                </button>
              </div>
            </Spacer>
          </form>
        </div>
      </div>
    </div>
  );
};
