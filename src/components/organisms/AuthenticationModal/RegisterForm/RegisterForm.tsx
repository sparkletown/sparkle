import firebase from "firebase/app";
import React from "react";
import { useForm } from "react-hook-form";
import { CodeOfConductFormData } from "pages/Account/CodeOfConduct";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { updateUserPrivate } from "pages/Account/helpers";
import { useSelector } from "hooks/useSelector";
import { codeCheckUrl } from "utils/url";
import { DateOfBirthField } from "components/organisms/DateOfBirthField";
import { TicketCodeField } from "components/organisms/TicketCodeField";
import { venueSelector } from "utils/selectors";

interface PropsType {
  displayLoginForm: () => void;
  displayPasswordResetForm: () => void;
  afterUserIsLoggedIn?: () => void;
  closeAuthenticationModal: () => void;
}

interface RegisterFormData {
  email: string;
  password: string;
  code: string;
  date_of_birth: string;
  backend?: string;
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

const RegisterForm: React.FunctionComponent<PropsType> = ({
  displayLoginForm,
  displayPasswordResetForm,
  afterUserIsLoggedIn,
  closeAuthenticationModal,
}) => {
  const history = useHistory();
  const venue = useSelector(venueSelector);

  const signUp = ({ email, password }: RegisterFormData) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearError,
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const clearBackendErrors = () => {
    clearError("backend");
  };

  if (!venue) {
    return <>Loading...</>;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (venue.requiresTicketCode) await axios.get(codeCheckUrl(data.code));
      if (venue.requiresEmailVerification)
        await axios.get(codeCheckUrl(data.email));

      const auth = await signUp(data);
      if (
        auth.user &&
        (venue.requiresTicketCode || venue.requiresEmailVerification)
      ) {
        updateUserPrivate(auth.user.uid, {
          codes_used: [data.email],
          date_of_birth: data.date_of_birth,
        });
      }

      afterUserIsLoggedIn && afterUserIsLoggedIn();

      closeAuthenticationModal();

      const accountProfileUrl = `/account/profile${
        venue.id ? `?venueId=${venue.id}` : ""
      }`;

      history.push(accountProfileUrl);
    } catch (error) {
      if (error.response?.status === 404) {
        setError(
          "email",
          "validation",
          `Email ${data.email} does not have a ticket; get your ticket at ${venue.ticketUrl}`
        );
      } else if (error.response?.status >= 500) {
        setError(
          "email",
          "validation",
          `Error checking ticket: ${error.message}`
        );
      } else {
        setError("backend", "firebase", error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <div className="secondary-action">
        Already have an account?
        <br />
        <span className="link" onClick={displayLoginForm}>
          Login
        </span>
      </div>

      <h2>Create an account!</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
        className="form"
      >
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
          {errors.email &&
            ["firebase", "validation"].includes(errors.email.type) && (
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
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
            })}
          />

          <span
            className={`input-${
              errors.password && errors.password.type === "pattern"
                ? "error"
                : "info"
            }`}
          >
            Password must contain letters, numbers, and be at least 6 characters
            long
          </span>

          {errors.password && errors.password.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </div>

        {venue.requiresTicketCode && (
          <TicketCodeField register={register} error={errors?.code} />
        )}

        {venue.requiresDateOfBirth && (
          <DateOfBirthField register={register} error={errors?.date_of_birth} />
        )}

        {errors.backend && (
          <span className="input-error">{errors.backend.message}</span>
        )}

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
