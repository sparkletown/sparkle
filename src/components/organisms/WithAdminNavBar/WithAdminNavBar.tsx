import React from "react";

import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { NewProfileModal } from "components/organisms/NewProfileModal";

import { AdminNavBar } from "components/molecules/AdminNavBar";
import { Footer } from "components/molecules/Footer";

import "./WithAdminNavBar.scss";

export interface WithAdminNavBarProps {
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
      {/* @debt remove backButton from Navbar */}
      <AdminNavBar
        hasBackButton={hasBackButton}
        withHiddenLoginButton={withHiddenLoginButton}
        title={title}
      />
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
