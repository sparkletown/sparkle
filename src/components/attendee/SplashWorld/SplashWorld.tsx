import React, { useEffect, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCss, useSearchParam } from "react-use";
import { Button } from "components/attendee/Button";

import {
  ATTENDEE_SPACE_URL,
  DEFAULT_BACKGROUNDS,
  JOIN_WORLD_URL,
  QUICK_JOIN_PARAM_NAME,
  RETURN_URL_PARAM_NAME,
  SIGN_IN_URL,
  SIGN_UP_URL,
  STRING_SPACE,
} from "settings";

import { WorldWithId } from "types/id";

import { isDefined } from "utils/types";
import { generateUrl } from "utils/url";

import { usePreloadAssets } from "hooks/usePreloadAssets";
import { useLiveUser } from "hooks/user/useLiveUser";
import { useOnboardingDetails } from "hooks/user/useOnboardingDetails";

import { AttendeeHeader } from "../AttendeeHeader";

import sparkleLogoImage from "assets/images/sparkle-header.png";

import styles from "./SplashWorld.module.scss";

type SplashWorldProps = {
  world: WorldWithId;
};

export const SplashWorld: React.FC<SplashWorldProps> = ({ world }) => {
  const { userId } = useLiveUser();
  const worldHomeSpace = world.defaultSpaceSlug;

  const history = useHistory();

  const { onboardingDetails } = useOnboardingDetails({
    worldId: world.id,
    userId,
  });

  const isOnboarded = onboardingDetails?.isOnboarded;

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

  const navigateToSignIn = () => {
    history.push({
      pathname: SIGN_IN_URL,
      search: `?${RETURN_URL_PARAM_NAME}=${history.location.pathname}`,
    });
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

  const buttonText = isOnboarded ? "Enter" : "Join";

  const [assetsToPreload] = useMemo(
    () =>
      [world?.config?.landingPageConfig?.coverImageUrl]
        .filter(isDefined)
        .map((url) => ({ url })),
    [world?.config?.landingPageConfig?.coverImageUrl]
  );

  usePreloadAssets([assetsToPreload]);

  const { url } = assetsToPreload ?? {};
  const [defaultBackground] = DEFAULT_BACKGROUNDS;

  const mapStyles = useCss({
    backgroundImage: `url(${url || defaultBackground})`,
  });

  return (
    <div className={`${styles.splashWrapper} ${mapStyles}`}>
      {userId ? (
        <AttendeeHeader hasLogo />
      ) : (
        <img
          src={sparkleLogoImage}
          alt="sparkle-logo"
          className={styles.logoImage}
        />
      )}
      <div className={styles.Container}>
        <div className={styles.contentWrapper}>
          <h2>{world.name}</h2>
          <h3>{world.config?.landingPageConfig.description}</h3>
          <div className={styles.actionWrapper}>
            <Button onClick={onActionButtonClick} variant="intensive">
              {buttonText}
            </Button>
          </div>
          {!userId && (
            <div>
              You also need a Sparkle id to join.
              {STRING_SPACE}
              <Link className={styles.link} to="#" onClick={navigateToSignUp}>
                Sign Up
              </Link>
              <span className={styles.authDivider}>or</span>
              <Link className={styles.link} to="#" onClick={navigateToSignIn}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
