import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ADMIN_IA_SPACE_SETTINGS_PARAM_URL,
  ADMIN_IA_WORLD_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  ADMIN_ROOT_URL,
  ADMIN_V3_CREATE_PARAM_URL,
  ADMIN_V3_EDIT_PARAM_URL,
  ADMIN_V3_WORLD_BASE_URL,
  ADMIN_V3_WORLD_CREATE_URL,
  ADMIN_V3_WORLD_EDIT_PARAM_URL,
} from "settings";

import { SpaceCreatePage } from "pages/SpaceCreatePage";
import { SpaceCreateWizard } from "pages/SpaceCreateWizard";
import { SpaceEditor } from "pages/SpaceEditor";
import { SpaceEditWizard } from "pages/SpaceEditWizard";
import { SpacesDashboard } from "pages/SpacesDashboard";
import { WorldEditor } from "pages/WorldEditor";
import { WorldsDashboard } from "pages/WorldsDashboard";

import { AdminVenueView } from "components/organisms/AdminVenueView";

import { Provided } from "./Provided";

// @debt rename to AdminSubRouter once AdminV1Subrouter is removed
// @debt we use Provided a lot here. It's repetive and possibly not actually
// needed everywhere.
export const AdminV3Subrouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_IA_SPACE_SETTINGS_PARAM_URL}>
      <Provided withRelatedVenues>
        <SpaceEditor />
      </Provided>
    </Route>

    <Route path={ADMIN_IA_SPACE_EDIT_PARAM_URL}>
      <Provided withRelatedVenues>
        <AdminVenueView />
      </Provided>
    </Route>
    <Route path={ADMIN_IA_SPACE_CREATE_PARAM_URL}>
      <Provided withRelatedVenues>
        <SpaceCreatePage />
      </Provided>
    </Route>

    <Route
      // @debt there should be an ordering of these routes that doesn't require exact and strict props
      exact
      strict
      path={[ADMIN_IA_WORLD_PARAM_URL, ADMIN_IA_SPACE_BASE_PARAM_URL]}
    >
      <Provided withRelatedVenues>
        <SpacesDashboard />
      </Provided>
    </Route>

    <Route
      path={[
        ADMIN_IA_WORLD_EDIT_PARAM_URL,
        ADMIN_V3_WORLD_CREATE_URL,
        ADMIN_V3_WORLD_EDIT_PARAM_URL,
      ]}
    >
      <Provided withRelatedVenues>
        <WorldEditor />
      </Provided>
    </Route>
    <Route path={[ADMIN_ROOT_URL, ADMIN_V3_WORLD_BASE_URL]}>
      <Provided withRelatedVenues>
        <WorldsDashboard />
      </Provided>
    </Route>

    {
      // @debt remove these routes if/when SpaceEditor, SpaceCreateWizard and SpaceEditWizard are not used anymore
    }

    <Route path={ADMIN_V3_CREATE_PARAM_URL}>
      <Provided withRelatedVenues>
        <SpaceCreateWizard />
      </Provided>
    </Route>
    <Route path={ADMIN_V3_EDIT_PARAM_URL}>
      <Provided withRelatedVenues>
        <SpaceEditWizard />
      </Provided>
    </Route>
  </Switch>
);
