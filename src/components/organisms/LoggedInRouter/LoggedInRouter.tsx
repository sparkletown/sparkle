import React from "react";
import { Switch, Route } from "react-router-dom";
import JazzBarLoggedInPartyPage from "pages/JazzBar/LoggedInPartyPage";
import LoggedInPartyPage from "pages/LoggedInPartyPage";

const LoggedInRouter = () => (
  <Switch>
    <Route path="/kansassmittys" component={JazzBarLoggedInPartyPage} />
    <Route path="/" component={LoggedInPartyPage} />
  </Switch>
);

export default LoggedInRouter;
