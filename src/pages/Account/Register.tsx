import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import "./Account.scss";

interface RegisterFormData {
  email: string;
  password: string;
}

const Register = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, formState } = useForm<
    RegisterFormData
  >({
    mode: "onBlur",
  });
  const onSubmit = async (data: RegisterFormData) => {
    await alert("TODO: save account in Firebase");
    history.push("/account/profile");
  };

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
        <h2>Well done! Now create your party profile</h2>
        <p>Don't fret, you'll be able to edit it at any time later</p>
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
