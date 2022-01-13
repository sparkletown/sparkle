import React, { useEffect } from "react";
import { withRequired } from "components/hocs/withRequired";
import { addToBugsnagEventOnError } from "core/bugsnag";
import { compose } from "lodash/fp";
import LogRocket from "logrocket";

import { BUILD_SHA1, LOGROCKET_APP_ID } from "secrets";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useAnalytics } from "hooks/useAnalytics";
import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage";

if (LOGROCKET_APP_ID) {
  LogRocket.init(LOGROCKET_APP_ID, {
    release: BUILD_SHA1,
  });

  addToBugsnagEventOnError((event) => {
    event.addMetadata("logrocket", "sessionUrl", LogRocket.sessionURL);
  });
}

type CheckProps = { space: WithId<AnyVenue> };
type AnalyticsCheckProps = Partial<CheckProps>;

const Check: React.FC<CheckProps> = ({ space, children }) => {
  console.log(Check.name, "rendering...");
  const analytics = useAnalytics({ venue: space });
  const { authError, profileError, userId, user, profile, isLoading } =
    useUser();

  if (authError || profileError) {
    // @debt use more sophisticated tracking here, like Bugsnag
    console.error(AnalyticsCheck.name, authError, profileError);
  }

  useEffect(() => void analytics.initAnalytics(), [analytics]);

  useEffect(() => {
    if (!user || !profile || !userId) return;

    const displayName = user.displayName || "N/A";
    const email = user.email || "N/A";

    if (LOGROCKET_APP_ID) {
      LogRocket.identify(userId, { displayName, email });
    }

    analytics.identifyUser({ email, name: profile?.partyName });
  }, [analytics, user, userId, profile]);

  // NOTE: can use the else statement for displaying error or redirecting to login?
  // return authData.signedIn ? <>{children}</> : <>{children}</>;

  return isLoading ? <LoadingPage /> : <>{children}</>;
};

const withFetch =
  () =>
  (Component: React.FC<AnalyticsCheckProps>): React.FC<AnalyticsCheckProps> => {
    console.log(withFetch.name, "wrapping..");

    const WithFetch: React.FC = (props) => {
      const slugs = useSpaceParams();
      const { space } = useWorldAndSpaceBySlug(
        slugs.worldSlug,
        slugs.spaceSlug
      );

      console.log(WithFetch.name, "rendering...", space);
      return <Component {...props} space={space} />;
    };
    WithFetch.displayName = "withFetch(" + Check.displayName + ")";
    return WithFetch;
  };

export const AnalyticsCheck = compose(
  withFetch(),
  withRequired({ required: ["space"], fallback: LoadingPage })
)(Check);
