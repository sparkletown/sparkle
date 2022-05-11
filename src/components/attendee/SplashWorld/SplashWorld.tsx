import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSearchParam } from "react-use";
import { Button } from "components/attendee/Button";

import {
  ATTENDEE_SPACE_URL,
  JOIN_WORLD_URL,
  QUICK_JOIN_PARAM_NAME,
  RETURN_URL_PARAM_NAME,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "settings";

import { WorldWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useLiveUser } from "hooks/user/useLiveUser";
import { useOnboardingDetails } from "hooks/user/useOnboardingDetails";

import styles from "./SplashWorld.module.scss";

type SplashWorldProps = {
  world: WorldWithId;
};

export const SplashWorld: React.FC<SplashWorldProps> = ({ world }) => {
  const { userId } = useLiveUser();

  const history = useHistory();

  const worldHomeSpace = world.defaultSpaceSlug;

  const { onboardingDetails } = useOnboardingDetails({
    worldId: world.id,
    userId,
  });

  const isOnboarded = onboardingDetails?.isOnboarded;

  const navigateToSignIn = () => {
    history.push({
      pathname: SIGN_IN_URL,
      search: `?${RETURN_URL_PARAM_NAME}=${history.location.pathname}`,
    });
  };

  const quickJoinWorld = () => {
    history.push({
      pathname: SIGN_IN_URL,
      search: `?${RETURN_URL_PARAM_NAME}=${history.location.pathname}&${QUICK_JOIN_PARAM_NAME}=true`,
    });
  };

  const navigateToOnboarding = () => {
    if (!worldHomeSpace) return;

    const joinUrl = generateUrl({
      route: JOIN_WORLD_URL,
      required: ["worldSlug", "spaceSlug"],
      params: { worldSlug: world.slug, spaceSlug: worldHomeSpace },
    });

    history.push(joinUrl);
  };

  const navigateToSpace = () => {
    if (!worldHomeSpace) return;

    const spaceUrl = generateUrl({
      route: ATTENDEE_SPACE_URL,
      required: ["worldSlug", "spaceSlug"],
      params: { worldSlug: world.slug, spaceSlug: worldHomeSpace },
    });

    history.push(spaceUrl);
  };

  const onActionButtonClick = () => {
    if (!userId) {
      return quickJoinWorld();
    }

    if (!isOnboarded) {
      return navigateToOnboarding();
    }

    return navigateToSpace();
  };

  const navigateToSignUp = () => {
    history.push({
      pathname: SIGN_UP_URL,
      search: `?${RETURN_URL_PARAM_NAME}=${history.location.pathname}`,
    });
  };

  const shouldJoinQuickly = Boolean(useSearchParam(QUICK_JOIN_PARAM_NAME));

  useEffect(() => {
    if (!shouldJoinQuickly) return;

    navigateToSpace();
  });

  const hasHomeSpace = !!worldHomeSpace;

  const buttonText = isOnboarded ? "Enter" : "Join";

  return (
    <div className={styles.Container}>
      <h1>World splash page!</h1>
      <p>{world.name}</p>
      <p>{world.config.landingPageConfig.description}</p>

      {!hasHomeSpace && <p>No home space was specified!</p>}
      <Button disabled={!hasHomeSpace} onClick={onActionButtonClick}>
        {buttonText}
      </Button>

      {!userId && (
        <div>
          <Button onClick={navigateToSignIn}>Sign In</Button>
          <Button onClick={navigateToSignUp}>Sign Up</Button>
        </div>
      )}
    </div>
  );
};
