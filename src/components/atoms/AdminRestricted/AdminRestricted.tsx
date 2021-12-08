import React, { useCallback, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsyncFn } from "react-use";

import { DISABLED_DUE_TO_1324 } from "settings";

import { useIsAdminUser } from "hooks/roles";
import { useUser } from "hooks/useUser";

import Login from "pages/Account/Login";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";

import SHAPE_DENIED from "assets/images/access-forbidden.svg";

import "./AdminRestricted.scss";

export const AdminRestricted: React.FC = ({ children }) => {
  const firebase = useFirebase();
  const { userId } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  const { isAdminUser, isLoading: isCheckingRole } = useIsAdminUser(userId);

  const [{ loading: isLoggingOut }, logout] = useAsyncFn(async () => {
    await firebase.auth().signOut();
    setShowLogin(true);
  }, [setShowLogin, firebase]);

  const authHandler = useCallback(() => {
    userId ? logout() : setShowLogin(true);
  }, [userId, logout, setShowLogin]);

  if (isAdminUser) return <>{children}</>;

  if (isCheckingRole) {
    return (
      <div className="AdminRestricted AdminRestricted--loading">Loading...</div>
    );
  }

  if (showLogin) {
    return <Login venueId={"POOP"} />;
  }

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
