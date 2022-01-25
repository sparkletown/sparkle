import React, { lazy, Suspense } from "react";

import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { tracePromise } from "utils/performance";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { NewProfileModal } from "components/organisms/NewProfileModal";

import { Footer } from "components/molecules/Footer";
import { Loading } from "components/molecules/Loading";

import "./WithAdminNavBar.scss";

const AdminNavBar = lazy(() =>
  tracePromise("WithAdminNavBar::lazy-import::AdminNavBar", () =>
    import("components/molecules/AdminNavBar").then(({ AdminNavBar }) => ({
      default: AdminNavBar,
    }))
  )
);

interface WithAdminNavBarProps {
  hasBackButton?: boolean;
  withHiddenLoginButton?: boolean;
  title?: string;
  variant?: "internal-scroll";
  space: SpaceWithId;
  spaceId: SpaceId;
  worldId: WorldId;
}

export const WithAdminNavBar: React.FC<WithAdminNavBarProps> = ({
  hasBackButton,
  withHiddenLoginButton,
  title,
  variant,
  space,
  spaceId,
  worldId,
  children,
}) => (
  <>
    <RelatedVenuesProvider spaceId={spaceId} worldId={worldId}>
      <Suspense fallback={<Loading />}>
        {/* @debt remove backButton from Navbar */}
        <AdminNavBar
          hasBackButton={hasBackButton}
          withHiddenLoginButton={withHiddenLoginButton}
          title={title}
        />
      </Suspense>
    </RelatedVenuesProvider>
    {variant === "internal-scroll" ? (
      <div className="WithAdminNavBar__wrapper WithAdminNavBar__wrapper--internal-scroll">
        <div className="WithAdminNavBar__slider WithAdminNavBar__slider--internal-scroll">
          {children}
        </div>
      </div>
    ) : (
      <div className="WithAdminNavBar__wrapper">{children}</div>
    )}
    <Footer />
    <NewProfileModal space={space} />
  </>
);
