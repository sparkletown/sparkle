import firebase from "firebase/app";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface PropsType {
  displayLoginForm: () => void;
  closeAuthenticationModal: () => void;
}

interface PasswordResetFormData {
  email: string;
}

const PasswordResetForm: React.FunctionComponent<PropsType> = ({
  displayLoginForm,
  closeAuthenticationModal,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
  } = useForm<PasswordResetFormData>({
    mode: "onChange",
  });

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
    } catch (error) {
      setError("email", "firebase", error.message);
    }
  };

  const onClose = () => {
    closeAuthenticationModal();
  };

  return (
    <div className="form-container">
      <h2>Reset Password for non-Hubbers</h2>

      <em>
        Are you a Hubber with an Okta account? If so, you should use &apos;Quick
        log in with Okta&apos; above instead of this form! ☝
      </em>

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

export default PasswordResetForm;
