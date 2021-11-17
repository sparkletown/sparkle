import React, { lazy, Suspense } from "react";

import { tracePromise } from "utils/performance";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useSpaceParams } from "hooks/useVenueId";

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
  withHiddenLoginButton?: boolean;
}

export const WithNavigationBar: React.FC<WithNavigationBarProps> = ({
  hasBackButton,
  withSchedule,
  withPhotobooth,
  withHiddenLoginButton,
  children,
}) => {
  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

  // @debt remove backButton from Navbar
  return (
    <>
      {/* @debt ideally we would have a better 'higher level' location we could include this provider that covers
       *    all of the admin components that currently directly render WithNavigationBar. We should refactor them
       *    all to have a standard 'admin wrapper frame' in a similar way to how src/pages/VenuePage/TemplateWrapper.tsx
       *    works on the user side of things.
       */}
      <RelatedVenuesProvider venueId={venueId} worldId={space?.worldId}>
        <Suspense fallback={<Loading />}>
          <NavBar
            hasBackButton={hasBackButton}
            withSchedule={withSchedule}
            withPhotobooth={withPhotobooth}
            withHiddenLoginButton={withHiddenLoginButton}
          />
        </Suspense>
      </RelatedVenuesProvider>

      <div className="navbar-margin">{children}</div>

      <Footer />
      <NewProfileModal venue={space} />
    </>
  );
};

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
