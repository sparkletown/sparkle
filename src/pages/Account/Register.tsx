import React from "react";
import { useForm } from "react-hook-form";

import "./Register.scss";

interface RegisterFormData {
  username: string;
  password: string;
}

const Register = () => {
  const { register, handleSubmit, errors } = useForm<
    RegisterFormData
  >({
    mode: "onBlur",
  });
  const onSubmit = (data: RegisterFormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <input
        name="username"
        placeholder="Username"
        ref={register({ required: true })}
      />
      {errors.username && errors.username.type === "required" && (
        <span>Required</span>
      )}

      <input
        name="password"
        type="password"
        placeholder="Password"
        ref={register({
          required: true,
          minLength: 8,
          pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/,
        })}
      />
      {errors.password && errors.password.type === "required" && (
        <span>Required</span>
      )}
      {errors.password && errors.password.type === "minLength" && (
        <span>Must be at least 8 characters long</span>
      )}
      {errors.password && errors.password.type === "pattern" && (
        <span>Must include a letter and a number</span>
      )}
      <input type="submit" />
    </form>
  );
};

export default Register;
