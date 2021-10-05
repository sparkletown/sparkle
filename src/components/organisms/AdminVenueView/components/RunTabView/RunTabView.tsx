import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGSettingsUrl } from "utils/url";

import MapPreview from "pages/Admin/MapPreview";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import {
  AdminSidebarFooter,
  AdminSidebarFooterProps,
} from "components/organisms/AdminVenueView/components/AdminSidebarFooter/AdminSidebarFooter";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { RunTabRooms } from "components/organisms/AdminVenueView/components/RunTabRooms/RunTabRooms";
import { RunTabToolbar } from "components/organisms/AdminVenueView/components/RunTabToolbar/RunTabToolbar";
import { RunTabUsers } from "components/organisms/AdminVenueView/components/RunTabUsers/RunTabUsers";

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
        <AdminSidebarTitle>Run your space</AdminSidebarTitle>
        <AdminSidebarFooter {...sidebarFooterProps} />
        <div className="RunTabView__content">
          <ButtonNG
            isLink
            className="RunTabView__advanced"
            linkTo={adminNGSettingsUrl(venueId)}
            iconName={faCog}
          >
            Advanced Settings
          </ButtonNG>
          <RunTabUsers venueId={venueId} />
        </div>
      </AdminSidebar>
      <AdminShowcase className="RunTabView__main">
        <div className="RunTabView__toolbar RunTabView--spacing">
          <RunTabToolbar venueId={venueId} venueName={venue.name} />
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
