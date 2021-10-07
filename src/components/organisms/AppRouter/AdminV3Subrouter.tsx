import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_V3_ADVANCED_PARAM_URL,
  ADMIN_V3_CREATE_PARAM_URL,
  ADMIN_V3_EDIT_PARAM_URL,
  ADMIN_V3_NEW_WORLD_URL,
  ADMIN_V3_OLD_WORLD_PARAM_URL,
  ADMIN_V3_ROOT_URL,
  ADMIN_V3_VENUE_PARAM_URL,
  ADMIN_V3_WORLDS_URL,
} from "settings";

import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminAdvancedSettings } from "pages/AdminAdvancedSettings";
import { WorldEditor } from "pages/WorldEditor";
import { WorldsDashboard } from "pages/WorldsDashboard";

import { AdminDashboard } from "components/organisms/AdminDashboard";
import { AdminVenueView } from "components/organisms/AdminVenueView";

export const AdminV3Subrouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_V3_NEW_WORLD_URL} component={WorldEditor} />
    <Route path={ADMIN_V3_OLD_WORLD_PARAM_URL} component={WorldEditor} />
    <Route path={ADMIN_V3_WORLDS_URL} component={WorldsDashboard} />
    <Route path={ADMIN_V3_VENUE_PARAM_URL} component={AdminVenueView} />
    <Route
      path={ADMIN_V3_ADVANCED_PARAM_URL}
      component={AdminAdvancedSettings}
    />
    <Route path={ADMIN_V3_CREATE_PARAM_URL} component={VenueWizardV2} />
    <Route path={ADMIN_V3_EDIT_PARAM_URL} component={VenueWizardV2} />
    <Route path={ADMIN_V3_ROOT_URL} component={AdminDashboard} />
  </Switch>
);
