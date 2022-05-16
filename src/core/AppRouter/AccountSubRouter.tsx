import React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginRestricted } from "components/shared/LoginRestricted";
import { AnalyticsCheck } from "core/AnalyticsCheck";

import { ACCOUNT_PROFILE_BASE_URL } from "settings";

import { AccountPage } from "pages/Account/AccountPage";
import { Profile } from "pages/Account/Profile";

export const AccountSubRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact>
        <AccountPage />
      </Route>
      <Route path={ACCOUNT_PROFILE_BASE_URL}>
        <LoginRestricted>
          <AnalyticsCheck>
            <Profile />
          </AnalyticsCheck>
        </LoginRestricted>
      </Route>
    </Switch>
  );
};
