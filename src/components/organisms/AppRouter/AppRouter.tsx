import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import {
  ADMIN_ROOT_URL,
  ADMIN_V1_ROOT_URL,
  ADMIN_V3_ROOT_URL,
  DEFAULT_REDIRECT_URL,
  SPARKLEVERSE_HOMEPAGE_URL,
} from "settings";

import { tracePromise } from "utils/performance";
import { resolveAdminRootUrl, venueLandingUrl } from "utils/url";

import { useSettings } from "hooks/useSettings";

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

const AdminV1Subrouter = lazy(() =>
  tracePromise("AppRouter::lazy-import::AdminV1Subrouter", () =>
    import("./AdminV1Subrouter").then(({ AdminV1Subrouter }) => ({
      default: AdminV1Subrouter,
    }))
  )
);

const AdminV3Subrouter = lazy(() =>
  tracePromise("AppRouter::lazy-import::AdminV3Subrouter", () =>
    import("./AdminV3Subrouter").then(({ AdminV3Subrouter }) => ({
      default: AdminV3Subrouter,
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
  const { isLoaded, settings } = useSettings();

  if (!isLoaded) return <LoadingPage />;

  const { enableAdmin1, enableAdmin3 } = settings;
  const adminRootUrl = resolveAdminRootUrl(settings);

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

          <Route path={ADMIN_ROOT_URL}>
            <Redirect to={adminRootUrl} />
          </Route>

          {enableAdmin1 && (
            <Route path={ADMIN_V1_ROOT_URL}>
              <Provided withRelatedVenues>
                <AdminV1Subrouter />
              </Provided>
            </Route>
          )}

          {enableAdmin3 && (
            <Route path={ADMIN_V3_ROOT_URL}>
              <Provided withRelatedVenues>
                <AdminV3Subrouter />
              </Provided>
            </Route>
          )}

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
            <Provided withWorldUsers withRelatedVenues>
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
