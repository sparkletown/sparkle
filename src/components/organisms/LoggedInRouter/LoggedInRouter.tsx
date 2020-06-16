import React from "react";
import { Switch, Route } from "react-router-dom";
import JazzBarLoggedInPartyPage from "pages/JazzBar/LoggedInPartyPage";
import LoggedInPartyPage from "pages/LoggedInPartyPage";
import FriendShipPage from "pages/FriendShipPage";

const LoggedInRouter = () => (
  <Switch>
    <Route path="/kansassmittys" component={JazzBarLoggedInPartyPage} />
    <Route path="/friendship" component={FriendShipPage} />
    <Route path="/" component={LoggedInPartyPage} />
  </Switch>
);

export default LoggedInRouter;
