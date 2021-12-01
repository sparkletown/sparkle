import React from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import {
  DEFAULT_SPACE_SLUG,
  DEFAULT_WORLD_SLUG,
  DISABLED_DUE_TO_1324,
} from "settings";

import { attendeeSpaceInsideUrl, attendeeSpaceLandingUrl } from "utils/url";

import { useIsAdminUser } from "hooks/roles";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useUser } from "hooks/useUser";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";

import SHAPE_DENIED from "assets/images/access-forbidden.svg";

import "./AdminRestricted.scss";

export const AdminRestricted: React.FC = ({ children }) => {
  const firebase = useFirebase();
  const history = useHistory();
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { userId } = useUser();

  const { isAdminUser, isLoading: isCheckingRole } = useIsAdminUser(userId);

  const [{ loading: isLoggingOut }, logout] = useAsyncFn(async () => {
    await firebase.auth().signOut();
    history.push(
      spaceSlug ? attendeeSpaceLandingUrl(worldSlug, spaceSlug) : "/"
    );
  }, [firebase, history, worldSlug, spaceSlug]);

  const redirectToDefaultRoute = () =>
    history.push(
      attendeeSpaceInsideUrl(DEFAULT_WORLD_SLUG, DEFAULT_SPACE_SLUG)
    );

  const authHandler = userId ? logout : redirectToDefaultRoute;

  if (isAdminUser) return <>{children}</>;

  if (isCheckingRole)
    return (
      <div className="AdminRestricted AdminRestricted--loading">Loading...</div>
    );

  return (
    <div className="AdminRestricted AdminRestricted--forbidden">
      <div className="AdminRestricted__message-container">
        <SparkleLogo className="AdminRestricted__logo" />
        <img
          className="AdminRestricted__denied-shape"
          alt="shape indicating denied access"
          src={SHAPE_DENIED}
        />
        <p className="AdminRestricted__title">Admin Access Denied</p>
        <p>
          Oops. You cannot access Admin Panel. Please log in with your Admin
          enabled Sparkle account.
        </p>
        <p>
          If you don’t have an Admin Account, please contact your event
          organiser.
        </p>
        {DISABLED_DUE_TO_1324 && (
          <ButtonNG
            className="AdminRestricted__switch-button"
            variant="primary"
            loading={isLoggingOut}
            disabled={isLoggingOut}
            onClick={authHandler}
          >
            {userId ? "Log Out" : "Log In"}
          </ButtonNG>
        )}
      </div>
    </div>
  );
};
