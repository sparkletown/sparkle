import React from "react";

import { SPACE_TAXON } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import MapPreview from "pages/Admin/MapPreview";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { AdminSidebarTitle } from "components/organisms/AdminVenueView/components/AdminSidebarTitle";
import { RunTabRooms } from "components/organisms/AdminVenueView/components/RunTabRooms/RunTabRooms";
import { RunTabToolbar } from "components/organisms/AdminVenueView/components/RunTabToolbar/RunTabToolbar";
import { RunTabUsers } from "components/organisms/AdminVenueView/components/RunTabUsers/RunTabUsers";

import { LoadingPage } from "components/molecules/LoadingPage";

import "./RunTabView.scss";

export interface RunTabViewProps {
  venue?: WithId<AnyVenue>;
}

export const RunTabView: React.FC<RunTabViewProps> = ({ venue }) => {
  if (!venue) {
    return <LoadingPage />;
  }

  const venueId = venue.id;

  return (
    <AdminPanel variant="unbound" className="RunTabView">
      <AdminSidebar>
        <AdminSidebarTitle>Run your {SPACE_TAXON.lower}</AdminSidebarTitle>
        <div className="RunTabView__content">
          <RunTabUsers venueId={venueId} />
        </div>
      </AdminSidebar>
      <AdminShowcase className="RunTabView__main" variant="no-scroll">
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
