import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { checkAccess } from "api/auth";

import { DEFAULT_PARTY_BUTTON_TEXT } from "settings";

import { setLocalStorageToken } from "utils/localStorage";
import { isTruthy } from "utils/types";

import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import "./SecretPasswordForm.scss";

export interface SecretPasswordFormProps {
  buttonText: string;
  onPasswordSubmit?: () => void;
  onPasswordSuccess?: () => void;
}

export interface SecretPasswordFormData {
  password: string;
}

export const SecretPasswordForm: React.FC<SecretPasswordFormProps> = ({
  buttonText = DEFAULT_PARTY_BUTTON_TEXT,
  onPasswordSubmit,
  onPasswordSuccess,
}) => {
  const { user } = useUser();
  const venueId = useVenueId();

  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearError,
  } = useForm<SecretPasswordFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const changePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage("");
      clearError();
    },
    [clearError]
  );

  const submitPassword = useCallback(
    async ({ password }) => {
      if (!venueId) return;

      setMessage("Checking password...");
      onPasswordSubmit && onPasswordSubmit();

      if (!user) {
        setMessage("");
        return;
      }

      await checkAccess({
        venueId,
        password,
      })
        .then((result) => {
          if (isTruthy(result?.data?.token)) {
            setLocalStorageToken(venueId, result.data.token);
            onPasswordSuccess && onPasswordSuccess();
            setMessage("Success!");
          } else {
            setMessage("");
            setError("password", "required", `Wrong password!`);
          }
        })
        .catch((error) => {
          setMessage(`Password error: ${error.toString()}`);
        });
    },
    [onPasswordSubmit, onPasswordSuccess, setError, user, venueId]
  );

  return (
    <form
      className="secret-password-form"
      onSubmit={handleSubmit(submitPassword)}
    >
      <p className="small-text">
        Got an invite? Join in with the secret password
      </p>
      <input
        className="secret-password-input"
        name="password"
        ref={register({ required: true })}
        placeholder="password"
        autoFocus
        onChange={changePassword}
        id="password"
      />
      <input
        className="btn btn-primary btn-block btn-centered"
        type="submit"
        value={buttonText}
      />
      <div className="form-group">{message}</div>
      {errors.password && errors.password.type === "required" && (
        <span className="input-error">Password is required</span>
      )}
    </form>
  );
};
