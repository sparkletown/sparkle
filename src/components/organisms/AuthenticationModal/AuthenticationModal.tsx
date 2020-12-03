import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./AuthenticationModal.scss";
import { InitialForm } from "./InitialForm";
import LoginForm from "./LoginForm";
import PasswordResetForm from "./PasswordResetForm";
import RegisterForm from "./RegisterForm";

interface PropsType {
  show: boolean;
  onHide: () => void;
  afterUserIsLoggedIn?: () => void;
  showAuth: "login" | "register" | "passwordReset" | "initial";
}

export const AuthenticationModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  afterUserIsLoggedIn,
  showAuth,
}) => {
  const [formToDisplay, setFormToDisplay] = useState(showAuth);

  const displayLoginForm = () => {
    setFormToDisplay("login");
  };

  const displayRegisterForm = () => {
    setFormToDisplay("register");
  };

  const displayPasswordResetForm = () => {
    setFormToDisplay("passwordReset");
  };

  const closeAuthenticationModal = () => {
    setFormToDisplay(showAuth);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={closeAuthenticationModal}
      backdropClassName="authentication-modal-backdrop"
    >
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

/**
 * @deprecated use named export instead
 */
export default AuthenticationModal;
