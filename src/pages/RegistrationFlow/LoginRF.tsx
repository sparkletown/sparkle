import React, { useCallback } from "react";
import { useAsync } from "react-use";

import { fetchCustomAuthConfig } from "api/auth";

import { tracePromise } from "utils/performance";
import { isDefined } from "utils/types";
import { openUrl } from "utils/url";

import { useSAMLSignIn } from "hooks/useSAMLSignIn";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useVenueId } from "hooks/useVenueId";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AuthFormRfType } from "./AuthFormRF/AuthFormRF";
import { AuthFormRF } from "./AuthFormRF";

export interface LoginRfProps {
  formType?: AuthFormRfType;
  venueId: string;
}

// NOTE: Login serves as a facade for the various forms and as a provider of utilities for them
export const LoginRF: React.FC<LoginRfProps> = ({
  formType = "initial",
  venueId: venueIdFromProps,
}) => {
  const venueIdFromHook = useVenueId();
  const venueId = venueIdFromProps ?? venueIdFromHook;
  const { sovereignVenue } = useSovereignVenue({
    venueId,
  });
  const { signInWithSAML, hasSamlAuthProviderId } = useSAMLSignIn(
    sovereignVenue?.samlAuthProviderId
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
          venueId1: venueId,
        },
        withDebugLog: true,
      }
    );
  }, [venueId]);

  const { customAuthName, customAuthConnectPath } = customAuthConfig ?? {};

  const signInWithCustomAuth = useCallback(() => {
    openUrl(
      `${customAuthConnectPath}?venueId=${venueId}&returnOrigin=${window.location.origin}`
    );
  }, [customAuthConnectPath, venueId]);

  return isCustomAuthConfigLoading ? (
    <LoadingPage />
  ) : (
    <AuthFormRF
      formType={formType}
      onCustomSignIn={
        isDefined(customAuthConnectPath) ? signInWithCustomAuth : undefined
      }
      title={customAuthName}
      onSamlSignIn={hasSamlAuthProviderId ? signInWithSAML : undefined}
    />
  );
};
