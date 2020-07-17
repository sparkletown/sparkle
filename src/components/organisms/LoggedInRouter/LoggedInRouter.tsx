import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Venue from "pages/VenuePage";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

const LoggedInRouter = () => {
  useConnectPartyGoers();
  useProfileInformationCheck();

  return (
    <Switch>
      <Route path="/venue/:venueId" component={Venue} />
      <Route
        path="/"
        component={() => <Redirect to="/venue/kansassmittys" />}
      />
    </Switch>
  );
};

export default LoggedInRouter;
