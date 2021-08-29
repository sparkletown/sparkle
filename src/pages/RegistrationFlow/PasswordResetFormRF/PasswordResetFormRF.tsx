import React, { useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

import { ButtonRF } from "../ButtonRF";
import { DivRF } from "../DivRF";
import { InputWrapRF } from "../InputWrapRF";

import "./PasswordResetFormRF.scss";

interface PasswordResetFormRfProps {
  onLogin: () => void;
  onFinish: () => void;
}

interface PasswordResetFormRfData {
  email: string;
}

export const PasswordResetFormRF: React.FunctionComponent<PasswordResetFormRfProps> = ({
  onLogin,
  onFinish,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
  } = useForm<PasswordResetFormRfData>({
    mode: "onChange",
  });

  const [emailSentTo, setEmailSentTo] = useState("");

  const sendPasswordReset = ({ email }: PasswordResetFormRfData) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email, { url: window.location.href });
  };

  const onSubmit = async (data: PasswordResetFormRfData) => {
    try {
      await sendPasswordReset(data);
      setEmailSentTo(data.email);
    } catch (error) {
      setError("email", "firebase", error.message);
    }
  };

  return (
    <DivRF className="PasswordResetFormRF">
      <DivRF variant="title">Reset Password</DivRF>
      {!emailSentTo && (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <InputWrapRF
            required={errors?.email?.type === "required" && "Email is required"}
            error={errors?.email?.type === "firebase" && errors?.email?.message}
          >
            <input
              name="email"
              placeholder="Your email"
              ref={register({ required: true })}
            />
          </InputWrapRF>
          <ButtonRF
            variant="primary"
            type="submit"
            disabled={!formState.isValid}
          >
            Send Email
          </ButtonRF>
        </form>
      )}
      <DivRF variant="secondary">
        Finished resetting your password?
        <br />
        <ButtonRF isLink onClick={onLogin}>
          Log in!
        </ButtonRF>
      </DivRF>
      {emailSentTo && (
        <DivRF className="PasswordResetFormRF__info">
          Password reset email sent. Please check your {emailSentTo} inbox.
        </DivRF>
      )}
      {emailSentTo && (
        <form onSubmit={handleSubmit(onFinish)}>
          <ButtonRF variant="primary" type="submit">
            Close
          </ButtonRF>
        </form>
      )}
    </DivRF>
  );
};
