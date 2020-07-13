import React from "react";
import { Switch, Route } from "react-router-dom";
import LoggedInRouter from "components/organisms/LoggedInRouter";
import EntranceExperience from "pages/EntranceExperience";
import { default as JazzbarEntranceExperience } from "components/venues/Jazzbar/EntranceExperience";

const VenueRouter = () => (
  <Switch>
    <Route
      path="/venue/:venueId/entrance-experience"
      component={EntranceExperience}
    />
    <Route
      path="/venue/:venueId/jazzbar-entrance-experience"
      component={JazzbarEntranceExperience}
    />
    <LoggedInRouter />
  </Switch>
);

export default VenueRouter;
