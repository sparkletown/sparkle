import React from "react";
import { Route, Switch } from "react-router-dom";

import { CodeOfConductRF } from "pages/RegistrationFlow/CodeOfConductRF/CodeOfConductRF";
import { ProfileRF } from "pages/RegistrationFlow/ProfileRF";
import { QuestionsRF } from "pages/RegistrationFlow/QuestionsRF";

import { Provided } from "components/organisms/AppRouter/Provided";

import { NotFound } from "components/atoms/NotFound";

export const AccountSubrouter: React.FC = () => {
  return (
    <Switch>
      <Route path="/account/profile">
        <Provided withWorldUsers>
          <ProfileRF />
        </Provided>
      </Route>
      <Route path="/account/questions" component={QuestionsRF} />
      <Route path="/account/code-of-conduct" component={CodeOfConductRF} />
      <Route component={NotFound} />
    </Switch>
  );
};
