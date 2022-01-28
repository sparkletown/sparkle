import React from "react";
import { Route, Switch } from "react-router-dom";
import { AnalyticsCheck } from "core/AnalyticsCheck";

import {
  ACCOUNT_CODE_QUESTIONS_URL,
  ACCOUNT_PROFILE_QUESTIONS_URL,
  ACCOUNT_PROFILE_VENUE_PARAM_URL,
} from "settings";

import { CodeOfConduct } from "pages/Account/CodeOfConduct";
import { Profile } from "pages/Account/Profile";
import { ProfileQuestions } from "pages/Account/ProfileQuestions";

export const AccountSubRouter: React.FC = () => {
  return (
    <Switch>
      <Route path={ACCOUNT_PROFILE_VENUE_PARAM_URL}>
        <AnalyticsCheck>
          <Profile />
        </AnalyticsCheck>
      </Route>
      <Route path={ACCOUNT_PROFILE_QUESTIONS_URL}>
        <AnalyticsCheck>
          <ProfileQuestions />
        </AnalyticsCheck>
      </Route>
      <Route path={ACCOUNT_CODE_QUESTIONS_URL}>
        <AnalyticsCheck>
          <CodeOfConduct />
        </AnalyticsCheck>
      </Route>
    </Switch>
  );
};
