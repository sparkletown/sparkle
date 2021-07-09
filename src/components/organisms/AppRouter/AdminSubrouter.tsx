import React from "react";
import { Route, Switch } from "react-router-dom";

import Admin from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";

import AdminV2 from "pages/Admin/Admin_v2";
import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";

import { AdminVenueView } from "components/organisms/AdminVenueView";
import { Provided } from "components/organisms/AppRouter/Provided";

export const AdminSubrouter: React.FC = () => {
  return (
    <Switch>
      {/* Admin V1 */}
      <Route
        path="/admin/venue/rooms/:venueId"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <RoomsForm />
          </Provided>
        )}
      />
      <Route
        path="/admin/venue/creation"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <VenueWizard />
          </Provided>
        )}
      />
      <Route
        path="/admin/venue/edit/:venueId"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <VenueWizard />
          </Provided>
        )}
      />
      <Route
        path="/admin/:venueId"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <Admin />
          </Provided>
        )}
      />
      <Route
        path="/admin"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <Admin />
          </Provided>
        )}
      />

      {/* Admin V2/3/NG */}
      <Route
        path="/admin-ng/venue/:venueId?"
        component={() => (
          <Provided withWorldUsers>
            <AdminVenueView />
          </Provided>
        )}
      />
      <Route
        path="/admin-ng/advanced-settings/:venueId?"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <AdminAdvancedSettings />
          </Provided>
        )}
      />
      <Route
        path="/admin-ng/venue/creation"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <VenueWizardV2 />
          </Provided>
        )}
      />
      <Route
        path="/admin-ng/edit/:venueId"
        component={() => (
          <Provided withWorldUsers withRelatedVenues>
            <VenueWizardV2 />
          </Provided>
        )}
      />
      <Route
        path="/admin-ng"
        component={() => (
          <Provided withWorldUsers>
            <AdminV2 />
          </Provided>
        )}
      />
    </Switch>
  );
};
