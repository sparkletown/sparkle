import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_V3_CREATE_PARAM_URL,
  ADMIN_V3_EDIT_PARAM_URL,
  ADMIN_V3_NEW_WORLD_URL,
  ADMIN_V3_OLD_WORLD_PARAM_URL,
  ADMIN_V3_ROOT_URL,
  ADMIN_V3_SPACE_PARAM_URL,
  ADMIN_V3_SPACE_SETTINGS_PARAM_URL,
  ADMIN_V3_WORLD_SPACES_PARAM_URL,
  ADMIN_V3_WORLDS_BASE_URL,
} from "settings";

import VenueWizardV2 from "pages/Admin/Venue/VenueWizard/VenueWizard";
import { AdminDashboard } from "pages/AdminDashboard";
import { AdminVenueView } from "pages/AdminVenueView";
import { SpaceEditor } from "pages/SpaceEditor";
import { WorldEditor } from "pages/WorldEditor";
import { WorldsDashboard } from "pages/WorldsDashboard";

export const AdminV3Subrouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_V3_WORLD_SPACES_PARAM_URL} component={AdminDashboard} />
    <Route path={ADMIN_V3_NEW_WORLD_URL} component={WorldEditor} />
    <Route path={ADMIN_V3_OLD_WORLD_PARAM_URL} component={WorldEditor} />
    <Route path={ADMIN_V3_WORLDS_BASE_URL} component={WorldsDashboard} />
    <Route path={ADMIN_V3_SPACE_PARAM_URL} component={AdminVenueView} />
    <Route path={ADMIN_V3_SPACE_SETTINGS_PARAM_URL} component={SpaceEditor} />
    <Route path={ADMIN_V3_CREATE_PARAM_URL} component={VenueWizardV2} />
    <Route path={ADMIN_V3_EDIT_PARAM_URL} component={VenueWizardV2} />
    <Route path={ADMIN_V3_ROOT_URL} component={WorldsDashboard} />
  </Switch>
);
