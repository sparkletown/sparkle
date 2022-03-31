import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { Spacer } from "components/attendee/Spacer";
import firebase from "firebase/compat/app";

import { STRING_SPACE } from "settings";

import { errorMessage } from "utils/error";

import CN from "pages/auth/auth.module.scss";

interface PropsType {
  displayLoginForm: () => void;
  closeAuthenticationModal?: () => void;
}

interface PasswordResetFormData {
  email: string;
}

export const PasswordResetForm: React.FunctionComponent<PropsType> = ({
  displayLoginForm,
  closeAuthenticationModal,
}) => {
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
    <div data-bem="PasswordResetForm" className={CN.container}>
      <Spacer marginDirection="block" marginSize="large">
        <h1>Reset Password</h1>
      </Spacer>
      <Spacer marginDirection="block" paddingDirection="block">
        <span className={CN.info}> Finished resetting your password?</span>
        {STRING_SPACE}
        <button className={CN.link} onClick={displayLoginForm}>
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
            Password reset email sent. Please check your {emailSentTo} inbox.
          </div>
          <Button variant="primary" onClick={displayLoginForm}>
            Close
          </Button>
        </Spacer>
      )}
    </div>
  );
};
