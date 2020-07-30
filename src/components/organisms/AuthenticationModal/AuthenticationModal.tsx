import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthenticationModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  afterUserIsLoggedIn?: () => void;
  showAuth: "login" | "register";
}

const AuthenticationModal: React.FunctionComponent<PropsType> = ({
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

  const closeAuthenticationModal = () => {
    setFormToDisplay(showAuth);
    onHide();
  };

  return (
    <Modal show={show} onHide={closeAuthenticationModal}>
      <div className="authentication-modal-container">
        {formToDisplay === "register" && (
          <RegisterForm
            displayLoginForm={displayLoginForm}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
            closeAuthenticationModal={closeAuthenticationModal}
          />
        )}
        {formToDisplay === "login" && (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            closeAuthenticationModal={closeAuthenticationModal}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthenticationModal;
