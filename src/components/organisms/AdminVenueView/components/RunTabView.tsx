import React from "react";
import { useVenueId } from "../../../../hooks/useVenueId";
import { Button } from "../../../atoms/Button";
import { venueInsideUrl } from "../../../../utils/url";
import { DEFAULT_MAP_BACKGROUND } from "../../../../settings";
import { useConnectCurrentVenueNG } from "../../../../hooks/useConnectCurrentVenueNG";
import { Container } from "../../../../pages/Account/Venue/VenueMapEdition/Container";
import { FormControl } from "react-bootstrap";
import { useUser } from "../../../../hooks/useUser";

import "./RunTabView.scss";
import { AdminVenueRoomsList } from "../../../../pages/Admin/AdminVenueRoomsList";
import { WithId } from "../../../../utils/id";
import { AnyVenue } from "../../../../types/venues";

const noop = () => undefined;

export const RunTabView: React.FC = () => {
  const { user, profile } = useUser();
  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const error = null;

  return (
    <div className="RunTabView">
      <div className="RunTabView_sidebar">
        <h3>Run your space</h3>
        <Button customClass="RunTabView__advanced" onClick={noop}>
          Advanced settings
        </Button>
        <div className="row-container">
          <h4>Current Venue Owners</h4>
          <div className="user-row">
            <div className="info-container">
              <img src={profile?.pictureUrl} alt="profile pic" />
              {user?.displayName}
            </div>
            {false && <div>Loading...</div>}
            {!false && (
              <button className="btn btn-primary" onClick={noop}>
                (pokes with stick) C&apos;mon do something
              </button>
            )}
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
        <div className="RunTabView__toolbars">
          <div className="RunTabView__toolbar RunTabView__toolbar--left">
            <Button
              isLink={true}
              linkTo={venueId ? venueInsideUrl(venueId) : undefined}
              customClass="btn btn-primary btn-block"
              newTab={true}
            >
              Everyone
            </Button>{" "}
            <input
              name="Event search bar"
              className="input-block search-event-input"
              placeholder="Search for an event"
              onChange={noop}
              value=""
            />
          </div>
          <div className="RunTabView__toolbar RunTabView__toolbar--right">
            <Button
              isLink={true}
              linkTo={venueId ? venueInsideUrl(venueId) : undefined}
              customClass="btn btn-primary btn-block"
              newTab={true}
            >
              Visit Space
            </Button>
          </div>
        </div>
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
