import React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginRestricted } from "components/shared/LoginRestricted";
import { AnalyticsCheck } from "core/AnalyticsCheck";

import {
  ACCOUNT_CODE_QUESTIONS_URL,
  ACCOUNT_PROFILE_SPACE_PARAM_URL,
} from "settings";

import { Profile } from "pages/Account/Profile";

export const AccountSubRouter: React.FC = () => {
  return (
    <Switch>
      <Route path={ACCOUNT_PROFILE_SPACE_PARAM_URL}>
        <LoginRestricted>
          <AnalyticsCheck>
            <Profile />
          </AnalyticsCheck>
        </LoginRestricted>
      </Route>
      <Route path={ACCOUNT_CODE_QUESTIONS_URL}>
        <LoginRestricted>
          <AnalyticsCheck>{/* <CodeOfConduct /> */}</AnalyticsCheck>
        </LoginRestricted>
      </Route>
    </Switch>
  );
};
