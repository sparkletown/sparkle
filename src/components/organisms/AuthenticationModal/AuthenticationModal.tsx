import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthenticationModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  afterUserIsLoggedIn?: () => void;
}

const AuthenticationModal: React.FunctionComponent<PropsType> = ({
  show,
  onHide,
  afterUserIsLoggedIn,
}) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const displayLoginForm = () => setShowRegisterForm(false);
  const displayRegisterForm = () => setShowRegisterForm(true);
  return (
    <Modal show={show} onHide={onHide}>
      <div className="authentication-modal-container">
        {showRegisterForm ? (
          <RegisterForm
            displayLoginForm={displayLoginForm}
            closeAuthenticationModal={onHide}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
          />
        ) : (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            closeAuthenticationModal={onHide}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthenticationModal;
