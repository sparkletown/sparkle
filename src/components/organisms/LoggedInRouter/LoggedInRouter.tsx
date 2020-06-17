import React from "react";
import { Switch, Route } from "react-router-dom";
import JazzBarLoggedInPartyPage from "pages/JazzBar/LoggedInPartyPage";
import LoggedInPartyPage from "pages/LoggedInPartyPage";
import FriendShipPage from "pages/FriendShipPage";
import Room from "pages/RoomPage";

const LoggedInRouter = () => (
  <Switch>
    <Route path="/kansassmittys" component={JazzBarLoggedInPartyPage} />
    <Route path="/friendship" component={FriendShipPage} />
    <Route path="/" exact component={LoggedInPartyPage} />
    <Route path="/:roomName" component={Room} />
  </Switch>
);

export default LoggedInRouter;
