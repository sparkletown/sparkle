import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  ADMIN_ROOT_URL,
  ADMIN_V3_CREATE_PARAM_URL,
  ADMIN_V3_EDIT_PARAM_URL,
  ADMIN_V3_SPACE_PARAM_URL,
  ADMIN_V3_SPACE_SETTINGS_PARAM_URL,
  ADMIN_V3_WORLD_BASE_URL,
  ADMIN_V3_WORLD_CREATE_URL,
  ADMIN_V3_WORLD_EDIT_PARAM_URL,
  ADMIN_V3_WORLD_SPACES_PARAM_URL,
} from "settings";

import { SpaceCreatePage } from "pages/SpaceCreatePage";
import { SpaceCreateWizard } from "pages/SpaceCreateWizard";
import { SpaceEditor } from "pages/SpaceEditor";
import { SpaceEditWizard } from "pages/SpaceEditWizard";
import { SpacesDashboard } from "pages/SpacesDashboard";
import { WorldEditor } from "pages/WorldEditor";
import { WorldsDashboard } from "pages/WorldsDashboard";

import { AdminVenueView } from "components/organisms/AdminVenueView";

// @debt rename to AdminSubRouter once AdminV1Subrouter is removed
export const AdminV3Subrouter: React.FC = () => (
  <Switch>
    <Route
      path={[ADMIN_V3_SPACE_PARAM_URL, ADMIN_IA_SPACE_EDIT_PARAM_URL]}
      component={AdminVenueView}
    />

    <Route path={ADMIN_IA_SPACE_CREATE_PARAM_URL} component={SpaceCreatePage} />

    <Route
      path={[
        ADMIN_IA_WORLD_PARAM_URL,
        ADMIN_IA_SPACE_BASE_PARAM_URL,
        // @debt remove the following if unused
        ADMIN_V3_WORLD_SPACES_PARAM_URL,
      ]}
      component={SpacesDashboard}
    />

    <Route
      path={[
        ADMIN_IA_WORLD_EDIT_PARAM_URL,
        ADMIN_V3_WORLD_CREATE_URL,
        ADMIN_V3_WORLD_EDIT_PARAM_URL,
      ]}
      component={WorldEditor}
    />

    <Route
      path={[ADMIN_ROOT_URL, ADMIN_V3_WORLD_BASE_URL]}
      component={WorldsDashboard}
    />

    {
      // @debt remove these routes if/when SpaceEditor, SpaceCreateWizard and SpaceEditWizard are not used anymore
    }
    <Route path={ADMIN_V3_SPACE_SETTINGS_PARAM_URL} component={SpaceEditor} />
    <Route path={ADMIN_V3_CREATE_PARAM_URL} component={SpaceCreateWizard} />
    <Route path={ADMIN_V3_EDIT_PARAM_URL} component={SpaceEditWizard} />
  </Switch>
);
