import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ACCOUNT_CODE_URL,
  ACCOUNT_PROFILE_BASE_URL,
  ACCOUNT_QUESTIONS_URL,
} from "settings";

import { CodeOfConduct } from "pages/Account/CodeOfConduct";
import { Profile } from "pages/Account/Profile";
import { Questions } from "pages/Account/Questions";

export const AccountSubrouter: React.FC = () => {
  return (
    <Switch>
      <Route path={ACCOUNT_PROFILE_BASE_URL} component={Profile} />
      <Route path={ACCOUNT_QUESTIONS_URL} component={Questions} />
      <Route path={ACCOUNT_CODE_URL} component={CodeOfConduct} />
    </Switch>
  );
};
