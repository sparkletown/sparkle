import firebase from "firebase/app";
import React from "react";
import { useForm } from "react-hook-form";
import { CodeOfConductFormData } from "pages/Account/CodeOfConduct";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";

interface PropsType {
  displayLoginForm: () => void;
  displayPasswordResetForm: () => void;
  afterUserIsLoggedIn?: () => void;
  closeAuthenticationModal: () => void;
}

interface RegisterFormData {
  email: string;
  password: string;
  date_of_birth: string;
}

export interface CodeOfConductQuestion {
  name: keyof CodeOfConductFormData;
  text: string;
  link?: string;
}

export interface RegisterData {
  codes_used: string[];
  date_of_birth: string;
}

const CODE_OF_CONDUCT_QUESTIONS: CodeOfConductQuestion[] = [
  {
    name: "termsAndConditions",
    text: "I agree to SparkleVerse's Terms and Conditions",
    link: "https://sparklever.se/terms-and-conditions",
  },
  {
    name: "commonDecency",
    text:
      "I will endeavor not to create indecent experiences or content, and understand my actions may be subject to review and possible disciplinary action",
  },
];

const RegisterForm: React.FunctionComponent<PropsType> = ({
  displayLoginForm,
  displayPasswordResetForm,
  afterUserIsLoggedIn,
  closeAuthenticationModal,
}) => {
  const history = useHistory();

  const signUp = ({ email, password }: RegisterFormData) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    watch,
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data);
      afterUserIsLoggedIn && afterUserIsLoggedIn();
      closeAuthenticationModal();
      history.push(`/enter/step2`);
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
        <div className="input-group">
          <input
            name="date_of_birth"
            className="input-block input-centered"
            type="date"
            max={dayjs().subtract(18, "year").format("YYYY-MM-DD")}
            ref={register}
          />
          <span
            className={`input-${
              errors.date_of_birth && errors.date_of_birth.type === "pattern"
                ? "error"
                : "info"
            }`}
          >
            You must be at least 18 years old to continue
          </span>
          {errors.date_of_birth && errors.date_of_birth.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </div>
        {CODE_OF_CONDUCT_QUESTIONS.map((q) => (
          <div className="input-group" key={q.name}>
            <label
              htmlFor={q.name}
              className={`checkbox ${watch(q.name) && "checkbox-checked"}`}
            >
              {q.link && (
                <a href={q.link} target="_blank" rel="noopener noreferrer">
                  {q.text}
                </a>
              )}
              {!q.link && q.text}
            </label>
            <input
              type="checkbox"
              name={q.name}
              id={q.name}
              ref={register({
                required: true,
              })}
            />
            {/* @ts-ignore @debt questions should be typed if possible */}
            {q.name in errors && errors[q.name].type === "required" && (
              <span className="input-error">Required</span>
            )}
          </div>
        ))}
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Create account"
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

export default RegisterForm;
