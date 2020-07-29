import React from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

interface PropsType {
  displayLoginForm: () => void;
  afterUserIsLoggedIn?: () => void;
  displaySaveCardForm: () => void;
}

interface RegisterFormData {
  email: string;
  password: string;
}

const RegisterForm: React.FunctionComponent<PropsType> = ({
  displayLoginForm,
  afterUserIsLoggedIn,
  displaySaveCardForm,
}) => {
  const signUp = ({ email, password }: RegisterFormData) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };
  const { register, handleSubmit, errors, formState, setError } = useForm<
    RegisterFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data);
      afterUserIsLoggedIn && afterUserIsLoggedIn();
      displaySaveCardForm();
    } catch (error) {
      setError("email", "firebase", error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Create an account!</h2>
      <div className="secondary-action">
        Already have an account?
        <br />
        <span className="link" onClick={displayLoginForm}>
          Login
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
        </div>
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Create account"
          disabled={!formState.isValid}
        />
      </form>
    </div>
  );
};

export default RegisterForm;
