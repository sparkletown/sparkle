import React, { lazy, Suspense } from "react";

import { tracePromise } from "utils/performance";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import { NewProfileModal } from "components/organisms/NewProfileModal";

import { Footer } from "components/molecules/Footer";
import { Loading } from "components/molecules/Loading";

import "./WithNavigationBar.scss";

const NavBar = lazy(() =>
  tracePromise("WithNavigationBar::lazy-import::NavBar", () =>
    import("components/molecules/NavBar").then(({ NavBar }) => ({
      default: NavBar,
    }))
  )
);

export interface WithNavigationBarProps {
  hasBackButton?: boolean;
  withSchedule?: boolean;
  withPhotobooth?: boolean;
  hideLoginButton?: boolean;
}

export const WithNavigationBar: React.FC<WithNavigationBarProps> = ({
  hasBackButton,
  withSchedule,
  withPhotobooth,
  hideLoginButton,
  children,
}) => {
  // @debt remove useVenueId from here and just pass it through as a prop/similar
  const venueId = useVenueId();

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  // @debt remove backButton from Navbar
  return (
    <>
      {/* @debt ideally we would have a better 'higher level' location we could include this provider that covers
       *    all of the admin components that currently directly render WithNavigationBar. We should refactor them
       *    all to have a standard 'admin wrapper frame' in a similar way to how src/pages/VenuePage/TemplateWrapper.tsx
       *    works on the user side of things.
       */}
      <RelatedVenuesProvider venueId={venueId} worldId={venue?.worldId}>
        <Suspense fallback={<Loading />}>
          <NavBar
            hasBackButton={hasBackButton}
            withSchedule={withSchedule}
            withPhotobooth={withPhotobooth}
            hideLoginButton={hideLoginButton}
          />
        </Suspense>
      </RelatedVenuesProvider>

      <div className="navbar-margin">{children}</div>

      <Footer />
      <NewProfileModal venue={venue} />
    </>
  );
};

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
