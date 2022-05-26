import React, { useEffect, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCss, useSearchParam } from "react-use";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "components/attendee/Button";

import {
  ATTENDEE_SPACE_URL,
  ATTENDEE_WORLD_SPLASH_URL,
  DEFAULT_BACKGROUNDS,
  JOIN_WORLD_URL,
  QUICK_JOIN_PARAM_NAME,
  RETURN_URL_PARAM_NAME,
  SIGN_IN_URL,
  SIGN_UP_URL,
  STRING_SPACE,
} from "settings";

import { SpaceWithId, WorldWithId } from "types/id";

import { isDefined } from "utils/types";
import { generateUrl } from "utils/url";

import { usePreloadAssets } from "hooks/usePreloadAssets";
import { useLiveUser } from "hooks/user/useLiveUser";
import { useOnboardingDetails } from "hooks/user/useOnboardingDetails";

import { AttendeeHeader } from "../AttendeeHeader";

import sparkleLogoImage from "assets/images/sparkle-header.png";

import styles from "./SplashSpace.module.scss";

type SplashSpaceProps = {
  space: SpaceWithId;
  world: WorldWithId;
};

export const SplashSpace: React.FC<SplashSpaceProps> = ({ space, world }) => {
  const { userId } = useLiveUser();

  const history = useHistory();

  const { onboardingDetails } = useOnboardingDetails({
    worldId: world.id,
    userId,
  });

  const isOnboarded = onboardingDetails?.isOnboarded;

  const quickJoinSpace = () => {
    history.push({
      pathname: SIGN_IN_URL,
      search: `?${RETURN_URL_PARAM_NAME}=${history.location.pathname}&${QUICK_JOIN_PARAM_NAME}=true`,
    });
  };

  const navigateToWorldSplash = () => {
    const worldSplashUrl = generateUrl({
      route: ATTENDEE_WORLD_SPLASH_URL,
      required: ["worldSlug"],
      params: { worldSlug: world.slug },
    });

    history.push(worldSplashUrl);
  };

  const navigateToSpace = () => {
    const spaceUrl = generateUrl({
      route: ATTENDEE_SPACE_URL,
      required: ["worldSlug", "spaceSlug"],
      params: { worldSlug: world.slug, spaceSlug: space.slug },
    });

    history.push(spaceUrl);
  };

  const navigateToOnboarding = () => {
    const joinUrl = generateUrl({
      route: JOIN_WORLD_URL,
      required: ["worldSlug", "spaceSlug"],
      params: { worldSlug: world.slug, spaceSlug: space.slug },
    });

    history.push(joinUrl);
  };

  const onActionButtonClick = () => {
    if (!userId) {
      return quickJoinSpace();
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
      [space?.mapBackgroundImageUrl].filter(isDefined).map((url) => ({ url })),
    [space]
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
        {userId && (
          <Button
            onClick={navigateToWorldSplash}
            className={styles.backButton}
            variant="intensive"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Go to {world.name}
          </Button>
        )}
        <div className={styles.wrapper}>
          <div className={styles.spaceInfo}>
            <p>{space.name}</p>
            <p>{space.config?.landingPageConfig.description}</p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.contentWrapper}>
            <div>
              {space.name} is part of {world.name}
            </div>
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
    </div>
  );
};
