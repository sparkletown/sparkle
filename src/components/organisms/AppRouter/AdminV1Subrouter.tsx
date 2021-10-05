import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_V1_CREATE_URL,
  ADMIN_V1_EDIT_PARAM_URL,
  ADMIN_V1_ROOMS_PARAM_URL,
  ADMIN_V1_ROOT_URL,
  ADMIN_V1_VENUE_PARAM_URL,
} from "settings";

import { Admin } from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";

export const AdminV1Subrouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_V1_ROOMS_PARAM_URL} component={RoomsForm} />
    <Route path={ADMIN_V1_CREATE_URL} component={VenueWizard} />
    <Route path={ADMIN_V1_EDIT_PARAM_URL} component={VenueWizard} />
    <Route path={ADMIN_V1_VENUE_PARAM_URL} component={Admin} />
    <Route path={ADMIN_V1_ROOT_URL} component={Admin} />
  </Switch>
);
