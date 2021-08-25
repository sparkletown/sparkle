import React, { useCallback } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { venueLandingUrl } from "utils/url";

import { useIsAdminUser } from "hooks/roles";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";

import SHAPE_DENIED from "assets/images/denied.svg";

import "./AdminForbidden.scss";

export interface AdminForbiddenProps {
  userId: string;
  venueId?: string;
}

export const AdminForbidden: React.FC<AdminForbiddenProps> = ({
  children,
  userId,
  venueId,
}) => {
  const { isAdminUser, isLoading } = useIsAdminUser(userId);
  const firebase = useFirebase();
  const history = useHistory();
  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    history.push(venueId ? venueLandingUrl(venueId) : "/");
  }, [firebase, history, venueId]);

  if (isAdminUser) {
    return (
      <div className="AdminForbidden AdminForbidden--allowed">{children}</div>
    );
  }

  if (isLoading)
    return (
      <div className="AdminForbidden AdminForbidden--loading">Loading...</div>
    );

  return (
    <div className="AdminForbidden AdminForbidden--forbidden">
      <div className="AdminForbidden__message-container">
        <SparkleLogo className="AdminForbidden__logo" />
        <img
          className="AdminForbidden__denied-shape"
          alt="shape indicating denied access"
          src={SHAPE_DENIED}
        />
        <p className="AdminForbidden__title">Admin Access Denied</p>
        <p>
          Oops. You cannot access Admin Panel. Please log in with your Admin
          enabled Sparkle account.
        </p>
        <p>
          If you don’t have an Admin Account, please contact your event
          organiser.
        </p>
        <ButtonNG
          className="AdminForbidden__switch-button"
          variant="primary"
          onClick={logout}
        >
          Switch Account
        </ButtonNG>
      </div>
    </div>
  );
};
