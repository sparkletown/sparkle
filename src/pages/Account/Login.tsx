import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import firebase from "firebase/app";

import "./Account.scss";

interface LoginFormData {
  email: string;
  password: string;
}

const signIn = ({ email, password }: LoginFormData) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((credential) => {
      const firestore = firebase.firestore();
      const doc = `users/${credential?.user?.uid}`;
      // const update = { lastLoginUtc: firebase.firestore.Timestamp.fromDate(new Date()) };
      const update = { lastLoginUtc: "abc" };
      console.log("update", doc, update);
      firestore
        .doc(doc)
        .update(update)
        .catch((e) => {
          console.log("uh oh", e);
          firestore
            .doc(doc)
            .set(update)
            .catch((e) => {
              console.log("double uh oh", e);
            });
        });
    });
};

const Login = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, formState, setError } = useForm<
    LoginFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data);
      history.push("/");
    } catch (error) {
      setError("email", "firebase", error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
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
          Don't have an account yet?
          <br />
          <Link to="/account/register">Register instead!</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
