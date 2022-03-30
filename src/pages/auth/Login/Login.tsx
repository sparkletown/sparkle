import React, { useCallback, useState } from "react";
import { useAsync } from "react-use";
import { Button } from "components/attendee/Button";
import { Spacer } from "components/attendee/Spacer";

import { fetchCustomAuthConfig } from "api/auth";

import { SpaceId, SpaceWithId } from "types/id";

import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";
import { openUrl } from "utils/url";

import { UseAnalyticsResult } from "hooks/useAnalytics";
import { useSAMLSignIn } from "hooks/useSAMLSignIn";

import CN from "pages/auth/auth.module.scss";
import { InitialForm } from "pages/auth/InitialForm";
import { LoginForm, LoginFormData } from "pages/auth/LoginForm";
import { PasswordResetForm } from "pages/auth/PasswordResetForm";
import { RegisterForm } from "pages/auth/RegisterForm";

import { LoadingPage } from "components/molecules/LoadingPage";

import SAMLLoginIcon from "assets/icons/saml-login-icon.png";
import sparkleHeaderImage from "assets/images/sparkle-header.png";

export interface LoginProps {
  formType?: "initial" | "login" | "register" | "passwordReset";
  spaceId: SpaceId;
  sovereignSpace?: SpaceWithId;
  analytics?: UseAnalyticsResult;
}

export const Login: React.FC<LoginProps> = ({
  formType = "initial",
  spaceId,
  sovereignSpace,
  analytics,
}) => {
  const [formToDisplay, setFormToDisplay] = useState(formType);

  const { signInWithSAML, hasSamlAuthProviderId } = useSAMLSignIn(
    sovereignSpace?.samlAuthProviderId
  );

  const {
    loading: isCustomAuthConfigLoading,
    value: customAuthConfig,
  } = useAsync(async () => {
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
    <div data-bem="Login" className={CN.login}>
      <div data-bem="Login__logo" className={CN.logo}>
        <Spacer marginSize="none">
          <img src={sparkleHeaderImage} alt="" width="100%" />
        </Spacer>
      </div>
      <div data-bem="Login__contents" className={CN.contents}>
        {hasAlternativeLogins && (
          <div data-bem="Login__alternatives">
            <span>Quick log in with</span>

            <Button>
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
            </Button>
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
