import React, { useCallback, useState } from "react";
import { useAsync } from "react-use";

import { AnyVenue } from "types/venues";

import { fetchCustomAuthConfig } from "api/auth";

import { WithId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";
import { openUrl } from "utils/url";

import { useSAMLSignIn } from "hooks/useSAMLSignIn";
import { useSovereignVenueId } from "hooks/useSovereignVenueId";

import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";
import LoginForm from "components/organisms/AuthenticationModal/LoginForm";
import PasswordResetForm from "components/organisms/AuthenticationModal/PasswordResetForm";
// import RegisterForm from "components/organisms/AuthenticationModal/RegisterForm";

import { LoadingPage } from "components/molecules/LoadingPage";

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
  const venueId = venue.id;

  const { sovereignVenueId, isSovereignVenueIdLoading } = useSovereignVenueId({
    venueId,
  });

  const [formToDisplay, setFormToDisplay] = useState(formType);

  const { signInWithSAML, hasSamlAuthProviderId } = useSAMLSignIn(
    venue.samlAuthProviderId
  );

  const {
    loading: isCustomAuthConfigLoading,
    value: customAuthConfig,
  } = useAsync(async () => {
    if (!sovereignVenueId) return;

    return tracePromise(
      "Login::fetchCustomAuthConfig",
      () => fetchCustomAuthConfig(sovereignVenueId),
      {
        attributes: {
          venueId,
          sovereignVenueId,
        },
        withDebugLog: true,
      }
    );
  }, [venueId, sovereignVenueId]);

  const { customAuthName, customAuthConnectPath } = customAuthConfig ?? {};

  const hasCustomAuthConnect = isDefined(customAuthConnectPath);
  const signInWithCustomAuth = useCallback(() => {
    openUrl(
      `${customAuthConnectPath}?venueId=${sovereignVenueId}&returnOrigin=${window.location.origin}`
    );
  }, [customAuthConnectPath, sovereignVenueId]);

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

  const redirectAfterLogin = () => {};

  const isLoading = isSovereignVenueIdLoading || isCustomAuthConfigLoading;

  if (isLoading) return <LoadingPage />;

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
            </div>
          </div>
        )}
        {/* @debt Changed for OHBM SSO */}
        {["initial", "register"].includes(formToDisplay) && (
          <InitialForm
            displayLoginForm={displayLoginForm}
            displayRegisterForm={displayRegisterForm}
          />
        )}
        {/* @debt Removed for OHBM SSO */}
        {/*{formToDisplay === "register" && (*/}
        {/*  <RegisterForm*/}
        {/*    displayLoginForm={displayLoginForm}*/}
        {/*    displayPasswordResetForm={displayPasswordResetForm}*/}
        {/*    afterUserIsLoggedIn={redirectAfterLogin}*/}
        {/*    closeAuthenticationModal={() => null}*/}
        {/*  />*/}
        {/*)}*/}
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
