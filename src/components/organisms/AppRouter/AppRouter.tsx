import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";

import { VenueLandingPage } from "pages/VenueLandingPage";
import { VenueEntrancePage } from "pages/VenueEntrancePage";

import { VersionPage } from "pages/VersionPage/VersionPage";
import { DEFAULT_REDIRECT_URL, SPARKLEVERSE_HOMEPAGE_URL } from "settings";

import VenuePage from "pages/VenuePage";
import { venueLandingUrl } from "utils/url";

import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AccountSubrouter } from "./AccountSubrouter";
import { AdminNGSubrouter } from "./AdminNGSubrouter";
import { AdminV1Subrouter } from "./AdminV1Subrouter";
import { EnterSubrouter } from "./EnterSubrouter";

const AppRouter: React.FC = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route path="/enter" component={EnterSubrouter} />
        <Route path="/account" component={AccountSubrouter} />
        <Route path="/admin" component={AdminV1Subrouter} />
        <Route path="/admin-ng" component={AdminNGSubrouter} />

        <Route
          path="/login/:venueId/:customToken"
          component={LoginWithCustomToken}
        />
        {/* @debt The /login route doesn't work since we added non-defaulted props to the Login component */}
        {/*<Route path="/login" component={Login} />*/}

        <Route path="/v/:venueId" component={VenueLandingPage} />
        <Route path="/e/:step/:venueId" component={VenueEntrancePage} />
        <Route path="/in/:venueId/admin" component={VenueAdminPage} />
        <Route path="/in/:venueId" component={VenuePage} />
        <Route path="/version" component={VersionPage} />
        <Route
          path="/venue/*"
          render={(props) => (
            <Redirect to={venueLandingUrl(props.match.params[0])} />
          )}
        />

        <Route
          path="/sparkleverse"
          render={() => {
            window.location.href = SPARKLEVERSE_HOMEPAGE_URL;
            return <LoadingPage />;
          }}
        />

        <Route
          path="/"
          component={() => {
            window.location.href = DEFAULT_REDIRECT_URL;
            return null;
          }}
        />
      </Switch>
    </Router>
  );
};

export default AppRouter;
