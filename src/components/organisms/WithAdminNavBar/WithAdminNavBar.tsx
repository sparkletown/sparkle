import React, { lazy, Suspense } from "react";

import { WorldId } from "types/id";

import { tracePromise } from "utils/performance";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
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

export interface WithAdminNavBarProps {
  hasBackButton?: boolean;
  withHiddenLoginButton?: boolean;
  title?: string;
  variant?: "internal-scroll";
}

export const WithAdminNavBar: React.FC<WithAdminNavBarProps> = ({
  hasBackButton,
  withHiddenLoginButton,
  title,
  variant,
  children,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space, spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const worldId = space?.worldId as WorldId | undefined;
  
  // @debt remove backButton from Navbar
  return (
    <>
      {/* @debt ideally we would have a better 'higher level' location we could include this provider that covers
       *    all of the admin components that currently directly render WithAdminNavBar. We should refactor them
       *    all to have a standard 'admin wrapper frame' in a similar way to how src/pages/VenuePage/TemplateWrapper.tsx
       *    works on the user side of things.
       */}
      <RelatedVenuesProvider venueId={spaceId} worldId={worldId}>
        <Suspense fallback={<Loading />}>
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
      <NewProfileModal venue={space} />
    </>
  );
};
