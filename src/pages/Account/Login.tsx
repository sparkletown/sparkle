import React, { useCallback, useState } from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrl } from "utils/url";

import { useSAMLSignIn } from "hooks/useSAMLSignIn";

import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";
import LoginForm from "components/organisms/AuthenticationModal/LoginForm";
import PasswordResetForm from "components/organisms/AuthenticationModal/PasswordResetForm";
import RegisterForm from "components/organisms/AuthenticationModal/RegisterForm";

import SAMLLoginIcon from "assets/icons/saml-login-icon.png";

// @debt move all styles into `Login.scss`;
import "./Account.scss";
import "./Login.scss";

export interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
  venue: WithId<AnyVenue>;
}

export const Login: React.FC<LoginProps> = ({
  formType = "initial",
  venue,
}) => {
  const [formToDisplay, setFormToDisplay] = useState(formType);

  const { signInWithSAML, hasSamlAuthProviderId } = useSAMLSignIn(
    venue.samlAuthProviderId
  );

  // TODO: implement this check properly + probably using a backend function that also returns this URL
  const hasI4AOAuth = true;
  const signInWithI4AOAuth = useCallback(() => {
    openUrl(
      `/auth/connect/i4a?venueId=${venue.id}&returnOrigin=${window.location.origin}`
    );
  }, [venue.id]);

  // It will be extended with addition of new providers
  const hasAlternativeLogins = hasSamlAuthProviderId || hasI4AOAuth;

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
              {hasI4AOAuth && (
                <img
                  className="Login__quick-login-icon"
                  src={SAMLLoginIcon}
                  onClick={signInWithI4AOAuth}
                  title="I4A OAuth"
                  alt="I4A OAuth"
                />
              )}
              {hasSamlAuthProviderId && (
                <img
                  className="Login__quick-login-icon"
                  src={SAMLLoginIcon}
                  onClick={signInWithSAML}
                  title="SAML SSO login"
                  alt="SAML SSO login"
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
