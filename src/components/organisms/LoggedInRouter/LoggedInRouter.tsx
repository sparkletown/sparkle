import React from "react";
import { Switch, Route } from "react-router-dom";
import Venue from "pages/VenuePage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";

const LoggedInRouter = () => {
  useConnectPartyGoers();

  return (
    <Switch>
      <Route path="/venue/:venueId" component={Venue} />
    </Switch>
  );
};

export default LoggedInRouter;
