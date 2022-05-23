import React, { useCallback, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { Spacer } from "components/attendee/Spacer";
import firebase from "firebase/compat/app";

import { SIGN_IN_URL, STRING_SPACE } from "settings";

import { errorMessage } from "utils/error";

import CN from "pages/auth/auth.module.scss";

import sparkleHeaderImage from "assets/images/sparkle-header.png";

interface PasswordResetFormProps {}

interface PasswordResetFormData {
  email: string;
}

export const PasswordResetForm: React.FunctionComponent<PasswordResetFormProps> = () => {
  const history = useHistory();

  const proceedToLoginPage = useCallback(() => {
    history.push({
      pathname: SIGN_IN_URL,
      search: history.location.search,
    });
  }, [history]);

  const {
    register,
    handleSubmit,
    control,
    formState,
    setError,
  } = useForm<PasswordResetFormData>({
    mode: "onChange",
  });

  const { errors } = useFormState({ control });

  const [emailSentTo, setEmailSentTo] = useState("");

  const sendPasswordReset = ({ email }: PasswordResetFormData) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email, { url: window.location.href });
  };

  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      await sendPasswordReset(data);
      setEmailSentTo(data.email);
    } catch (e) {
      setError("email", { type: "firebase", message: errorMessage(e) });
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
        <div data-bem="PasswordResetForm" className={CN.container}>
          <Spacer marginDirection="block" marginSize="large">
            <h1>Reset Password</h1>
          </Spacer>
          <Spacer marginDirection="block" paddingDirection="block">
            <span className={CN.info}> Finished resetting your password?</span>
            {STRING_SPACE}
            <button className={CN.link} onClick={proceedToLoginPage}>
              Log in
            </button>
          </Spacer>
          {!emailSentTo && (
            <form
              data-bem="PasswordResetForm__form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Spacer marginDirection="block" paddingDirection="block">
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
                {errors.email && errors.email.type === "firebase" && (
                  <span className={CN.error}>{errors.email.message}</span>
                )}
              </Spacer>
              <Button
                variant="login-primary"
                type="submit"
                disabled={!formState.isValid}
              >
                Send Email
              </Button>
            </form>
          )}
          {emailSentTo && (
            <Spacer>
              <div>
                Password reset email sent. Please check your {emailSentTo}{" "}
                inbox.
              </div>
              <Button variant="primary" onClick={proceedToLoginPage}>
                Close
              </Button>
            </Spacer>
          )}
        </div>
      </div>
    </div>
  );
};
