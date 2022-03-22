import React from "react";
import { Route, Switch } from "react-router-dom";
import { LoginRestricted } from "components/shared/LoginRestricted";
import { AnalyticsCheck } from "core/AnalyticsCheck";

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
  ADMIN_IA_WORLD_USERS,
  ADMIN_ROOT_URL,
} from "settings";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { ToolsPage } from "pages/Admin/ToolsPage";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { WorldSchedule } from "pages/Admin/WorldSchedule";
import { WorldUsers } from "pages/Admin/WorldUsers";
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
          <RelatedVenuesProvider>
            <VenueAdminPage />
          </RelatedVenuesProvider>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={ADMIN_IA_SPACE_EDIT_PARAM_URL}>
      <LoginRestricted>
        <AnalyticsCheck>
          <RelatedVenuesProvider>
            <AdminVenueView />
          </RelatedVenuesProvider>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={ADMIN_IA_SPACE_CREATE_PARAM_URL}>
      <LoginRestricted>
        <AnalyticsCheck>
          <RelatedVenuesProvider>
            <SpaceCreatePage />
          </RelatedVenuesProvider>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_IA_WORLD_CREATE_URL, ADMIN_IA_WORLD_EDIT_PARAM_URL]}>
      <LoginRestricted>
        <AnalyticsCheck>
          <RelatedVenuesProvider>
            <WorldEditor />
          </RelatedVenuesProvider>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_IA_WORLD_REPORTS]}>
      <LoginRestricted>
        <RelatedVenuesProvider>
          <ToolsPage />
        </RelatedVenuesProvider>
      </LoginRestricted>
    </Route>

    <Route path={ADMIN_IA_WORLD_SCHEDULE}>
      <LoginRestricted>
        <AnalyticsCheck>
          <RelatedVenuesProvider>
            <WorldSchedule />
          </RelatedVenuesProvider>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={ADMIN_IA_WORLD_USERS}>
      <AnalyticsCheck>
        <RelatedVenuesProvider>
          <WorldUsers />
        </RelatedVenuesProvider>
      </AnalyticsCheck>
    </Route>

    <Route path={[ADMIN_IA_WORLD_PARAM_URL, ADMIN_IA_SPACE_BASE_PARAM_URL]}>
      <LoginRestricted>
        <AnalyticsCheck>
          <RelatedVenuesProvider>
            <SpacesDashboard />
          </RelatedVenuesProvider>
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>

    <Route path={[ADMIN_ROOT_URL, ADMIN_IA_WORLD_BASE_URL]}>
      <LoginRestricted>
        <AnalyticsCheck>
          <WorldsDashboard />
        </AnalyticsCheck>
      </LoginRestricted>
    </Route>
  </Switch>
);
