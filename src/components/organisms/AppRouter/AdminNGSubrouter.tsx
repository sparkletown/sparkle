import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Admin_v2 from "pages/Admin/Admin_v2";
import VenueWizard_v2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";

import { AdminVenueView } from "components/organisms/AdminVenueView";

export const AdminNGSubrouter: React.FC = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route path="/admin-ng/venue/:venueId?" component={AdminVenueView} />
        <Route
          path="/admin-ng/advanced-settings/:venueId?"
          component={AdminAdvancedSettings}
        />

        <Route path="/admin-ng/venue/creation" component={VenueWizard_v2} />
        <Route path="/admin-ng/edit/:venueId" component={VenueWizard_v2} />

        <Route path="/admin-ng" component={Admin_v2} />
      </Switch>
    </Router>
  );
};
