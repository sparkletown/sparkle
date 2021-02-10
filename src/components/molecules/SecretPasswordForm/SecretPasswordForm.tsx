import React, { useCallback, useState } from "react";

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

export const SecretPasswordForm: React.FC<SecretPasswordFormProps> = ({
  buttonText = DEFAULT_PARTY_BUTTON_TEXT,
  onPasswordSubmit,
  onPasswordSuccess,
}) => {
  const { user } = useUser();
  const venueId = useVenueId();

  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const changePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMessage("");
      setError(false);
    },
    []
  );

  const passwordSubmitted = useCallback(
    async (e) => {
      if (!venueId) return;

      e.preventDefault();
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
            setMessage("Wrong password!");
          }
        })
        .catch(() => {
          setMessage(`Password error: ${error.toString()}`);
        });
    },
    [error, onPasswordSubmit, onPasswordSuccess, password, user, venueId]
  );

  return (
    <>
      <form className="secret-password-form" onSubmit={passwordSubmitted}>
        <p className="small-text">
          Got an invite? Join in with the secret password
        </p>
        <input
          className="secret-password-input"
          required
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
        <div className="form-group">
          {message && <small>{message}</small>}
          {error && <small className="error-message">An error occured</small>}
        </div>
      </form>
    </>
  );
};
