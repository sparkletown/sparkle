import React from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";

import { venueLandingUrl } from "utils/url";

import { useIsAdminUser } from "hooks/roles";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";

import SHAPE_DENIED from "assets/images/denied.svg";

import "./AdminRestricted.scss";

export interface AdminRestrictedProps {
  userId?: string;
  venueId?: string;
}

export const AdminRestricted: React.FC<AdminRestrictedProps> = ({
  children,
  userId,
  venueId,
}) => {
  const firebase = useFirebase();
  const history = useHistory();
  const venueIdFromHook = useVenueId();
  const { userId: userIdFromHook } = useUser();

  // Webpack lacking babel loader for ??= operator? O.o
  venueId = venueId ?? venueIdFromHook;
  userId = userId ?? userIdFromHook;

  const { isAdminUser, isLoading } = useIsAdminUser(userId);

  const [, logout] = useAsyncFn(async () => {
    await firebase.auth().signOut();
    history.push(venueId ? venueLandingUrl(venueId) : "/");
  }, [firebase, history, venueId]);

  if (isAdminUser) {
    return (
      <div className="AdminRestricted AdminRestricted--allowed">{children}</div>
    );
  }

  if (isLoading)
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
        <ButtonNG
          className="AdminRestricted__switch-button"
          variant="primary"
          onClick={logout}
        >
          Switch Account
        </ButtonNG>
      </div>
    </div>
  );
};
