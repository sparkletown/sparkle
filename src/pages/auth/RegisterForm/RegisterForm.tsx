import React, { useCallback, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useSearchParam } from "react-use";
import classNames from "classnames";
import { ConfirmationModal } from "components/admin/ConfirmationModal/ConfirmationModal";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { Spacer } from "components/attendee/Spacer";
import { differenceInYears, parseISO } from "date-fns";
import firebase from "firebase/compat/app";

import {
  ACCOUNT_PROFILE_BASE_URL,
  DEFAULT_REQUIRES_DOB,
  RETURN_URL_PARAM_NAME,
  SIGN_IN_URL,
  STRING_SPACE,
} from "settings";

import { errorCode, errorMessage, errorStatus } from "utils/error";

import { useSocialSignIn } from "hooks/useSocialSignIn";

// import { updateUserPrivate } from "pages/Account/helpers";
import CN from "pages/auth/auth.module.scss";
import { SocialLogin } from "pages/auth/SocialLogin";

import sparkleHeaderImage from "assets/images/sparkle-header.png";

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

export interface RegisterFormProps {}

export const RegisterForm: React.FC<RegisterFormProps> = () => {
  const history = useHistory();

  const proceedToLoginPage = useCallback(() => {
    history.push({ pathname: SIGN_IN_URL, search: history.location.search });
  }, [history]);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const returnUrl = useSearchParam(RETURN_URL_PARAM_NAME);

  const { signInWithGoogle } = useSocialSignIn();

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
    getValues,
  } = useForm<RegisterFormInput & Record<string, string>>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { errors } = useFormState({ control });

  const clearBackendErrors = () => {
    clearErrors("backend");
  };

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      setShowLoginModal(false);

      await signUp(data);

      // postRegisterCheck(auth, data);

      history.push({
        pathname: ACCOUNT_PROFILE_BASE_URL,
        search: `?${RETURN_URL_PARAM_NAME}=${returnUrl}`,
      });
    } catch (e) {
      const code = errorCode(e);
      const status = errorStatus(e);
      const message = errorMessage(e);

      if (code === "auth/email-already-in-use") {
        setShowLoginModal(true);
      }
      if (status >= 500) {
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
    try {
      await signInWithGoogle();
    } catch (error) {
      setError("backend", { type: "firebase", message: "Error" });
    }
  };

  const signIn = async () => {
    const { email, password } = getValues();
    await firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const isDobRequired = DEFAULT_REQUIRES_DOB;

  const passwordLabelClasses = classNames({
    error: errors.password?.type === "pattern",
    info: errors.password?.type !== "pattern",
  });

  return (
    <div data-bem="Login" className={CN.login}>
      <div data-bem="Login__logo" className={CN.logo}>
        <Spacer marginSize="none">
          <img src={sparkleHeaderImage} alt="" width="100%" />
        </Spacer>
      </div>
      <div data-bem="Login__contents" className={CN.contents}>
        <div data-bem="RegisterForm">
          <Spacer marginDirection="block" marginSize="large">
            <h1>Sign up to Sparkle</h1>
          </Spacer>

          {showLoginModal && (
            <Spacer>
              <ConfirmationModal
                header="This account already exists."
                message="Would you like to login with the same credentials?"
                onConfirm={signIn}
              />
            </Spacer>
          )}

          {errors.backend && (
            <div className="auth-submit-error">
              <span className="auth-submit-error__message">
                Oops! Something went wrong. Please try again or use another
                method to create an account
              </span>
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={clearBackendErrors}
            className="form"
          >
            <Spacer>
              {
                // @debt Input label is skewed by applying it to ::after pseudo element, this is a workaround
              }
              <span>Email</span>
              <Input
                name="email"
                variant="login"
                border="border"
                placeholder="Your email address"
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
                name="password"
                type="password"
                variant="login"
                border="border"
                placeholder="Password"
                register={register}
                rules={{
                  required: true,
                  pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
                }}
              />

              <div
                data-bem="RegisterForm__password-label"
                className={passwordLabelClasses}
              >
                Password must contain letters and numbers
              </div>

              {errors.password && errors.password.type === "required" && (
                <div data-bem="RegisterForm__password-error">
                  Password is required
                </div>
              )}
            </Spacer>

            {isDobRequired && (
              <div className="input-group">
                <input
                  className={CN.input}
                  type="date"
                  {...register("date_of_birth", {
                    required: true,
                    validate: validateDateOfBirth,
                  })}
                />
                <small className="input-info">
                  You need to be 18 years old to attend this event. Please
                  confirm your age.
                </small>
                {errors?.date_of_birth && (
                  <span className={CN.error}>
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

            <Spacer />

            <Spacer>
              <Button
                variant="login-primary"
                type="submit"
                disabled={!formState.isValid}
              >
                Create account
              </Button>
            </Spacer>
          </form>

          <SocialLogin onGoogle={handleGoogleSignIn} />

          <Spacer />

          <Spacer>
            <div className={CN.center}>
              <span>Already have an account?</span>
              {STRING_SPACE}
              <button className={CN.link} onClick={proceedToLoginPage}>
                Login
              </button>
            </div>
          </Spacer>
        </div>
      </div>
    </div>
  );
};
