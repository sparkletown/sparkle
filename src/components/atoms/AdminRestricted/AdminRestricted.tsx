import React from "react";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import firebase from "firebase/compat/app";

import {
  DEFAULT_SPACE_SLUG,
  DEFAULT_WORLD_SLUG,
  DISABLED_DUE_TO_1324,
} from "settings";

import {
  generateAttendeeInsideUrl,
  generateAttendeeSpaceLandingUrl,
} from "utils/url";

import { UseAdminRole } from "hooks/user/useAdminRole";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";
import { WithSlugsProps } from "components/hocs/context/withSlugs";
import { WithAuthProps } from "components/hocs/db/withAuth";

import SHAPE_DENIED from "assets/images/access-forbidden.svg";

import "./AdminRestricted.scss";

type Props = WithAuthProps & WithSlugsProps & Partial<ReturnType<UseAdminRole>>;

export const AdminRestricted: React.FC<Props> = ({
  userId,
  worldSlug,
  spaceSlug,
}) => {
  const history = useHistory();

  const [{ loading: isLoggingOut }, logout] = useAsyncFn(async () => {
    await firebase.auth().signOut();
    history.push(
      spaceSlug ? generateAttendeeSpaceLandingUrl(worldSlug, spaceSlug) : "/"
    );
  }, [history, worldSlug, spaceSlug]);

  const redirectToDefaultRoute = () =>
    history.push(
      generateAttendeeInsideUrl({
        worldSlug: DEFAULT_WORLD_SLUG,
        spaceSlug: DEFAULT_SPACE_SLUG,
      })
    );

  const handleLogout = userId ? logout : redirectToDefaultRoute;

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
            onClick={handleLogout}
          >
            {userId ? "Log Out" : "Log In"}
          </ButtonNG>
        )}
      </div>
    </div>
  );
};
