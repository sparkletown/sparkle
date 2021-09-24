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

      <Route path="/admin/venue/rooms/:venueId">
        <RoomsForm />
      </Route>

      <Route path="/admin/venue/creation">
        <VenueWizard />
      </Route>

      <Route path="/admin/venue/edit/:venueId">
        <VenueWizard />
      </Route>

      <Route path="/admin/:venueId">
        <Admin />
      </Route>

      <Route path="/admin">
        <Admin />
      </Route>

      {/* Admin NG */}

      <Route path="/admin-ng/venue/:venueId?/:selectedTab?">
        <AdminVenueView />
      </Route>

      <Route path="/admin-ng/advanced-settings/:venueId?/:selectedTab?">
        <AdminAdvancedSettings />
      </Route>

      <Route path={ADMIN_CREATE_SPACE_URL}>
        <VenueWizardV2 />
      </Route>

      <Route path="/admin-ng/edit/:venueId">
        <VenueWizardV2 />
      </Route>

      <Route path="/admin-ng">
        <AdminDashboard />
      </Route>
    </Switch>
  );
};
