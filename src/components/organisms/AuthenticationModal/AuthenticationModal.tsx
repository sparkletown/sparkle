import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SaveCardComponent from "./SaveCardForm";
import "./AuthenticationModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  afterUserIsLoggedIn?: () => void;
  showLogin?: boolean;
}

const AuthenticationModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  afterUserIsLoggedIn,
  showLogin,
}) => {
  const [showRegisterForm, setShowRegisterForm] = useState(!showLogin);
  const [showSaveCardForm, setShowSaveCardForm] = useState(false);

  const displayLoginForm = () => {
    setShowRegisterForm(false);
  };

  const displayRegisterForm = () => {
    setShowRegisterForm(true);
  };

  const displaySaveCardForm = () => {
    setShowRegisterForm(false);
    setShowSaveCardForm(true);
  };

  const closeAuthenticationModal = () => {
    setShowRegisterForm(!showLogin);
    setShowSaveCardForm(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={closeAuthenticationModal}>
      <div className="authentication-modal-container">
        {showRegisterForm && (
          <RegisterForm
            displayLoginForm={displayLoginForm}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
            displaySaveCardForm={displaySaveCardForm}
          />
        )}
        {!showRegisterForm && !showSaveCardForm && (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            closeAuthenticationModal={closeAuthenticationModal}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
          />
        )}
        {showSaveCardForm && (
          <SaveCardComponent
            closeAuthenticationModal={closeAuthenticationModal}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthenticationModal;
