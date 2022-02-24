import React, { lazy } from "react";

import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { tracePromise } from "utils/performance";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { MobileWarning } from "components/atoms/MobileWarning";
import { Footer } from "components/molecules/Footer";
import { NewProfileModal } from "components/organisms/NewProfileModal";

import "./WithNavigationBar.scss";

const NavBar = lazy(() =>
  tracePromise("WithNavigationBar::lazy-import::NavBar", () =>
    import("components/molecules/NavBar").then(({ NavBar }) => ({
      default: NavBar,
    }))
  )
);

interface WithNavigationBarProps {
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
    <RelatedVenuesProvider spaceId={spaceId} worldId={worldId}>
      {/* @debt remove backButton from Navbar */}
      <NavBar
        hasBackButton={hasBackButton}
        withSchedule={withSchedule}
        withPhotobooth={withPhotobooth}
        withHiddenLoginButton={withHiddenLoginButton}
        withRadio={withRadio}
        title={title}
      />
    </RelatedVenuesProvider>

    <MobileWarning />

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
    <NewProfileModal space={space} />
  </>
);
