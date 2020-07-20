import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import firebase from "firebase/app";

import "./Account.scss";
import getQueryParameters from "utils/getQueryParameters";
import { RouterLocation } from "types/RouterLocation";

interface LoginFormData {
  email: string;
  password: string;
}

interface PropsType {
  location: RouterLocation;
}

const signIn = ({ email, password }: LoginFormData) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

const Login: React.FunctionComponent<PropsType> = ({ location }) => {
  const history = useHistory();
  const { venueId } = getQueryParameters(location.search);
  const { register, handleSubmit, errors, formState, setError } = useForm<
    LoginFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data);
      history.push(`/${venueId ? `venue/${venueId}${location.search}` : ""}`);
    } catch (error) {
      setError("email", "firebase", error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="hero-logo sparkle"></div>
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
          <Link to={`/account/register${location.search}`}>
            Register instead!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
