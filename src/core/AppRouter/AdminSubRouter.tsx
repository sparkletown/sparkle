import React from "react";
import { Route, Switch } from "react-router-dom";
import { AnalyticsCheck } from "core/AnalyticsCheck";
import { Provided } from "core/Provided";

import {
  ADMIN_IA_SPACE_ADMIN_PARAM_URL,
  ADMIN_IA_SPACE_BASE_PARAM_URL,
  ADMIN_IA_SPACE_CREATE_PARAM_URL,
  ADMIN_IA_SPACE_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_BASE_URL,
  ADMIN_IA_WORLD_CREATE_URL,
  ADMIN_IA_WORLD_EDIT_PARAM_URL,
  ADMIN_IA_WORLD_PARAM_URL,
  ADMIN_IA_WORLD_REPORTS,
  ADMIN_IA_WORLD_SCHEDULE,
  ADMIN_ROOT_URL,
} from "settings";

import { ToolsPage } from "pages/Admin/ToolsPage";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { WorldSchedule } from "pages/Admin/WorldSchedule";
import { SpaceCreatePage } from "pages/SpaceCreatePage";
import { SpacesDashboard } from "pages/SpacesDashboard";
import { WorldEditor } from "pages/WorldEditor";
import { WorldsDashboard } from "pages/WorldsDashboard";

import { AdminVenueView } from "components/organisms/AdminVenueView";

export const AdminSubRouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_IA_SPACE_ADMIN_PARAM_URL}>
      <AnalyticsCheck>
        <Provided withRelatedVenues>
          <VenueAdminPage />
        </Provided>
      </AnalyticsCheck>
    </Route>

    <Route path={ADMIN_IA_SPACE_EDIT_PARAM_URL}>
      <AnalyticsCheck>
        <Provided withRelatedVenues>
          <AdminVenueView />
        </Provided>
      </AnalyticsCheck>
    </Route>

    <Route path={ADMIN_IA_SPACE_CREATE_PARAM_URL}>
      <AnalyticsCheck>
        <Provided withRelatedVenues>
          <SpaceCreatePage />
        </Provided>
      </AnalyticsCheck>
    </Route>

    <Route path={[ADMIN_IA_WORLD_CREATE_URL, ADMIN_IA_WORLD_EDIT_PARAM_URL]}>
      <AnalyticsCheck>
        <Provided withRelatedVenues>
          <WorldEditor />
        </Provided>
      </AnalyticsCheck>
    </Route>

    <Route path={[ADMIN_IA_WORLD_REPORTS]}>
      <Provided withRelatedVenues>
        <ToolsPage />
      </Provided>
    </Route>

    <Route path={ADMIN_IA_WORLD_SCHEDULE}>
      <Provided withRelatedVenues>
        <WorldSchedule />
      </Provided>
    </Route>

    <Route path={[ADMIN_IA_WORLD_PARAM_URL, ADMIN_IA_SPACE_BASE_PARAM_URL]}>
      <AnalyticsCheck>
        <Provided withRelatedVenues>
          <SpacesDashboard />
        </Provided>
      </AnalyticsCheck>
    </Route>

    <Route path={[ADMIN_ROOT_URL, ADMIN_IA_WORLD_BASE_URL]}>
      <AnalyticsCheck>
        <Provided withRelatedVenues>
          <WorldsDashboard />
        </Provided>
      </AnalyticsCheck>
    </Route>
  </Switch>
);
