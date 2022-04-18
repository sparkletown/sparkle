import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LoginRestricted } from "components/shared/LoginRestricted";
import { NotFound } from "components/shared/NotFound";
import { SplashGated } from "components/shared/SplashGated";
import { AnalyticsCheck } from "core/AnalyticsCheck";

import {
  ACCOUNT_ROOT_URL,
  ADMIN_ROOT_URL,
  ATTENDEE_EMERGENCY_PARAM_URL,
  ATTENDEE_INSIDE_URL,
  ATTENDEE_SPACE_SPLASH_URL,
  ATTENDEE_SPACE_URL,
  ATTENDEE_STEPPING_PARAM_URL,
  ATTENDEE_WORLD_SPLASH_URL,
  ATTENDEE_WORLD_URL,
  EXTERNAL_SPARKLE_HOMEPAGE_URL,
  EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL,
  PASSWORD_RESET_URL,
  ROOT_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
  SPARKLEVERSE_REDIRECT_URL,
} from "settings";

import { tracePromise } from "utils/performance";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { LoadingPage } from "components/molecules/LoadingPage";

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

const RegisterPage = lazy(() =>
  tracePromise("AppRouter::lazy-import::Register", () =>
    import("pages/auth/RegisterForm").then(({ RegisterForm }) => ({
      default: RegisterForm,
    }))
  )
);

const LoginPage = lazy(() =>
  tracePromise("AppRouter::lazy-import::Login", () =>
    import("pages/auth/LoginForm").then(({ LoginForm }) => ({
      default: LoginForm,
    }))
  )
);

const PasswordResetPage = lazy(() =>
  tracePromise("AppRouter::lazy-import::Login", () =>
    import("pages/auth/PasswordResetForm").then(({ PasswordResetForm }) => ({
      default: PasswordResetForm,
    }))
  )
);

const SplashWorld = lazy(() =>
  tracePromise("AppRouter::lazy-import::SplashWorld", () =>
    import("components/attendee/SplashWorld").then(({ SplashWorld }) => ({
      default: SplashWorld,
    }))
  )
);

const SplashSpace = lazy(() =>
  tracePromise("AppRouter::lazy-import::SplashSpace", () =>
    import("components/attendee/SplashSpace").then(({ SplashSpace }) => ({
      default: SplashSpace,
    }))
  )
);

const SpaceEntrancePage = lazy(() =>
  tracePromise("AppRouter::lazy-import::SpaceEntrancePage", () =>
    import("components/attendee/SpaceEntrancePage").then(
      ({ SpaceEntrancePage }) => ({
        default: SpaceEntrancePage,
      })
    )
  )
);

const AttendeeLayout = lazy(() =>
  tracePromise("AppRouter::lazy-import::AttendeeLayout", () =>
    import("components/attendee/AttendeeLayout").then(({ AttendeeLayout }) => ({
      default: AttendeeLayout,
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

export const AppRouter: React.FC = () => (
  <Router basename="/">
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        {
          // Subs BEGIN
          // Sub-routes get their analytics treatment inside them
        }
        <Route path={ACCOUNT_ROOT_URL}>
          <RelatedVenuesProvider>
            <SubAccount />
          </RelatedVenuesProvider>
        </Route>
        <Route path={ADMIN_ROOT_URL}>
          <SubAdmin />
        </Route>
        {
          // Subs END
        }
        <Route path={SIGN_IN_URL}>
          <LoginPage />
        </Route>
        <Route path={SIGN_UP_URL}>
          <RegisterPage />
        </Route>
        <Route path={PASSWORD_RESET_URL}>
          <PasswordResetPage />
        </Route>
        {/* Is Signed in / profile filled / onboarded  */}
        <Route path={ATTENDEE_WORLD_SPLASH_URL}>
          <SplashWorld />
        </Route>
        <Route path={ATTENDEE_SPACE_SPLASH_URL}>
          <SplashSpace />
        </Route>

        {/* If not Signed in / profile filled / onboarded redirect to splash page */}
        <Route path={ATTENDEE_SPACE_URL}>
          <SplashGated>
            <RelatedVenuesProvider>
              <AnalyticsCheck>
                <AttendeeLayout />
              </AnalyticsCheck>
            </RelatedVenuesProvider>
          </SplashGated>
        </Route>
        <Route path={ATTENDEE_WORLD_URL}>
          <SplashGated>{/* Redirect to default world space*/}</SplashGated>
        </Route>

        <Route path={ATTENDEE_STEPPING_PARAM_URL}>
          <LoginRestricted>
            <RelatedVenuesProvider>
              <AnalyticsCheck>
                <SpaceEntrancePage />
              </AnalyticsCheck>
            </RelatedVenuesProvider>
          </LoginRestricted>
        </Route>
        <Route path={ATTENDEE_INSIDE_URL}>
          <LoginRestricted>
            <RelatedVenuesProvider>
              <AnalyticsCheck>
                <AttendeeLayout />
              </AnalyticsCheck>
            </RelatedVenuesProvider>
          </LoginRestricted>
        </Route>
        <Route path={ATTENDEE_EMERGENCY_PARAM_URL}>
          <LoginRestricted>
            <RelatedVenuesProvider>
              <AnalyticsCheck>
                <EmergencyViewPage />
              </AnalyticsCheck>
            </RelatedVenuesProvider>
          </LoginRestricted>
        </Route>
        <Route
          path={SPARKLEVERSE_REDIRECT_URL}
          render={() => {
            window.location.href = EXTERNAL_SPARKLEVERSE_HOMEPAGE_URL;
            return <LoadingPage />;
          }}
        />
        <Route
          // NOTE: must have exact here so that route doesn't override the default that follows
          exact
          path={ROOT_URL}
          render={() => {
            window.location.href = EXTERNAL_SPARKLE_HOMEPAGE_URL;
            return <LoadingPage />;
          }}
        />
        <Route path={ROOT_URL}>
          <LoginRestricted loading="page">
            <AnalyticsCheck>
              <NotFound />
            </AnalyticsCheck>
          </LoginRestricted>
        </Route>
      </Switch>
    </Suspense>
  </Router>
);
