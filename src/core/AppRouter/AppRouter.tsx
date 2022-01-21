import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AnalyticsCheck } from "core/AnalyticsCheck";
import { Provided } from "core/Provided";

import {
  ACCOUNT_ROOT_URL,
  ADMIN_ROOT_URL,
  ATTENDEE_EMERGENCY_PARAM_URL,
  ATTENDEE_INSIDE_URL,
  ATTENDEE_LANDING_URL,
  ATTENDEE_STEPPING_PARAM_URL,
  ENTER_ROOT_URL,
  EXTERNAL_SPARKLE_HOMEPAGE_URL,
  EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL,
  LOGIN_CUSTOM_TOKEN_PARAM_URL,
  ROOT_URL,
  SPARKLEVERSE_REDIRECT_URL,
  VERSION_URL,
} from "settings";

import { SpaceSlug, WorldSlug } from "types/id";

import { tracePromise } from "utils/performance";
import {
  generateAttendeeInsideUrl,
  generateAttendeeSpaceLandingUrl,
} from "utils/url";

import { useUserNG } from "hooks/user/useUserNG";

import { LoginWithCustomToken } from "pages/Account/LoginWithCustomToken";
import { VersionPage } from "pages/VersionPage/VersionPage";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { Forbidden } from "components/atoms/Forbidden";
import { NotFound } from "components/atoms/NotFound";

const SubAccount = lazy(() =>
  tracePromise("AppRouter::lazy-import::AccountSubrouter", () =>
    import("./AccountSubRouter").then(({ AccountSubRouter }) => ({
      default: AccountSubRouter,
    }))
  )
);

const SubAdmin = lazy(() =>
  tracePromise("AppRouter::lazy-import::AdminSubRouter", () =>
    import("./AdminSubRouter").then(({ AdminSubRouter }) => ({
      default: AdminSubRouter,
    }))
  )
);

const SubEnter = lazy(() =>
  tracePromise("AppRouter::lazy-import::EnterSubrouter", () =>
    import("./EnterSubRouter").then(({ EnterSubRouter }) => ({
      default: EnterSubRouter,
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

// GOOGLE
const TEMP_GOOG_WEST_SLUG = "googlecloudwest";
const TEMP_GOOG_WEST_LANDING = `/v/${TEMP_GOOG_WEST_SLUG}`;
const TEMP_GOOG_WEST_INSIDE = `/in/${TEMP_GOOG_WEST_SLUG}`;
// ITERABLE
const TEMP_ITER_SLUG = "iterable";
const TEMP_ITER_ROUTE = `/v/${TEMP_ITER_SLUG}`;
// HONEYCOMB
const TEMP_HONEYCOMB_SLUG = "honeycomb";
const TEMP_HONEYCOMB_LANDING = `/v/${TEMP_HONEYCOMB_SLUG}`;
const TEMP_HONEYCOMB_INSIDE = `/in/${TEMP_HONEYCOMB_SLUG}`;
/////////////////////////////////////////////////////////////////////////////////////

export const AppRouter: React.FC = () => {
  const { auth, isLoading } = useUserNG();
  console.log(AppRouter.name, auth, isLoading);

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
              to={generateAttendeeSpaceLandingUrl(
                TEMP_ITER_SLUG as WorldSlug,
                TEMP_ITER_SLUG as SpaceSlug
              )}
            />
          </Route>
          <Route path={TEMP_GOOG_WEST_LANDING}>
            <Redirect
              to={generateAttendeeSpaceLandingUrl(
                TEMP_GOOG_WEST_SLUG as WorldSlug,
                TEMP_GOOG_WEST_SLUG as SpaceSlug
              )}
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
          <Route path={TEMP_HONEYCOMB_LANDING}>
            <Redirect
              to={generateAttendeeSpaceLandingUrl(
                TEMP_HONEYCOMB_SLUG as WorldSlug,
                TEMP_HONEYCOMB_SLUG as SpaceSlug
              )}
            />
          </Route>
          <Route path={TEMP_HONEYCOMB_INSIDE}>
            <Redirect
              to={generateAttendeeInsideUrl({
                worldSlug: TEMP_HONEYCOMB_SLUG as WorldSlug,
                spaceSlug: TEMP_HONEYCOMB_SLUG as SpaceSlug,
              })}
            />
          </Route>
          {
            /////////////////////////////////////////////////////////////////////////
          }

          {
            // Subs BEGIN
            // Subs get their analytics treatment inside them
          }
          <Route path={ENTER_ROOT_URL}>
            <SubEnter />
          </Route>
          <Route path={ACCOUNT_ROOT_URL}>
            <Provided withRelatedVenues>
              <SubAccount />
            </Provided>
          </Route>
          <Route path={ADMIN_ROOT_URL}>
            <SubAdmin />
          </Route>
          {
            // Subs END
          }

          <Route path={LOGIN_CUSTOM_TOKEN_PARAM_URL}>
            <AnalyticsCheck>
              <LoginWithCustomToken />
            </AnalyticsCheck>
          </Route>
          <Route path={ATTENDEE_LANDING_URL}>
            <Provided withRelatedVenues>
              <AnalyticsCheck>
                <VenueLandingPage />
              </AnalyticsCheck>
            </Provided>
          </Route>
          <Route path={ATTENDEE_STEPPING_PARAM_URL}>
            <Provided withRelatedVenues>
              <AnalyticsCheck>
                <VenueEntrancePage />
              </AnalyticsCheck>
            </Provided>
          </Route>
          <Route path={ATTENDEE_INSIDE_URL}>
            <Provided withRelatedVenues>
              <AnalyticsCheck>
                <VenuePage />
              </AnalyticsCheck>
            </Provided>
          </Route>
          <Route path={ATTENDEE_EMERGENCY_PARAM_URL}>
            <Provided withRelatedVenues>
              <AnalyticsCheck>
                <EmergencyViewPage />
              </AnalyticsCheck>
            </Provided>
          </Route>
          <Route path={VERSION_URL}>
            <AnalyticsCheck>
              <VersionPage />
            </AnalyticsCheck>
          </Route>
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
              auth ? (
                <AnalyticsCheck>
                  <NotFound />
                </AnalyticsCheck>
              ) : (
                // @debt Forbidden (copy of AdminRestricted) used because no prop-less Login is currently available
                <AnalyticsCheck>
                  <WithNavigationBar>
                    <Forbidden />
                  </WithNavigationBar>
                </AnalyticsCheck>
              )
            }
          />
        </Switch>
      </Suspense>
    </Router>
  );
};
