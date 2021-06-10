import React, { FC, useState } from "react";

import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";
import LoginForm from "components/organisms/AuthenticationModal/LoginForm";
import PasswordResetForm from "components/organisms/AuthenticationModal/PasswordResetForm";
import RegisterForm from "components/organisms/AuthenticationModal/RegisterForm";
import "./Account.scss";

interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
}

export const Login: FC<LoginProps> = ({ formType = "initial" }) => {
  const [formToDisplay, setFormToDisplay] = useState(formType);

  const displayLoginForm = () => {
    setFormToDisplay("login");
  };

  const displayRegisterForm = () => {
    setFormToDisplay("register");
  };

  const displayPasswordResetForm = () => {
    setFormToDisplay("passwordReset");
  };

  const redirectAfterLogin = () => {};

  // TODO: Figure out the best way to incorporate SSO signon here (eg. via OAuth2 redirect flows)

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/sparkle-header.png" alt="" width="100%" />
      </div>
      <div className="auth-form-container">
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
            afterUserIsLoggedIn={redirectAfterLogin}
            closeAuthenticationModal={() => null}
          />
        )}
        {formToDisplay === "login" && (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            displayPasswordResetForm={displayPasswordResetForm}
            closeAuthenticationModal={() => null}
            afterUserIsLoggedIn={redirectAfterLogin}
          />
        )}
        {formToDisplay === "passwordReset" && (
          <PasswordResetForm
            displayLoginForm={displayLoginForm}
            closeAuthenticationModal={redirectAfterLogin}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
