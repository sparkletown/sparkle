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
  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);
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
              name="username"
              className="input-block input-centered"
              placeholder="Your Username"
              ref={register({ required: true })}
            />
            {errors.username && errors.username.type === "required" && (
              <span className="input-error">Username is required</span>
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
