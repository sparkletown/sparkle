import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { InitialForm } from "./InitialForm";
import LoginForm from "./LoginForm";
import PasswordResetForm from "./PasswordResetForm";
import RegisterForm from "./RegisterForm";

import "./AuthenticationModal.scss";

export enum AuthOptions {
  login = "login",
  register = "register",
  passwordReset = "passwordReset",
  initial = "initial",
}

interface PropsType {
  show: boolean;
  onHide: () => void;
  afterUserIsLoggedIn?: () => void;
  showAuth: AuthOptions;
}

export const AuthenticationModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  afterUserIsLoggedIn,
  showAuth,
}) => {
  const [formToDisplay, setFormToDisplay] = useState(showAuth);

  const displayLoginForm = () => {
    setFormToDisplay(AuthOptions.login);
  };

  const displayRegisterForm = () => {
    setFormToDisplay(AuthOptions.register);
  };

  const displayPasswordResetForm = () => {
    setFormToDisplay(AuthOptions.passwordReset);
  };

  const closeAuthenticationModal = () => {
    setFormToDisplay(showAuth);
    onHide();
  };

  return (
    <Modal show={show} onHide={closeAuthenticationModal}>
      <div className="authentication-modal-container">
        {formToDisplay === "initial" && (
          <InitialForm
            displayLoginForm={displayLoginForm}
            displayRegisterForm={displayRegisterForm}
          />
        )}
        {formToDisplay === "register" && (
          <RegisterForm
            displayLoginForm={displayLoginForm}
            displayPasswordResetForm={displayPasswordResetForm}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
            closeAuthenticationModal={closeAuthenticationModal}
          />
        )}
        {formToDisplay === "login" && (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            displayPasswordResetForm={displayPasswordResetForm}
            closeAuthenticationModal={closeAuthenticationModal}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
          />
        )}
        {formToDisplay === "passwordReset" && (
          <PasswordResetForm
            displayLoginForm={displayLoginForm}
            closeAuthenticationModal={closeAuthenticationModal}
          />
        )}
      </div>
    </Modal>
  );
};
