import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  ADMIN_V1_CREATE_URL,
  ADMIN_V1_EDIT_URL,
  ADMIN_V1_ROOMS_URL,
  ADMIN_V1_ROOT_URL,
  ADMIN_V1_VENUE_URL,
} from "settings";

import { Admin } from "pages/Admin/Admin";
import { RoomsForm } from "pages/Admin/Venue/Rooms/RoomsForm";
import { VenueWizard } from "pages/Admin/Venue/VenueWizard";

import { Provided } from "./Provided";

export const AdminV1Subrouter: React.FC = () => (
  <Switch>
    <Route path={ADMIN_V1_ROOMS_URL}>
      <Provided withWorldUsers>
        <RoomsForm />
      </Provided>
    </Route>

    <Route path={ADMIN_V1_CREATE_URL}>
      <Provided withWorldUsers>
        <VenueWizard />
      </Provided>
    </Route>

    <Route path={ADMIN_V1_EDIT_URL}>
      <Provided withWorldUsers>
        <VenueWizard />
      </Provided>
    </Route>

    <Route path={ADMIN_V1_VENUE_URL}>
      <Provided withWorldUsers>
        <Admin />
      </Provided>
    </Route>

    <Route path={ADMIN_V1_ROOT_URL}>
      <Provided withWorldUsers>
        <Admin />
      </Provided>
    </Route>
  </Switch>
);
