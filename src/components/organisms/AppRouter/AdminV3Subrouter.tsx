import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_V3_ADVANCED_PARAM_URL,
  ADMIN_V3_CREATE_URL,
  ADMIN_V3_EDIT_PARAM_URL,
  ADMIN_V3_ROOT_URL,
  ADMIN_V3_VENUE_PARAM_URL,
} from "settings";

import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";

import { AdminDashboard } from "components/organisms/AdminDashboard";
import { AdminVenueView } from "components/organisms/AdminVenueView";

import { Provided } from "./Provided";

export const AdminV3Subrouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_V3_VENUE_PARAM_URL}>
      <Provided withWorldUsers>
        <AdminVenueView />
      </Provided>
    </Route>

    <Route path={ADMIN_V3_ADVANCED_PARAM_URL}>
      <Provided withWorldUsers>
        <AdminAdvancedSettings />
      </Provided>
    </Route>

    <Route path={ADMIN_V3_CREATE_URL}>
      <Provided withWorldUsers>
        <VenueWizardV2 />
      </Provided>
    </Route>

    <Route path={ADMIN_V3_EDIT_PARAM_URL}>
      <Provided withWorldUsers>
        <VenueWizardV2 />
      </Provided>
    </Route>

    <Route path={ADMIN_V3_ROOT_URL}>
      <Provided withWorldUsers>
        <AdminDashboard />
      </Provided>
    </Route>
  </Switch>
);
