import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import "./SecretPasswordForm.scss";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { venueInsideUrl } from "utils/url";

const SecretPasswordForm = ({ buttonText = "Join the party" }) => {
  const firebase = useFirebase();
  const history = useHistory();
  const { venueId } = useParams();

  const [invalidPassword, setInvalidPassword] = useState();
  const [error, setError] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();
  const [isAuthenticationModalOpen, setIsAuthenticationModalOpen] = useState(
    false
  );

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
        setIsAuthenticationModalOpen(true);
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
      <AuthenticationModal
        show={isAuthenticationModalOpen}
        onHide={() => setIsAuthenticationModalOpen(false)}
        afterUserIsLoggedIn={() => history.push(venueInsideUrl(venueId))}
        showAuth="register"
      />
    </>
  );
};

export default SecretPasswordForm;
