import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useVenueId } from "hooks/useVenueId";

import { SpaceEditorStartPanel } from "pages/Admin/Details";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminRestricted } from "components/atoms/AdminRestricted";
import { NotFound } from "components/atoms/NotFound";

import "./SpaceEditWizard.scss";

export const SpaceEditWizard: React.FC = () => {
  const venueId = useVenueId();
  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );

  if (!isCurrentVenueLoaded) {
    return <LoadingPage />;
  }

  if (!currentVenue) {
    return <NotFound />;
  }

  return (
    <WithNavigationBar>
      <AdminRestricted>
        <div className="SpaceWizard">
          <div className="SpaceWizard__pad"> </div>
          <SpaceEditorStartPanel venue={currentVenue} />
        </div>
      </AdminRestricted>
    </WithNavigationBar>
  );
};
