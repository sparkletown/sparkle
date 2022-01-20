import React, { lazy, Suspense } from "react";

import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { tracePromise } from "utils/performance";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

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
  withRadio?: boolean;
  withPhotobooth?: boolean;
  withHiddenLoginButton?: boolean;
  title?: string;
  variant?: "internal-scroll";
  space: SpaceWithId;
  spaceId: SpaceId;
  worldId: WorldId;
}

export const WithNavigationBar: React.FC<WithNavigationBarProps> = ({
  hasBackButton,
  withSchedule,
  withPhotobooth,
  withHiddenLoginButton,
  withRadio,
  title,
  variant,
  space,
  spaceId,
  worldId,
  children,
}) => (
  <>
    {/* @debt ideally we would have a better 'higher level' location we could include this provider that covers
     *    all of the admin components that currently directly render WithNavigationBar. We should refactor them
     *    all to have a standard 'admin wrapper frame' in a similar way to how src/pages/VenuePage/TemplateWrapper.tsx
     *    works on the user side of things.
     */}
    <RelatedVenuesProvider spaceId={spaceId} worldId={worldId}>
      <Suspense fallback={<Loading />}>
        {/* @debt remove backButton from Navbar */}
        <NavBar
          hasBackButton={hasBackButton}
          withSchedule={withSchedule}
          withPhotobooth={withPhotobooth}
          withHiddenLoginButton={withHiddenLoginButton}
          withRadio={withRadio}
          title={title}
        />
      </Suspense>
    </RelatedVenuesProvider>

    {variant === "internal-scroll" ? (
      <div className="WithNavigationBar__wrapper WithNavigationBar__wrapper--internal-scroll">
        <div className="WithNavigationBar__slider WithNavigationBar__slider--internal-scroll">
          {children}
        </div>
      </div>
    ) : (
      <div className="WithNavigationBar__wrapper">{children}</div>
    )}

    <Footer />
    <NewProfileModal venue={space} />
  </>
);

/**
 * @deprecated use named export instead
 */
export default WithNavigationBar;
