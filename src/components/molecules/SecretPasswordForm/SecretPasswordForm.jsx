import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { venueEntranceUrl } from "utils/url";
import { checkAccess, setLocalStorageToken } from "utils/localStorage";

import { useVenueId } from "hooks/useVenueId";

import "./SecretPasswordForm.scss";

const SecretPasswordForm = ({ buttonText = "Join the party" }) => {
  const history = useHistory();
  const venueId = useVenueId();

  const [invalidPassword, setInvalidPassword] = useState();
  const [error, setError] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();

  function passwordChanged(e) {
    setPassword(e.target.value);
    setInvalidPassword(false);
    setError(false);
  }

  const passwordSubmitted = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage("Checking password...");

      try {
        const result = await checkAccess({
          venueId,
          password,
        });
        setLocalStorageToken(venueId, result.data.token);

        setInvalidPassword(false);
        setMessage("Password OK! Proceeding...");
        history.push(venueEntranceUrl(venueId));
      } catch (error) {
        setInvalidPassword(true);
        setMessage(`Password error: ${error.toString()}`);
      }
    },
    [history, password, venueId]
  );

  return (
    <>
      <form className="secret-password-form" onSubmit={passwordSubmitted}>
        <p className="small-text">
          Got an invite? Join in with the secret password
        </p>
        <input
          className={
            "secret-password-input " + (invalidPassword ? " is-invalid" : "")
          }
          required
          placeholder="password"
          autoFocus
          onChange={passwordChanged}
          id="password"
        />
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value={buttonText}
        />
        <div className="form-group">
          {message && <small>{message}</small>}
          {invalidPassword && (
            <small className="error-message">Wrong password!</small>
          )}
          {error && <small className="error-message">An error occured</small>}
        </div>
      </form>
    </>
  );
};

export default SecretPasswordForm;
