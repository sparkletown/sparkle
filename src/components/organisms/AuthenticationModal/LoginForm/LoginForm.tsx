import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import axios from "axios";
import { IS_BURN } from "secrets";
import { CODE_CHECK_ENABLED, DEFAULT_VENUE, TICKET_URL } from "settings";
import { codeCheckUrl, venueInsideUrl } from "utils/url";

interface PropsType {
  displayRegisterForm: () => void;
  displayPasswordResetForm: () => void;
  closeAuthenticationModal: () => void;
  afterUserIsLoggedIn?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
  code: string;
  date_of_birth: string;
}

const LoginForm: React.FunctionComponent<PropsType> = ({
  displayRegisterForm,
  displayPasswordResetForm,
  closeAuthenticationModal,
  afterUserIsLoggedIn,
}) => {
  const firebase = useFirebase();

  const history = useHistory();
  const { register, handleSubmit, errors, formState, setError } = useForm<
    LoginFormData
  >({
    mode: "onChange",
  });

  const signIn = ({ email, password }: LoginFormData) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (CODE_CHECK_ENABLED) await axios.get(codeCheckUrl(data.code));
      const auth = await signIn(data);
      if (CODE_CHECK_ENABLED && auth.user) {
        firebase
          .firestore()
          .doc(`userprivate/${auth.user.uid}`)
          .get()
          .then((doc) => {
            if (auth.user && doc.exists) {
              firebase
                .firestore()
                .doc(`userprivate/${auth.user.uid}`)
                .update({
                  codes_used: [...(doc.data()?.codes_used || []), data.code],
                  date_of_birth: data.date_of_birth,
                });
            }
          });
      }
      afterUserIsLoggedIn && afterUserIsLoggedIn();
      closeAuthenticationModal();
      if (IS_BURN) history.push(venueInsideUrl(DEFAULT_VENUE));
    } catch (error) {
      if (error.response?.status === 404) {
        setError(
          "email",
          "validation",
          `Email ${data.email} does not have a ticket; get your ticket at ${TICKET_URL}`
        );
      } else if (error.response?.status >= 500) {
        setError(
          "email",
          "validation",
          `Error checking ticket: ${error.message}`
        );
      } else {
        setError("email", "firebase", error.message);
      }
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
      <h2>Log in</h2>
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
          {errors.email &&
            ["firebase", "validation"].includes(errors.email.type) && (
              <span className="input-error">{errors.email.message}</span>
            )}
        </div>
        <div className="input-group">
          <input
            name="password"
            className="input-block input-centered"
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
        <div className="input-group">
          <input
            name="date_of_birth"
            className="input-block input-centered"
            type="date"
            ref={register({ required: true })}
          />
          {errors?.date_of_birth?.type === "required" && (
            <span className="input-error">Date of birth is required</span>
          )}
        </div>
        <div className="input-group">
          <input
            name="code"
            className="input-block input-centered"
            type="code"
            placeholder="Ticket Code From Your Email"
            ref={register({
              required: true,
            })}
          />
          {errors.code && (
            <span className="input-error">
              {errors.code.type === "required" ? (
                <>
                  Enter the ticket code from your email. The code is required.
                </>
              ) : (
                errors.code.message
              )}
            </span>
          )}
        </div>
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Log in"
          disabled={!formState.isValid}
        />
      </form>
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
