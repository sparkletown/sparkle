import React from "react";
import { useForm } from "react-hook-form";

import "./Account.scss";

interface RegisterFormData {
  username: string;
  password: string;
}

const Register = () => {
  const { register, handleSubmit, errors, formState } = useForm<
    RegisterFormData
  >({
    mode: "onBlur",
  });
  const onSubmit = (data: RegisterFormData) => console.log(data);

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
        <h2>First, create your account</h2>
        <p>This will give you access to all sorts of events in Sparkle Town</p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <input
              name="username"
              className="input-block input-centered"
              placeholder="Your Email"
              ref={register({ required: true })}
            />
            {errors.username && errors.username.type === "required" && (
              <span className="input-info">Email is required</span>
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
                minLength: 8,
                pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/,
              })}
            />
            <span className="input-info">
              Password must contain letters and numbers
            </span>
            {errors.password && errors.password.type === "required" && (
              <span className="input-info">Password is required</span>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <span className="input-info">
                Password must be at least 8 characters long
              </span>
            )}
            {errors.password && errors.password.type === "pattern" && (
              <span className="input-info">
                Password must include letters and numbers
              </span>
            )}
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
