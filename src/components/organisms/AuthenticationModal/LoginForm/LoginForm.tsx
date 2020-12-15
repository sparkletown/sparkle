import React from "react";
import { useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { default as _firebase } from "firebase/app";
import { TicketCodeField } from "components/organisms/TicketCodeField";
import { useSelector } from "hooks/useSelector";
import { venueSelector } from "utils/selectors";
import { VenueAccessType } from "types/VenueAcccess";
import { localStorageTokenKey } from "utils/localStorage";

interface PropsType {
  displayRegisterForm: () => void;
  displayPasswordResetForm: () => void;
  closeAuthenticationModal: () => void;
  afterUserIsLoggedIn?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
  code: string;
  backend?: string;
}

const LoginForm: React.FunctionComponent<PropsType> = ({
  displayRegisterForm,
  displayPasswordResetForm,
  closeAuthenticationModal,
  afterUserIsLoggedIn,
}) => {
  const firebase = useFirebase();

  const venue = useSelector(venueSelector);
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearError,
  } = useForm<LoginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  if (!venue) return null;

  const clearBackendErrors = () => {
    clearError("backend");
  };

  const signIn = ({ email, password }: LoginFormData) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!venue) return;
    try {
      if (venue.access?.includes(VenueAccessType.CodeList)) {
        const result = await _firebase
          .functions()
          .httpsCallable("access-checkAccess")({
          venueId: venue.id,
          code: data.code,
        });
        localStorage.setItem(localStorageTokenKey(venue.id), result.data.token);
      }
      if (venue.access?.includes(VenueAccessType.EmailList)) {
        const result = await _firebase
          .functions()
          .httpsCallable("access-checkAccess")({
          venueId: venue.id,
          email: data.email,
        });
        localStorage.setItem(localStorageTokenKey(venue.id), result.data.token);
      }

      await signIn(data);

      afterUserIsLoggedIn && afterUserIsLoggedIn();

      closeAuthenticationModal();
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
        {`Don't have an account yet?`}
        <br />
        <span className="link" onClick={displayRegisterForm}>
          Register instead!
        </span>
      </div>

      <h2>Log in</h2>

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
            })}
          />
          {errors.password && errors.password.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </div>

        {venue.access?.includes(VenueAccessType.CodeList) && (
          <TicketCodeField register={register} error={errors?.code} />
        )}

        {errors.backend && (
          <span className="input-error">{errors.backend.message}</span>
        )}

        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value="Log in"
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

export default LoginForm;
