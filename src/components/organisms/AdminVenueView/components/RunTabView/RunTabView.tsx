import React from "react";

import { SPACE_TAXON } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";
import { RunTabUsers } from "components/organisms/AdminVenueView/components/RunTabUsers/RunTabUsers";

import { LoadingPage } from "components/molecules/LoadingPage";

import { AdminSidebarSectionTitle } from "../AdminSidebarSectionTitle";
import { MapPreview } from "../MapPreview";

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
        <AdminSidebarSectionTitle>
          Run your {SPACE_TAXON.lower}
        </AdminSidebarSectionTitle>
        <div className="RunTabView__content">
          <RunTabUsers venueId={venueId} />
        </div>
      </AdminSidebar>
      <AdminShowcase>
        <div className="RunTabView__map RunTabView--spacing">
          <MapPreview
            isEditing={false}
            mapBackground={venue?.mapBackgroundImageUrl}
            rooms={venue.rooms || []}
            setSelectedRoom={() => undefined}
          />
        </div>
      </AdminShowcase>
    </AdminPanel>
  );
};
