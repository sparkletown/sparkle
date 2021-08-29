import React, { useCallback, useState } from "react";

import { LoginFormRF } from "pages/RegistrationFlow/LoginFormRF";

import { ButtonRF } from "../ButtonRF";
import { InitialFormRF } from "../InitialFormRF";
import { LogoRF } from "../LogoRF";
import { PaneRF } from "../PaneRF";
import { PasswordResetFormRF } from "../PasswordResetFormRF";
import { RegisterFormRF } from "../RegisterFormRF";

import SAMLLoginIcon from "assets/icons/saml-login-icon.png";

import "./AuthFormRF.scss";

export type AuthFormRfType = "initial" | "login" | "register" | "reset";

export interface AuthFormRfProps {
  formType: AuthFormRfType;
  onCustomSignIn?: () => void;
  onSamlSignIn?: () => void;
  title?: string;
}

export const AuthFormRF: React.FC<AuthFormRfProps> = ({
  formType,
  onCustomSignIn,
  onSamlSignIn,
  title,
}) => {
  const [formToDisplay, setFormToDisplay] = useState<AuthFormRfType>(formType);
  const closeAuthenticationModal = useCallback(() => null, []);
  const redirectAfterLogin = useCallback(() => undefined, []);

  const displayLogin = useCallback(() => {
    setFormToDisplay("login");
  }, [setFormToDisplay]);

  const displayRegister = useCallback(() => {
    setFormToDisplay("register");
  }, [setFormToDisplay]);

  const displayReset = useCallback(() => {
    setFormToDisplay("reset");
  }, [setFormToDisplay]);

  const isSamlSignInAvailable = !!onSamlSignIn;
  const isCustomSignInAvailable = !!onCustomSignIn;

  return (
    <PaneRF className="AuthFormRF">
      <LogoRF />
      {(isSamlSignInAvailable || isCustomSignInAvailable) && (
        <div className="AuthFormRF__login-box mod--flex-col">
          <span>Quick log in with</span>

          <ButtonRF
            className="AuthFormRF__alternative-login mod--flex-row"
            iconOnly
          >
            {isCustomSignInAvailable && (
              <img
                className="AuthFormRF__quick-login-icon"
                src={SAMLLoginIcon}
                onClick={onCustomSignIn}
                title={title}
                alt={title}
              />
            )}
            {isSamlSignInAvailable && (
              <img
                className="AuthFormRF__quick-login-icon"
                src={SAMLLoginIcon}
                onClick={onSamlSignIn}
                title="SAML SSO login"
                alt="SAML SSO login"
              />
            )}
          </ButtonRF>
        </div>
      )}
      {formToDisplay === "initial" && (
        <InitialFormRF onLogin={displayLogin} onRegister={displayRegister} />
      )}
      {formToDisplay === "register" && (
        <RegisterFormRF
          onLogin={displayLogin}
          onReset={displayReset}
          onFinish={redirectAfterLogin}
          onClose={closeAuthenticationModal}
        />
      )}
      {formToDisplay === "login" && (
        <LoginFormRF
          onRegister={displayRegister}
          onReset={displayReset}
          onClose={closeAuthenticationModal}
          onFinish={redirectAfterLogin}
        />
      )}
      {formToDisplay === "reset" && (
        <PasswordResetFormRF onLogin={displayLogin} onFinish={displayLogin} />
      )}
    </PaneRF>
  );
};
