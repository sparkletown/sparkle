import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Admin from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";

export const AdminV1Subrouter: React.FC = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route path="/admin/venue/rooms/:venueId" component={RoomsForm} />
        <Route path="/admin/venue/creation" component={VenueWizard} />
        <Route path="/admin/venue/edit/:venueId" component={VenueWizard} />
        <Route path="/admin/:venueId" component={Admin} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </Router>
  );
};
