import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { DEFAULT_REDIRECT_URL, SPARKLEVERSE_HOMEPAGE_URL } from "settings";

import { venueLandingUrl } from "utils/url";

import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";

import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";

import { VenueEntrancePage } from "pages/VenueEntrancePage";
import { VenueLandingPage } from "pages/VenueLandingPage";
import { VenuePage } from "pages/VenuePage";
import { VersionPage } from "pages/VersionPage/VersionPage";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AccountSubrouter } from "./AccountSubrouter";
import { AdminSubrouter } from "./AdminSubrouter";
import { EnterSubrouter } from "./EnterSubrouter";

export const AppRouter: React.FC = () => {
  return (
    <Router basename="/">
      <Suspense fallback={<LoadingPage />}>
        <Switch>
          <Route path="/enter" component={EnterSubrouter} />
          <Route path="/account" component={AccountSubrouter} />
          <Route path="/admin" component={AdminSubrouter} />
          <Route path="/admin-ng" component={AdminSubrouter} />

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
            render={() => {
              window.location.href = DEFAULT_REDIRECT_URL;
              return <LoadingPage />;
            }}
          />
        </Switch>
      </Suspense>
    </Router>
  );
};
