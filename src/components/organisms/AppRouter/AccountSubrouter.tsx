import React from "react";
import { Route, Switch } from "react-router-dom";

import { CodeOfConduct } from "pages/Account/CodeOfConduct";
import { Profile } from "pages/Account/Profile";
import { Questions } from "pages/Account/Questions";

import { NotFound } from "components/atoms/NotFound";

export const AccountSubrouter: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/profile" component={Profile} />
      <Route path="/account/questions" component={Questions} />
      <Route path="/account/code-of-conduct" component={CodeOfConduct} />
      <Route component={NotFound} />
    </Switch>
  );
};
