import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import {
  ACCOUNT_ROOT_URL,
  ADMIN_ROOT_URL,
  ATTENDEE_SPACE_EMERGENCY_PARAM_URL,
  ATTENDEE_SPACE_INSIDE_URL,
  ATTENDEE_SPACE_LANDING_URL,
  ENTER_ROOT_URL,
  ENTRANCE_STEP_VENUE_PARAM_URL,
  EXTERNAL_SPARKLE_HOMEPAGE_URL,
  EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL,
  LOGIN_CUSTOM_TOKEN_PARAM_URL,
  ROOT_URL,
  SPARKLEVERSE_REDIRECT_URL,
  VERSION_URL,
} from "settings";

import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { tracePromise } from "utils/performance";
import { generateAttendeeInsideUrl } from "utils/url";

import { useUser } from "hooks/useUser";

import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";
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

const AdminSubRouter = lazy(() =>
  tracePromise("AppRouter::lazy-import::AdminSubRouter", () =>
    import("components/organisms/AppRouter/AdminSubRouter").then(
      ({ AdminSubRouter }) => ({
        default: AdminSubRouter,
      })
    )
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

/////////////////////////////////////////////////////////////////////////////////////
// NOTE: do keep this monkeypatch localized in this file, not spread in others
// @debt custom urls with AppRouter redirects that are to be removed in the future
// @see: https://github.com/sparkletown/internal-sparkle-issues/issues/1547
const TEMP_GOOG_WEST_SLUG = "googlecloudwest";
const TEMP_GOOG_WEST_LANDING = `/v/${TEMP_GOOG_WEST_SLUG}`;
const TEMP_GOOG_WEST_INSIDE = `/in/${TEMP_GOOG_WEST_SLUG}`;
const TEMP_ITER_SLUG = "iterable";
const TEMP_ITER_ROUTE = `/v/${TEMP_ITER_SLUG}`;
/////////////////////////////////////////////////////////////////////////////////////

export const AppRouter: React.FC = () => {
  const { user } = useUser();

  return (
    <Router basename="/">
      <Suspense fallback={<LoadingPage />}>
        <Switch>
          {
            /////////////////////////////////////////////////////////////////////////
            // @debt the following temp re-routes should be removed after events' end
          }
          <Route path={TEMP_ITER_ROUTE}>
            <Redirect
              to={generateAttendeeInsideUrl({
                worldSlug: TEMP_ITER_SLUG as WorldSlug,
                spaceSlug: TEMP_ITER_SLUG as SpaceSlug,
              })}
            />
          </Route>
          <Route path={TEMP_GOOG_WEST_LANDING}>
            <Redirect
              to={generateAttendeeInsideUrl({
                worldSlug: TEMP_GOOG_WEST_SLUG as WorldSlug,
                spaceSlug: TEMP_GOOG_WEST_SLUG as SpaceSlug,
              })}
            />
          </Route>
          <Route path={TEMP_GOOG_WEST_INSIDE}>
            <Redirect
              to={generateAttendeeInsideUrl({
                worldSlug: TEMP_GOOG_WEST_SLUG as WorldSlug,
                spaceSlug: TEMP_GOOG_WEST_SLUG as SpaceSlug,
              })}
            />
          </Route>
          {
            /////////////////////////////////////////////////////////////////////////
          }

          <Route path={ENTER_ROOT_URL} component={EnterSubrouter} />
          <Route path={ACCOUNT_ROOT_URL}>
            <Provided withRelatedVenues>
              <AccountSubrouter />
            </Provided>
          </Route>
          <Route path={ADMIN_ROOT_URL}>
            <AdminSubRouter />
          </Route>
          <Route
            path={LOGIN_CUSTOM_TOKEN_PARAM_URL}
            component={LoginWithCustomToken}
          />
          <Route path={ATTENDEE_SPACE_LANDING_URL}>
            <Provided withRelatedVenues>
              <VenueLandingPage />
            </Provided>
          </Route>
          <Route path={ENTRANCE_STEP_VENUE_PARAM_URL}>
            <Provided withRelatedVenues>
              <VenueEntrancePage />
            </Provided>
          </Route>
          <Route path={ATTENDEE_SPACE_INSIDE_URL}>
            <Provided withRelatedVenues>
              <VenuePage />
            </Provided>
          </Route>
          <Route path={ATTENDEE_SPACE_EMERGENCY_PARAM_URL}>
            <Provided withRelatedVenues>
              <EmergencyViewPage />
            </Provided>
          </Route>
          <Route path={VERSION_URL} component={VersionPage} />
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
