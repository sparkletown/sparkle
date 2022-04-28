import React from "react";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import firebase from "firebase/compat/app";

import { ATTENDEE_INSIDE_URL, ATTENDEE_LANDING_URL } from "settings";

import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useUserId } from "hooks/user/useUserId";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";

import SHAPE_DENIED from "assets/images/access-forbidden.svg";

export const AdminRestrictedMessage: React.FC = () => {
  const history = useHistory();
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { userId } = useUserId();

  const [{ loading: isLoggingOut }, logout] = useAsyncFn(async () => {
    await firebase.auth().signOut();
    history.push(
      generateUrl({
        route: ATTENDEE_LANDING_URL,
        params: { worldSlug, spaceSlug },
        fallback: "/",
      })
    );
  }, [history, worldSlug, spaceSlug]);

  const redirectToDefaultRoute = () =>
    history.push(
      generateUrl({
        route: ATTENDEE_INSIDE_URL,
        params: { worldSlug, spaceSlug },
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
        <ButtonNG
          className="AdminRestricted__switch-button"
          variant="primary"
          loading={isLoggingOut}
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          {userId ? "Log Out" : "Log In"}
        </ButtonNG>
      </div>
    </div>
  );
};
