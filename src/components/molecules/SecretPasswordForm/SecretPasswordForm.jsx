import React, { useState } from "react";
import firebase from "firebase/app";

import { useVenueId } from "hooks/useVenueId";

import "./SecretPasswordForm.scss";

const SecretPasswordForm = ({ buttonText = "Join the party", onSuccess }) => {
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

  function passwordSubmitted(e) {
    e.preventDefault();
    setMessage("Checking password...");

    const checkPassword = firebase.functions().httpsCallable("checkPassword");
    checkPassword({ venue: venueId, password: password })
      .then(() => {
        setInvalidPassword(false);
        setMessage("Password OK! Proceeding...");
        onSuccess();
      })
      .catch(() => {
        setInvalidPassword(true);
        setMessage(null);
      });
  }

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
