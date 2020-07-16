import React from "react";
import { Switch, Route } from "react-router-dom";
import EntranceExperience from "components/venues/Jazzbar/EntranceExperience";
import EventPage from "components/venues/EventPage";
import VenuePage from "pages/VenuePage";

const VenueRouter = () => (
  <Switch>
    <Route exact path="/venue/:venueId" component={EntranceExperience} />
    <Route path="/venue/:venueId/entrance/:eventId" component={EventPage} />
    <Route path="/venue/:venueId/event/:eventId" component={VenuePage} />
  </Switch>
);

export default VenueRouter;
