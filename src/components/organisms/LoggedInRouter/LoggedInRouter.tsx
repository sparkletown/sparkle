import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Venue from "pages/VenuePage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";

const LoggedInRouter = () => {
  useConnectPartyGoers();

  return (
    <Switch>
      <Route path="/venue/:venueId" component={Venue} />
      <Route path="/" component={() => <Redirect to="/venue/theodo-fftf" />} />
    </Switch>
  );
};

export default LoggedInRouter;
