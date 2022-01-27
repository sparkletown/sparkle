import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_IA_SPACE_ADMIN_PARAM_URL,
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_BASE_URL,
  ADMIN_IA_WORLD_CREATE_URL,
  ADMIN_IA_WORLD_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  ADMIN_IA_WORLD_SCHEDULE_URL,
  ADMIN_IA_WORLD_TOOLS_PARAM_URL,
  ADMIN_ROOT_URL,
} from "settings";

import { ToolsPage } from "pages/Admin/ToolsPage";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { SpaceCreatePage } from "pages/SpaceCreatePage";
import { SpacesDashboard } from "pages/SpacesDashboard";
import { WorldEditor } from "pages/WorldEditor";
import { WorldSchedule } from "pages/WorldSchedule/WorldSchedule";
import { WorldsDashboard } from "pages/WorldsDashboard";

import { AdminVenueView } from "components/organisms/AdminVenueView";

import { Provided } from "./Provided";

export const AdminSubRouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_IA_WORLD_SCHEDULE_URL}>
      <Provided withRelatedVenues>
        <WorldSchedule />
      </Provided>
    </Route>

    <Route path={ADMIN_IA_SPACE_ADMIN_PARAM_URL}>
      <Provided withRelatedVenues>
        <VenueAdminPage />
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

    <Route path={[ADMIN_IA_WORLD_CREATE_URL, ADMIN_IA_WORLD_EDIT_PARAM_URL]}>
      <Provided withRelatedVenues>
        <WorldEditor />
      </Provided>
    </Route>

    <Route path={[ADMIN_IA_WORLD_TOOLS_PARAM_URL]}>
      <Provided withRelatedVenues>
        <ToolsPage />
      </Provided>
    </Route>

    <Route path={[ADMIN_IA_WORLD_PARAM_URL, ADMIN_IA_SPACE_BASE_PARAM_URL]}>
      <Provided withRelatedVenues>
        <SpacesDashboard />
      </Provided>
    </Route>

    <Route path={[ADMIN_ROOT_URL, ADMIN_IA_WORLD_BASE_URL]}>
      <Provided withRelatedVenues>
        <WorldsDashboard />
      </Provided>
    </Route>
  </Switch>
);
