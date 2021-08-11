import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { AnyVenue, PartyMapVenue } from "types/venues";

import { WithId } from "utils/id";
import { adminNGSettingsUrl } from "utils/url";

import { PartyMapContainer } from "pages/Account/Venue/VenueMapEdition";

import { RunTabRooms } from "components/organisms/AdminVenueView/components/RunTabRooms/RunTabRooms";
import { RunTabToolbar } from "components/organisms/AdminVenueView/components/RunTabToolbar/RunTabToolbar";
import { RunTabUsers } from "components/organisms/AdminVenueView/components/RunTabUsers/RunTabUsers";

import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

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
          <RunTabToolbar venueId={venueId} />
        </div>
        <div className="RunTabView__map RunTabView--spacing">
          <PartyMapContainer
            interactive
            resizable
            venue={venue as PartyMapVenue}
            coordinatesBoundary={{
              width: 100,
              height: 100,
            }}
            snapToGrid={false}
            iconsMap={{}}
            backgroundImage={
              venue?.mapBackgroundImageUrl ?? DEFAULT_MAP_BACKGROUND
            }
            iconImageStyle={{}}
            draggableIconImageStyle={{}}
            otherIconsStyle={{ opacity: 0.4 }}
          />
        </div>
        <div className="RunTabView__cards RunTabView--spacing">
          <RunTabRooms venue={venue} />
        </div>
      </div>
    </div>
  );
};
