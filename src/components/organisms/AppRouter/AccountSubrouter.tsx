import React from "react";
import { Route, Switch } from "react-router-dom";

import { Questions } from "pages/Account/Questions";
import { CodeOfConductRF } from "pages/RegistrationFlow/CodeOfConductRF/CodeOfConductRF";
import { ProfileRF } from "pages/RegistrationFlow/ProfileRF";

import { NotFound } from "components/atoms/NotFound";

export const AccountSubrouter: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/profile" component={ProfileRF} />
      <Route path="/account/questions" component={Questions} />
      <Route path="/account/code-of-conduct" component={CodeOfConductRF} />
      <Route component={NotFound} />
    </Switch>
  );
};
