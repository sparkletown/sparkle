import React, { ChangeEventHandler, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { checkAccess } from "api/auth";

import { venueEntranceUrl } from "utils/url";
import { setLocalStorageToken } from "utils/localStorage";
import { isDefined, isTruthy } from "utils/types";

import { useVenueId } from "hooks/useVenueId";

import "./SecretPasswordForm.scss";

const SecretPasswordForm = ({ buttonText = "Join the party" }) => {
  const history = useHistory();
  const venueId = useVenueId();

  const [error, setError] = useState(false);
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>();

  const passwordChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);

    if (message !== "") {
      setMessage("");
    }

    if (error) {
      setError(false);
    }
  };

  // @debt replace this with useAsync / useAsyncFn
  const passwordSubmitted = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isDefined(venueId)) {
        setMessage("Missing venueId");
        setError(true);
        return;
      }

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
            setError(true);
          }
        })
        .catch((err) => {
          setMessage(`Password error: ${err.toString()}`);
          setError(true);
        });
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
