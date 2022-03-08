import React, { useCallback, useState } from "react";
import { useAsync } from "react-use";
import { useBackgroundGradient } from "components/attendee/useBackgroundGradient";

import { fetchCustomAuthConfig } from "api/auth";

import { SpaceWithId } from "types/id";

import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";
import { openUrl } from "utils/url";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { UseAnalyticsResult } from "hooks/useAnalytics";
import { useSAMLSignIn } from "hooks/useSAMLSignIn";

import { InitialForm } from "components/organisms/AuthenticationModal/InitialForm";
import { LoginForm } from "components/organisms/AuthenticationModal/LoginForm";
import { LoginFormData } from "components/organisms/AuthenticationModal/LoginForm/LoginForm";
import { PasswordResetForm } from "components/organisms/AuthenticationModal/PasswordResetForm";
import { RegisterForm } from "components/organisms/AuthenticationModal/RegisterForm";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFoundFallback } from "components/atoms/NotFoundFallback";

import SAMLLoginIcon from "assets/icons/saml-login-icon.png";

import styles from "./scss/Login.module.scss";

interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
  sovereignSpace?: SpaceWithId;
  analytics?: UseAnalyticsResult;
}

export const Login: React.FC<LoginProps> = ({
  formType = "initial",
  sovereignSpace,
  analytics,
}) => {
  const { world, space, spaceId, isLoading } = useWorldAndSpaceByParams();
  const [formToDisplay, setFormToDisplay] = useState(formType);

  const { signInWithSAML, hasSamlAuthProviderId } = useSAMLSignIn(
    sovereignSpace?.samlAuthProviderId
  );

  useBackgroundGradient();

  const {
    loading: isCustomAuthConfigLoading,
    value: customAuthConfig,
  } = useAsync(async () => {
    if (!spaceId) return;
    return tracePromise(
      "Login::fetchCustomAuthConfig",
      () => fetchCustomAuthConfig(spaceId),
      { attributes: { spaceId }, withDebugLog: true }
    );
  }, [spaceId]);

  const { customAuthName, customAuthConnectPath } = customAuthConfig ?? {};

  const hasCustomAuthConnect = isDefined(customAuthConnectPath);
  const signInWithCustomAuth = useCallback(() => {
    openUrl(
      `${customAuthConnectPath}?venueId=${spaceId}&returnOrigin=${window.location.origin}`
    );
  }, [customAuthConnectPath, spaceId]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!space || !world || !spaceId) {
    return <NotFoundFallback />;
  }

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

    analytics?.trackLogInEvent(data.email);
  };

  if (isCustomAuthConfigLoading) return <LoadingPage />;

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div className={styles.logoContainer}>
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
    </div>
  );
};
