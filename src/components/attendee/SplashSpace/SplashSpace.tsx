import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/attendee/Button";

import {
  ATTENDEE_SPACE_URL,
  ATTENDEE_WORLD_SPLASH_URL,
  RETURN_URL_PARAM_NAME,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "settings";

import { SpaceWithId, WorldWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useLiveUser } from "hooks/user/useLiveUser";

import styles from "./SplashSpace.module.scss";

type SplashSpaceProps = {
  space: SpaceWithId;
  world: WorldWithId;
};

export const SplashSpace: React.FC<SplashSpaceProps> = ({ space, world }) => {
  const { userId } = useLiveUser();

  const history = useHistory();

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

  return (
    <div className={styles.Container}>
      <h1>Space splash page!</h1>
      <Button onClick={navigateToWorldSplash}>Go to World Splash</Button>
      <p>{space.name}</p>
      <p>{space.config?.landingPageConfig.description}</p>

      {userId ? (
        <Button onClick={navigateToSpace}>Join</Button>
      ) : (
        <div>
          <Button onClick={navigateToSignIn}>Sign In</Button>
          <Button onClick={navigateToSignUp}>Sign Up</Button>
        </div>
      )}
    </div>
  );
};
