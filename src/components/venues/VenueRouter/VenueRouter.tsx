import React from "react";
import { Switch, Route } from "react-router-dom";
import LoggedInRouter from "components/organisms/LoggedInRouter";
import EntranceExperience from "../Jazzbar/EntranceExperience";

const VenueRouter = () => (
  <Switch>
    <Route
      path="/venue/:venueId/entrance-experience"
      component={EntranceExperience}
    />
    <LoggedInRouter />
  </Switch>
);

export default VenueRouter;
