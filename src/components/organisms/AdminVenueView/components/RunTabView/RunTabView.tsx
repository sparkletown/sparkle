import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { adminNGSettingsUrl } from "utils/url";

import { useVenueId } from "hooks/useVenueId";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { RunTabToolbar } from "components/organisms/AdminVenueView/components/RunTabToolbar/RunTabToolbar";
import { RunTabRooms } from "components/organisms/AdminVenueView/components/RunTabRooms/RunTabRooms";
import { RunTabUsers } from "components/organisms/AdminVenueView/components/RunTabUsers/RunTabUsers";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import "./RunTabView.scss";
import { PartyMapContainer } from "pages/Account/Venue/VenueMapEdition";
import { PartyMapVenue } from "types/venues";

const noop = () => undefined;

export const RunTabView: React.FC = () => {
  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  if (!venue) {
    return <>{`Venue doesn't exit`}</>;
  }

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
            onChange={noop}
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
