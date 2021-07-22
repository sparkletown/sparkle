import React from "react";
import { Route, Switch } from "react-router-dom";

import Admin from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";

import AdminV2 from "pages/Admin/Admin_v2";
import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";

import { AdminVenueView } from "components/organisms/AdminVenueView";

import { Provided } from "./Provided";

export const AdminSubrouter: React.FC = () => {
  return (
    <Switch>
      {/* Admin V1 */}

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

      {/* Admin V2/3/NG */}

      <Route path="/admin-ng/venue/:venueId?/:selectedTab?">
        <Provided withWorldUsers>
          <AdminVenueView />
        </Provided>
      </Route>

      <Route path="/admin-ng/advanced-settings/:venueId?">
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

      <Route path={["/admin-ng", "/admin-ng/*"]}>
        <Provided withWorldUsers>
          <AdminV2 />
        </Provided>
      </Route>
    </Switch>
  );
};
