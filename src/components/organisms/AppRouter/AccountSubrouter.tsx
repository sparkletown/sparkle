import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import CodeOfConduct from "pages/Account/CodeOfConduct";
import { Profile } from "pages/Account/Profile";
import { Questions } from "pages/Account/Questions";

export const AccountSubrouter: React.FC = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/questions" component={Questions} />
        <Route path="/account/code-of-conduct" component={CodeOfConduct} />
      </Switch>
    </Router>
  );
};
