import React from "react";

import { ALWAYS_EMPTY_ARRAY, SPACE_TAXON } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { AdminPanel } from "components/organisms/AdminVenueView/components/AdminPanel";
import { AdminShowcase } from "components/organisms/AdminVenueView/components/AdminShowcase";
import { AdminSidebar } from "components/organisms/AdminVenueView/components/AdminSidebar";

import { LoadingPage } from "components/molecules/LoadingPage";
import { UserList } from "components/molecules/UserList";

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

  return (
    <AdminPanel variant="unbound" className="RunTabView">
      <AdminSidebar>
        <AdminSidebarSectionTitle>
          Run your {SPACE_TAXON.lower}
        </AdminSidebarSectionTitle>
      </AdminSidebar>
      <div className="RunTabView__body">
        <div className="RunTabView__user-list">
          <UserList
            usersSample={venue?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            userCount={venue?.recentUserCount ?? 0}
            showTitle={false}
            activity={`in ${SPACE_TAXON.lower}`}
          />
        </div>
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
      </div>
    </AdminPanel>
  );
};
