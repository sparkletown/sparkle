import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSearchParam } from "react-use";
import { Button } from "components/attendee/Button";

import {
  ATTENDEE_WORLD_URL,
  QUICK_JOIN_PARAM_NAME,
  RETURN_URL_PARAM_NAME,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "settings";

import { WorldWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useLiveUser } from "hooks/user/useLiveUser";

import styles from "./SplashWorld.module.scss";

type SplashWorldProps = {
  world: WorldWithId;
};

export const SplashWorld: React.FC<SplashWorldProps> = ({ world }) => {
  const { userId } = useLiveUser();

  const history = useHistory();

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

  const navigateToWorld = () => {
    const spaceUrl = generateUrl({
      route: ATTENDEE_WORLD_URL,
      required: ["worldSlug"],
      params: { worldSlug: world.slug },
    });

    history.push(spaceUrl);
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

    navigateToWorld();
  });

  return (
    <div className={styles.Container}>
      <h1>World splash page!</h1>
      <p>{world.name}</p>
      <p>{world.config.landingPageConfig.description}</p>

      <Button onClick={userId ? navigateToWorld : quickJoinWorld}>Join</Button>

      {!userId && (
        <div>
          <Button onClick={navigateToSignIn}>Sign In</Button>
          <Button onClick={navigateToSignUp}>Sign Up</Button>
        </div>
      )}
    </div>
  );
};
