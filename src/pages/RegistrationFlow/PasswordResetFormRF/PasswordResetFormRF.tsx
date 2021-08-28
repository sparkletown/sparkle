import React, { useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

import { ButtonNG } from "components/atoms/ButtonNG";

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

  const onClose = () => {
    onFinish();
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      {!emailSentTo && (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
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
            {errors.email && errors.email.type === "firebase" && (
              <span className="input-error">{errors.email.message}</span>
            )}
          </div>
          <ButtonNG
            variant="primary"
            type="submit"
            disabled={!formState.isValid}
          >
            Send Email
          </ButtonNG>
        </form>
      )}
      <div className="secondary-action">
        {`Finished resetting your password?`}
        <br />
        <span className="link" onClick={onLogin}>
          Log in!
        </span>
      </div>
      {emailSentTo && (
        <form onSubmit={handleSubmit(onClose)} className="form">
          <div className="input-group">
            <span className="info">
              Password reset email sent. Please check your {emailSentTo} inbox.
            </span>
          </div>
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Close"
          />
        </form>
      )}
    </div>
  );
};
