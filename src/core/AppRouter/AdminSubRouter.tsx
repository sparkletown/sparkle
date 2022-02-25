import React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginRestricted } from "components/shared/LoginRestricted";
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
  ADMIN_IA_WORLD_TOOLS_PARAM_URL,
  ADMIN_ROOT_URL,
} from "settings";

import { ToolsPage } from "pages/Admin/ToolsPage";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { SpaceCreatePage } from "pages/SpaceCreatePage";
import { SpacesDashboard } from "pages/SpacesDashboard";
import { WorldEditor } from "pages/WorldEditor";
import { WorldsDashboard } from "pages/WorldsDashboard";

import { AdminVenueView } from "components/organisms/AdminVenueView";

export const AdminSubRouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_IA_SPACE_ADMIN_PARAM_URL}>
      <LoginRestricted>
        <AnalyticsCheck>
          <Provided withRelatedVenues>
            <VenueAdminPage />
          </Provided>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={ADMIN_IA_SPACE_EDIT_PARAM_URL}>
      <LoginRestricted>
        <AnalyticsCheck>
          <Provided withRelatedVenues>
            <AdminVenueView />
          </Provided>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={ADMIN_IA_SPACE_CREATE_PARAM_URL}>
      <LoginRestricted>
        <AnalyticsCheck>
          <Provided withRelatedVenues>
            <SpaceCreatePage />
          </Provided>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_IA_WORLD_CREATE_URL, ADMIN_IA_WORLD_EDIT_PARAM_URL]}>
      <LoginRestricted>
        <AnalyticsCheck>
          <Provided withRelatedVenues>
            <WorldEditor />
          </Provided>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_IA_WORLD_TOOLS_PARAM_URL]}>
      <LoginRestricted>
        <Provided withRelatedVenues>
          <ToolsPage />
        </Provided>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_IA_WORLD_PARAM_URL, ADMIN_IA_SPACE_BASE_PARAM_URL]}>
      <LoginRestricted>
        <AnalyticsCheck>
          <Provided withRelatedVenues>
            <SpacesDashboard />
          </Provided>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_ROOT_URL, ADMIN_IA_WORLD_BASE_URL]}>
      <LoginRestricted>
        <AnalyticsCheck>
          <Provided withRelatedVenues>
            <WorldsDashboard />
          </Provided>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>
  </Switch>
);
