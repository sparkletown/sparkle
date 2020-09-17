import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import { CODE_CHECK_URL } from "secrets";
import axios from "axios";
import { IS_BURN } from "secrets";
import { TICKET_URL } from "settings";

interface PropsType {
  displayRegisterForm: () => void;
  displayPasswordResetForm: () => void;
  closeAuthenticationModal: () => void;
  afterUserIsLoggedIn?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
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
      if (IS_BURN) await axios.get(CODE_CHECK_URL + data.email);
      const auth = await signIn(data);
      if (IS_BURN && auth.user) {
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
                  codes_used: [...(doc.data()?.codes_used || []), data.email],
                });
            }
          });
      }
      afterUserIsLoggedIn && afterUserIsLoggedIn();
      closeAuthenticationModal();
      if (IS_BURN) history.push("/in/playa");
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
      <h2>Log in</h2>
      <div className="secondary-action">
        {`Don't have an account yet?`}
        <br />
        <span className="link" onClick={displayRegisterForm}>
          Register instead!
        </span>
      </div>
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
