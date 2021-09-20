import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import { PortalEditType } from "types/settings";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGSettingsUrl } from "utils/url";

import { RunTabRooms } from "components/organisms/AdminVenueView/components/RunTabRooms/RunTabRooms";
import { RunTabToolbar } from "components/organisms/AdminVenueView/components/RunTabToolbar/RunTabToolbar";
import { RunTabUsers } from "components/organisms/AdminVenueView/components/RunTabUsers/RunTabUsers";

import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";

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
    <div className="RunTabView">
      <div className="RunTabView__sidebar">
        <div className="RunTabView__title">Run your space</div>
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
      <div className="RunTabView__main">
        <div className="RunTabView__toolbar RunTabView--spacing">
          <RunTabToolbar venueId={venueId} venueName={venue.name} />
        </div>
        <div className="RunTabView__map RunTabView--spacing">
          <MapPreview
            isEditing
            editType={PortalEditType.multiple}
            mapBackground={venue?.mapBackgroundImageUrl}
            rooms={venue?.rooms ?? []}
          />{" "}
        </div>
        <div className="RunTabView__cards RunTabView--spacing">
          <RunTabRooms venue={venue} />
        </div>
      </div>
    </div>
  );
};
