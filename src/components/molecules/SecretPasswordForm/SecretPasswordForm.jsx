import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import "./SecretPasswordForm.scss";

import { PARTY_NAME } from "config";

const SecretPasswordForm = () => {
  const firebase = useFirebase();

  const history = useHistory();

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
    checkPassword({ config: PARTY_NAME, password: password })
      .then(() => {
        setInvalidPassword(false);
        setMessage("Password OK! Proceeding...");

        firebase
          .auth()
          .signInAnonymously()
          .then(() => history.push("/account/register"))
          .catch((error) => {
            setError(true);
          });
      })
      .catch(() => {
        setInvalidPassword(true);
        setMessage(null);
      });
  }

  return (
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
        value="Join the party"
      />
      <div className="form-group">
        {message && <small>{message}</small>}
        {invalidPassword && (
          <small className="error-message">Wrong password!</small>
        )}
        {error && <small className="error-message">An error occured</small>}
      </div>
    </form>
  );
};

export default SecretPasswordForm;
