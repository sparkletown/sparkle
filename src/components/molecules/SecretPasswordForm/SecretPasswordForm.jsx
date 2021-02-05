import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { checkAccess } from "api/auth";

import { venueEntranceUrl } from "utils/url";
import { setLocalStorageToken } from "utils/localStorage";
import { isTruthy } from "utils/types";

import { useVenueId } from "hooks/useVenueId";

import "./SecretPasswordForm.scss";

const SecretPasswordForm = ({ buttonText = "Join the party" }) => {
  const history = useHistory();
  const venueId = useVenueId();

  const [error, setError] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();

  function passwordChanged(e) {
    setPassword(e.target.value);
    setMessage("");
    setError(false);
  }

  const passwordSubmitted = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage("Checking password...");

      await checkAccess({
        venueId,
        password,
      })
        .then((result) => {
          if (isTruthy(result?.data?.token)) {
            setLocalStorageToken(venueId, result.data.token);
            history.push(venueEntranceUrl(venueId));
          } else {
            setMessage(`Wrong password!`);
          }
        })
        .catch(() => {
          setMessage(`Password error: ${error.toString()}`);
        });
    },
    [error, history, password, venueId]
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
          {error && <small className="error-message">An error occured</small>}
        </div>
      </form>
    </>
  );
};

export default SecretPasswordForm;
