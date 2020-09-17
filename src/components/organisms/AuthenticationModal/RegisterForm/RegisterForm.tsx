import firebase from "firebase/app";
import React from "react";
import { useForm } from "react-hook-form";
import { CodeOfConductFormData } from "pages/Account/CodeOfConduct";
import { useHistory, useParams } from "react-router-dom";
import { CODE_CHECK_URL } from "secrets";
import axios from "axios";
import dayjs from "dayjs";
import { updateUserPrivate } from "pages/Account/helpers";
import { IS_BURN } from "secrets";
import { TICKET_URL } from "settings";

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
  const { venueId } = useParams();

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
      if (IS_BURN) await axios.get(CODE_CHECK_URL + data.email);
      const auth = await signUp(data);
      if (IS_BURN && auth.user) {
        updateUserPrivate(auth.user.uid, {
          codes_used: [data.email],
          date_of_birth: data.date_of_birth,
        });
      }
      afterUserIsLoggedIn && afterUserIsLoggedIn();
      closeAuthenticationModal();
      history.push(
        IS_BURN ? "/enter/step2" : `/account/questions?venueId=${venueId}`
      );
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
        {IS_BURN && (
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
            {errors.date_of_birth &&
              errors.date_of_birth.type === "required" && (
                <span className="input-error">Date of birth is required</span>
              )}
          </div>
        )}
        {IS_BURN &&
          CODE_OF_CONDUCT_QUESTIONS.map((q) => (
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
