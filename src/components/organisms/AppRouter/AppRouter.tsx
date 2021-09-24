import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { DEFAULT_REDIRECT_URL, SPARKLEVERSE_HOMEPAGE_URL } from "settings";

import { tracePromise } from "utils/performance";
import { venueLandingUrl } from "utils/url";

import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { VersionPage } from "pages/VersionPage/VersionPage";

import { Provided } from "components/organisms/AppRouter/Provided";

import { LoadingPage } from "components/molecules/LoadingPage";

const AccountSubrouter = lazy(() =>
  tracePromise("AppRouter::lazy-import::AccountSubrouter", () =>
    import("./AccountSubrouter").then(({ AccountSubrouter }) => ({
      default: AccountSubrouter,
    }))
  )
);

const AdminSubrouter = lazy(() =>
  tracePromise("AppRouter::lazy-import::AdminSubrouter", () =>
    import("./AdminSubrouter").then(({ AdminSubrouter }) => ({
      default: AdminSubrouter,
    }))
  )
);

const EnterSubrouter = lazy(() =>
  tracePromise("AppRouter::lazy-import::EnterSubrouter", () =>
    import("./EnterSubrouter").then(({ EnterSubrouter }) => ({
      default: EnterSubrouter,
    }))
  )
);

const VenueLandingPage = lazy(() =>
  tracePromise("AppRouter::lazy-import::VenueLandingPage", () =>
    import("pages/VenueLandingPage").then(({ VenueLandingPage }) => ({
      default: VenueLandingPage,
    }))
  )
);

const VenueEntrancePage = lazy(() =>
  tracePromise("AppRouter::lazy-import::VenueEntrancePage", () =>
    import("pages/VenueEntrancePage").then(({ VenueEntrancePage }) => ({
      default: VenueEntrancePage,
    }))
  )
);

const VenuePage = lazy(() =>
  tracePromise("AppRouter::lazy-import::VenuePage", () =>
    import("pages/VenuePage").then(({ VenuePage }) => ({
      default: VenuePage,
    }))
  )
);

const EmergencyViewPage = lazy(() =>
  tracePromise("AppRouter::lazy-import::EmergencyViewPage", () =>
    import("pages/EmergencyViewPage").then(({ EmergencyViewPage }) => ({
      default: EmergencyViewPage,
    }))
  )
);

export const AppRouter: React.FC = () => {
  return (
    <Router basename="/">
      <Suspense fallback={<LoadingPage />}>
        <Switch>
          <Route path="/enter" component={EnterSubrouter} />
          <Route path="/account">
            <Provided withRelatedVenues>
              <AccountSubrouter />
            </Provided>
          </Route>
          <Route path="/admin">
            <Provided withRelatedVenues>
              <AdminSubrouter />
            </Provided>
          </Route>
          <Route path="/admin-ng">
            <Provided withRelatedVenues>
              <AdminSubrouter />
            </Provided>
          </Route>

          <Route
            path="/login/:venueId/:customToken"
            component={LoginWithCustomToken}
          />
          {/* @debt The /login route doesn't work since we added non-defaulted props to the Login component */}
          {/*<Route path="/login" component={Login} />*/}

          <Route path="/v/:venueId">
            <Provided withRelatedVenues>
              <VenueLandingPage />
            </Provided>
          </Route>
          <Route path="/e/:step/:venueId" component={VenueEntrancePage} />
          <Route path="/in/:venueId/admin">
            <Provided withRelatedVenues>
              <VenueAdminPage />
            </Provided>
          </Route>
          <Route path="/in/:venueId">
            <Provided withRelatedVenues>
              <VenuePage />
            </Provided>
          </Route>
          <Route path="/m/:venueId">
            <Provided withRelatedVenues>
              <EmergencyViewPage />
            </Provided>
          </Route>

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
