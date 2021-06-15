import React, { useState } from "react";

import { SSO_LOGIN_ICON } from "settings";

import { useSSO } from "hooks/useSSO";

import LoginForm from "components/organisms/AuthenticationModal/LoginForm";
import PasswordResetForm from "components/organisms/AuthenticationModal/PasswordResetForm";
import RegisterForm from "components/organisms/AuthenticationModal/RegisterForm";
import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";

import "./Account.scss";
import "./Login.scss";

export interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
}

export const Login: React.FC<LoginProps> = ({ formType = "initial" }) => {
  const [formToDisplay, setFormToDisplay] = useState(formType);

  const { signInSSO, hasSSOProvider } = useSSO();
  // It will be extended with addition of new providers
  const hasAlternativeLogins = hasSSOProvider;

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

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/sparkle-header.png" alt="" width="100%" />
      </div>
      <div className="auth-form-container">
        {hasAlternativeLogins && (
          <div className="Login__login-box">
            <span>Quick log in with</span>

            <div className="Login__alternative-logins">
              {hasSSOProvider && (
                <img
                  className="Login__sso-login"
                  src={SSO_LOGIN_ICON}
                  onClick={signInSSO}
                  alt="SSO login"
                />
              )}
            </div>
          </div>
        )}
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
