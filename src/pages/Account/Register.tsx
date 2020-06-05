import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";

import "./Account.scss";

interface RegisterFormData {
  email: string;
  password: string;
}

const signUp = ({ email, password }: RegisterFormData) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

// const signIn = ({email, password}: RegisterFormData) => {
//   return firebase.auth().signInWithEmailAndPassword(email, password);
// }

const Register = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, formState, setError } = useForm<
    RegisterFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data);
      history.push("/account/profile");
    } catch (error) {
      setError("email", "firebase", error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
        <h2>First, create your account</h2>
        <p>This will give you access to all sorts of events in Sparkle Town</p>
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
                // minLength: 8,
                pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{2,}$/,
              })}
            />
            <span
              className={`input-${
                errors.password && errors.password.type === "pattern"
                  ? "error"
                  : "info"
              }`}
            >
              Password must contain letters and numbers
            </span>
            {errors.password && errors.password.type === "required" && (
              <span className="input-error">Password is required</span>
            )}
            {/* {errors.password && errors.password.type === "minLength" && (
              <span className="input-info">
                Password must be at least 8 characters long
              </span>
            )} */}
          </div>
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Create account"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
