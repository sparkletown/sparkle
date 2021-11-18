import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ACCOUNT_CODE_QUESTIONS_URL,
  ACCOUNT_PROFILE_BASE_URL,
  ACCOUNT_PROFILE_QUESTIONS_URL,
} from "settings";

import { CodeOfConduct } from "pages/Account/CodeOfConduct";
import { Profile } from "pages/Account/Profile";
import { ProfileQuestions } from "pages/Account/ProfileQuestions";

export const AccountSubrouter: React.FC = () => {
  return (
    <Switch>
      <Route path={ACCOUNT_PROFILE_BASE_URL} component={Profile} />
      <Route
        path={ACCOUNT_PROFILE_QUESTIONS_URL}
        component={ProfileQuestions}
      />
      <Route path={ACCOUNT_CODE_QUESTIONS_URL} component={CodeOfConduct} />
    </Switch>
  );
};
