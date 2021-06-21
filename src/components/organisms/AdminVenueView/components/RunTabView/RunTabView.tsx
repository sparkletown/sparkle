import React from "react";
import { FormControl } from "react-bootstrap";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { Container } from "pages/Account/Venue/VenueMapEdition/Container";
import { AdminVenueRoomsList } from "pages/Admin/AdminVenueRoomsList";

import { AdvancedSettingsButton } from "components/organisms/AdminVenueView/components/AdvancedSettingsButton/AdvancedSettingsButton";
import { RunTabToolbar } from "components/organisms/AdminVenueView/components/RunTabToolbar/RunTabToolbar";

import "./RunTabView.scss";

const noop = () => undefined;

export const RunTabView: React.FC = () => {
  const { user, profile } = useUser();
  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const error = null;

  return (
    <div className="RunTabView">
      <div className="RunTabView__sidebar">
        <h3 className="RunTabView__title">Run your space</h3>
        <AdvancedSettingsButton id={venueId} />
        <div className="row-container">
          <h4>Current Venue Owners</h4>
          <div className="user-row">
            <div className="info-container">
              <img src={profile?.pictureUrl} alt="profile pic" />
              {user?.displayName}
            </div>
            <div>Loading...</div>
            <button className="btn btn-primary" onClick={noop}>
              (pokes with stick) C&apos;mon do something
            </button>
          </div>
          {error && <div>{error}</div>}
        </div>
        <FormControl
          className="text-input"
          autoFocus
          placeholder="Search users..."
          onChange={noop}
        />
        <div className="row-container">something in the row</div>
      </div>
      <div className="RunTabView__main">
        <RunTabToolbar venueId={venueId} />
        <div className="RunTabView__map">
          <Container
            interactive
            resizable
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
            otherIcons={{}}
          />
        </div>
        <div className="RunTabView__cards">
          <AdminVenueRoomsList venue={venue as WithId<AnyVenue>} />
        </div>
      </div>
    </div>
  );
};
