import React, { useCallback, useState } from "react";
import { useAsync } from "react-use";

import { fetchCustomAuthConfig } from "api/auth";

import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";
import { openUrl } from "utils/url";

import { useAnalytics } from "hooks/useAnalytics";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSAMLSignIn } from "hooks/useSAMLSignIn";

import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";
import LoginForm from "components/organisms/AuthenticationModal/LoginForm";
import { LoginFormData } from "components/organisms/AuthenticationModal/LoginForm/LoginForm";
import PasswordResetForm from "components/organisms/AuthenticationModal/PasswordResetForm";
import RegisterForm from "components/organisms/AuthenticationModal/RegisterForm";

import { LoadingPage } from "components/molecules/LoadingPage";

import SAMLLoginIcon from "assets/icons/saml-login-icon.png";

// @debt move all styles into `Login.scss`;
import "./Account.scss";
import "./Login.scss";

export interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
  venueId: string;
}

export const Login: React.FC<LoginProps> = ({
  formType = "initial",
  venueId,
}) => {
  const { currentVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });
  const [formToDisplay, setFormToDisplay] = useState(formType);
  const analytics = useAnalytics({ venue: currentVenue });

  const { signInWithSAML, hasSamlAuthProviderId } = useSAMLSignIn(
    currentVenue?.samlAuthProviderId
  );

  const {
    loading: isCustomAuthConfigLoading,
    value: customAuthConfig,
  } = useAsync(async () => {
    return tracePromise(
      "Login::fetchCustomAuthConfig",
      () => fetchCustomAuthConfig(venueId),
      {
        attributes: {
          venueId,
        },
        withDebugLog: true,
      }
    );
  }, [venueId]);

  const { customAuthName, customAuthConnectPath } = customAuthConfig ?? {};

  const hasCustomAuthConnect = isDefined(customAuthConnectPath);
  const signInWithCustomAuth = useCallback(() => {
    openUrl(
      `${customAuthConnectPath}?venueId=${venueId}&returnOrigin=${window.location.origin}`
    );
  }, [customAuthConnectPath, venueId]);

  const hasAlternativeLogins = hasSamlAuthProviderId || hasCustomAuthConnect;

  const displayLoginForm = () => {
    setFormToDisplay("login");
  };

  const displayRegisterForm = () => {
    setFormToDisplay("register");
  };

  const displayPasswordResetForm = () => {
    setFormToDisplay("passwordReset");
  };

  const afterUserIsLoggedIn = (data?: LoginFormData) => {
    if (!data) return;

    analytics.trackLogInEvent(data.email);
  };

  if (isCustomAuthConfigLoading) return <LoadingPage />;

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/sparkle-header.png" alt="" width="100%" />
      </div>
      <div className="auth-form-container">
        {hasAlternativeLogins && (
          <div className="Login__login-box">
            <span>Quick log in with</span>

            <button className="Login__alternative-logins">
              {hasCustomAuthConnect && (
                <img
                  className="Login__quick-login-icon"
                  src={SAMLLoginIcon}
                  onClick={signInWithCustomAuth}
                  title={customAuthName}
                  alt={customAuthName}
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
            </button>
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
          />
        )}
        {formToDisplay === "login" && (
          <LoginForm
            displayRegisterForm={displayRegisterForm}
            displayPasswordResetForm={displayPasswordResetForm}
            afterUserIsLoggedIn={afterUserIsLoggedIn}
          />
        )}
        {formToDisplay === "passwordReset" && (
          <PasswordResetForm displayLoginForm={displayLoginForm} />
        )}
      </div>
    </div>
  );
};

export default Login;
