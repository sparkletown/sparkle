import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import firebase from "firebase/compat/app";

import { errorMessage } from "utils/error";

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

  const onClose = () => {
    closeAuthenticationModal?.();
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <div className="secondary-action">
        {`Finished resetting your password?`}
        <br />
        <span className="link" onClick={displayLoginForm}>
          Log in!
        </span>
      </div>
      {!emailSentTo && (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <input
              className="input-block input-centered"
              placeholder="Your email"
              {...register("email", { required: true })}
            />
            {errors.email && errors.email.type === "required" && (
              <span className="input-error">Email is required</span>
            )}
            {errors.email && errors.email.type === "firebase" && (
              <span className="input-error">{errors.email.message}</span>
            )}
          </div>
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Send Email"
            disabled={!formState.isValid}
          />
        </form>
      )}
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
