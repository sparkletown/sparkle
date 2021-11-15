import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import { SPACE_TAXON } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGSettingsUrl } from "utils/url";

import MapPreview from "pages/Admin/MapPreview";
import { RunTabRooms } from "pages/AdminVenueView/components/RunTabRooms/RunTabRooms";
import { RunTabToolbar } from "pages/AdminVenueView/components/RunTabToolbar/RunTabToolbar";
import { RunTabUsers } from "pages/AdminVenueView/components/RunTabUsers/RunTabUsers";

import { AdminPanel } from "components/molecules/AdminPanel";
import { AdminShowcase } from "components/molecules/AdminShowcase";
import { AdminSidebar } from "components/molecules/AdminSidebar";
import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/molecules/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/molecules/AdminSidebarTitle";
import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./RunTabView.scss";

export interface RunTabViewProps extends AdminSidebarFooterProps {
  venue?: WithId<AnyVenue>;
}

export const RunTabView: React.FC<RunTabViewProps> = ({
  venue,
  ...sidebarFooterProps
}) => {
  if (!venue) {
    return <LoadingPage />;
  }

  const venueId = venue.id;

  return (
    <AdminPanel className="RunTabView">
      <AdminSidebar>
        <AdminSidebarTitle>Run your {SPACE_TAXON.lower}</AdminSidebarTitle>
        <AdminSidebarFooter {...sidebarFooterProps} />
        <div className="RunTabView__content">
          <ButtonNG
            isLink
            className="RunTabView__advanced"
            linkTo={adminNGSettingsUrl(venueId)}
            iconName={faCog}
          >
            {SPACE_TAXON.capital} Settings
          </ButtonNG>
          <RunTabUsers venueId={venueId} />
        </div>
      </AdminSidebar>
      <AdminShowcase className="RunTabView__main">
        <div className="RunTabView__toolbar RunTabView--spacing">
          <RunTabToolbar
            venueId={venueId}
            venueName={venue.name}
            announcement={venue.banner}
          />
        </div>
        <div className="RunTabView__map RunTabView--spacing">
          <MapPreview
            isEditing
            worldId={venue.worldId}
            venueId={venue.id}
            venueName={venue.name}
            mapBackground={venue.mapBackgroundImageUrl}
            rooms={venue.rooms ?? []}
          />
        </div>
        <div className="RunTabView__cards RunTabView--spacing">
          <RunTabRooms venue={venue} />
        </div>
      </AdminShowcase>
    </AdminPanel>
  );
};
