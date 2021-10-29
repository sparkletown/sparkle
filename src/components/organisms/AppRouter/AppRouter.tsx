import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import {
  ACCOUNT_ROOT_URL,
  ADMIN_V1_ROOT_URL,
  ADMIN_V3_ROOT_URL,
  ENTER_ROOT_URL,
  ENTRANCE_STEP_VENUE_PARAM_URL,
  EXTERNAL_SPARKLE_HOMEPAGE_URL,
  EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL,
  LOGIN_CUSTOM_TOKEN_PARAM_URL,
  ROOT_URL,
  SPARKLEVERSE_REDIRECT_URL,
  VENUE_EMERGENCY_PARAM_URL,
  VENUE_INSIDE_ADMIN_PARAM_URL,
  VENUE_INSIDE_PARAM_URL,
  VENUE_LANDING_PARAM_URL,
  VENUE_REDIRECT_PARAM_URL,
  VERSION_URL,
} from "settings";

import { tracePromise } from "utils/performance";
import { venueLandingUrl } from "utils/url";

import { useSettings } from "hooks/useSettings";
import { useUser } from "hooks/useUser";

import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";
import { VenueAdminPage } from "pages/Admin/Venue/VenueAdminPage";
import { VersionPage } from "pages/VersionPage/VersionPage";

import { Provided } from "components/organisms/AppRouter/Provided";
import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { Forbidden } from "components/atoms/Forbidden";
import { NotFound } from "components/atoms/NotFound";

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
  const { user } = useUser();

  if (!isLoaded) return <LoadingPage />;

  const { enableAdmin1 } = settings;

  return (
    <Router basename="/">
      <Suspense fallback={<LoadingPage />}>
        <Switch>
          <Route path={ENTER_ROOT_URL} component={EnterSubrouter} />

          <Route path={ACCOUNT_ROOT_URL}>
            <Provided withRelatedVenues>
              <AccountSubrouter />
            </Provided>
          </Route>

          {enableAdmin1 && (
            <Route path={ADMIN_V1_ROOT_URL}>
              <Provided withRelatedVenues>
                <AdminV1Subrouter />
              </Provided>
            </Route>
          )}

          <Route path={ADMIN_V3_ROOT_URL}>
            <Provided withRelatedVenues>
              <AdminV3Subrouter />
            </Provided>
          </Route>

          <Route
            path={LOGIN_CUSTOM_TOKEN_PARAM_URL}
            component={LoginWithCustomToken}
          />
          {/* @debt The /login route doesn't work since we added non-defaulted props to the Login component */}
          {/*<Route path={LOGIN_URL} component={Login} />*/}

          <Route path={VENUE_LANDING_PARAM_URL}>
            <Provided withRelatedVenues>
              <VenueLandingPage />
            </Provided>
          </Route>

          <Route path={ENTRANCE_STEP_VENUE_PARAM_URL}>
            <Provided withRelatedVenues>
              <VenueEntrancePage />
            </Provided>
          </Route>

          <Route path={VENUE_INSIDE_ADMIN_PARAM_URL}>
            <Provided withRelatedVenues>
              <VenueAdminPage />
            </Provided>
          </Route>

          <Route path={VENUE_INSIDE_PARAM_URL}>
            <Provided withRelatedVenues>
              <VenuePage />
            </Provided>
          </Route>

          <Route path={VENUE_EMERGENCY_PARAM_URL}>
            <Provided withRelatedVenues>
              <EmergencyViewPage />
            </Provided>
          </Route>

          <Route path={VERSION_URL} component={VersionPage} />

          <Route
            path={VENUE_REDIRECT_PARAM_URL}
            render={(props) => (
              <Redirect to={venueLandingUrl(props.match.params[0])} />
            )}
          />

          <Route
            path={SPARKLEVERSE_REDIRECT_URL}
            render={() => {
              window.location.href = EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL;
              return <LoadingPage />;
            }}
          />

          <Route
            // NOTE: must have exact here so it doesn't override the default that folloes
            exact
            path={ROOT_URL}
            render={() => {
              window.location.href = EXTERNAL_SPARKLE_HOMEPAGE_URL;
              return <LoadingPage />;
            }}
          />

          <Route
            path={ROOT_URL}
            render={() =>
              user ? (
                <NotFound />
              ) : (
                // @debt Forbidden (copy of AdminRestricted) used because no prop-less Login is currently available
                <WithNavigationBar>
                  <Forbidden />
                </WithNavigationBar>
              )
            }
          />
        </Switch>
      </Suspense>
    </Router>
  );
};
