import React from "react";
import { Route, Switch } from "react-router-dom";

import { Admin } from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";
import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";

import { AdminDashboard } from "components/organisms/AdminDashboard";
import { AdminVenueView } from "components/organisms/AdminVenueView";

import { Provided } from "./Provided";

export const AdminSubrouter: React.FC = () => {
  return (
    <Switch>
      {/* Admin OG */}

      <Route path="/admin/venue/rooms/:venueId">
        <Provided withWorldUsers>
          <RoomsForm />
        </Provided>
      </Route>

      <Route path="/admin/venue/creation">
        <Provided withWorldUsers>
          <VenueWizard />
        </Provided>
      </Route>

      <Route path="/admin/venue/edit/:venueId">
        <Provided withWorldUsers>
          <VenueWizard />
        </Provided>
      </Route>

      <Route path="/admin/:venueId">
        <Provided withWorldUsers>
          <Admin />
        </Provided>
      </Route>

      <Route path="/admin">
        <Provided withWorldUsers>
          <Admin />
        </Provided>
      </Route>

      {/* Admin NG */}

      <Route path="/admin-ng/venue/:venueId?/:selectedTab?">
        <Provided withWorldUsers>
          <AdminVenueView />
        </Provided>
      </Route>

      <Route path="/admin-ng/advanced-settings/:venueId?/:selectedTab?">
        <Provided withWorldUsers>
          <AdminAdvancedSettings />
        </Provided>
      </Route>

      <Route path="/admin-ng/create/venue">
        <Provided withWorldUsers>
          <VenueWizardV2 />
        </Provided>
      </Route>

      <Route path="/admin-ng/edit/:venueId">
        <Provided withWorldUsers>
          <VenueWizardV2 />
        </Provided>
      </Route>

      <Route path="/admin-ng">
        <Provided withWorldUsers>
          <AdminDashboard />
        </Provided>
      </Route>
    </Switch>
  );
};
