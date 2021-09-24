import React from "react";
import { Route, Switch } from "react-router-dom";

import { ADMIN_CREATE_SPACE_URL } from "utils/url";

import { Admin } from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";
import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";

import { AdminDashboard } from "components/organisms/AdminDashboard";
import { AdminVenueView } from "components/organisms/AdminVenueView";

export const AdminSubrouter: React.FC = () => {
  return (
    <Switch>
      {/* Admin OG */}

      <Route path="/admin/venue/rooms/:venueId" component={RoomsForm} />

      <Route path="/admin/venue/creation" component={VenueWizard} />

      <Route path="/admin/venue/edit/:venueId" component={VenueWizard} />

      <Route path="/admin/:venueId" component={Admin} />

      <Route path="/admin" component={Admin} />

      {/* Admin NG */}

      <Route
        path="/admin-ng/venue/:venueId?/:selectedTab?"
        component={AdminVenueView}
      />

      <Route
        path="/admin-ng/advanced-settings/:venueId?/:selectedTab?"
        component={AdminAdvancedSettings}
      />

      <Route path={ADMIN_CREATE_SPACE_URL} component={VenueWizardV2} />

      <Route path="/admin-ng/edit/:venueId" component={VenueWizardV2} />

      <Route path="/admin-ng" component={AdminDashboard} />
    </Switch>
  );
};
