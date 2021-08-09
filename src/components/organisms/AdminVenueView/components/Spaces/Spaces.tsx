import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faCaretDown,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import { SPACES_PORTALS } from "settings";

import { Venue_v2 } from "types/venues";
import { RoomData_v2 } from "types/rooms";
import { Dimensions, Position } from "types/utility";

import { useShowHide } from "hooks/useShowHide";

import { BackgroundSelect } from "pages/Admin/BackgroundSelect";
import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { PortalItem } from "components/molecules/PortalItem";
import { EditRoomForm } from "components/molecules/EditRoomForm";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";

import "./Spaces.scss";

export interface SpacesProps {
  venue: Venue_v2;
  onClickNext: () => void;
}

// @debt there is no guarantee the mutable array pointed by the shared reference will remain empty
const emptyRoomsArray: RoomData_v2[] = [];

export const Spaces: React.FC<SpacesProps> = ({ venue, onClickNext }) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomData_v2>();
  const [updatedRoom, setUpdatedRoom] = useState<RoomData_v2>({});

  const { isShown: showRooms, toggle: toggleShowRooms } = useShowHide(false);
  const { isShown: showAddRoom, toggle: toggleShowAddRoom } = useShowHide(
    false
  );
  const {
    isShown: showAdvancedSettings,
    toggle: toggleShowAdvancedSettings,
  } = useShowHide(false);

  const history = useHistory();

  const hasSelectedRoom = !!selectedRoom;
  const numberOfRooms = venue.rooms?.length ?? 0;

  const clearSelectedRoom = useCallback(() => {
    setSelectedRoom(undefined);
    setUpdatedRoom({});
  }, []);

  const updateRoomPosition = useCallback(async (position: Position) => {
    if (!position) return;

    setUpdatedRoom((room) => ({
      ...room,
      x_percent: position.left,
      y_percent: position.top,
    }));
  }, []);

  const updateRoomSize = useCallback(async (size: Dimensions) => {
    if (!size) return;

    setUpdatedRoom((room) => ({
      ...room,
      width_percent: size.width,
      height_percent: size.height,
    }));
  }, []);

  const renderVenueRooms = useMemo(
    () =>
      venue.rooms?.map((room, index) => (
        <div
          key={`${index}-${room.title}`}
          className="Spaces__venue-room"
          onClick={() => setSelectedRoom(room)}
        >
          <div
            className="Spaces__venue-room-logo"
            style={{ backgroundImage: `url(${room.image_url})` }}
          />
          <div className="Spaces__venue-room-title">{room.title}</div>
        </div>
      )),
    [venue.rooms]
  );

  const onAdd = useCallback(
    ({ data }) => {
      const created =
        venue.rooms?.[data?.roomIndex] ??
        (data?.rooms)[data?.roomIndex] ??
        data?.provided?.room;
      if (!created) return;

      setSelectedRoom(created);
    },
    [setSelectedRoom, venue.rooms]
  );

  const renderAddRooms = useMemo(
    () =>
      SPACES_PORTALS.map((portal, index) => {
        return (
          <PortalItem
            key={`${portal.text}-${index}`}
            portal={portal}
            onAdd={onAdd}
          />
        );
      }),
    [onAdd]
  );

  const navigateToAdmin = useCallback(() => {
    history.push("/admin-ng/");
  }, [history]);

  const selectedRoomIndex =
    venue.rooms?.findIndex((room) => room === selectedRoom) ?? -1;

  return (
    <div className="Spaces">
      <div className="Spaces__rooms">
        {selectedRoom ? (
          <EditRoomForm
            room={selectedRoom}
            updatedRoom={updatedRoom}
            roomIndex={selectedRoomIndex}
            onBackClick={clearSelectedRoom}
            onDelete={clearSelectedRoom}
            onEdit={clearSelectedRoom}
          />
        ) : (
          <>
            <div className="Spaces__accordion-item">
              <div className="Spaces__accordion-title">Build your spaces</div>
            </div>
            <div className="Spaces__accordion-item">
              <div
                className="Spaces__accordion-item-title"
                onClick={toggleShowAdvancedSettings}
                title={showAdvancedSettings ? "Collapse" : "Expand"}
              >
                <div>Map background</div>
                <FontAwesomeIcon
                  icon={showAdvancedSettings ? faCaretDown : faCaretRight}
                />
              </div>
              {showAdvancedSettings && (
                <BackgroundSelect venueName={venue.name} />
              )}
            </div>

            <div className="Spaces__accordion-item">
              <div
                className="Spaces__accordion-item-title"
                onClick={toggleShowRooms}
                title={showRooms ? "Collapse" : "Expand"}
              >
                <div>{numberOfRooms} Rooms</div>
                <FontAwesomeIcon
                  icon={showRooms ? faCaretDown : faCaretRight}
                />
              </div>
              {showRooms && renderVenueRooms}
            </div>

            <div className="Spaces__accordion-item">
              <div
                className="Spaces__accordion-item-title"
                onClick={toggleShowAddRoom}
                title={showAddRoom ? "Collapse" : "Expand"}
              >
                <div>Add rooms</div>
                <FontAwesomeIcon
                  icon={showAddRoom ? faCaretDown : faCaretRight}
                />
              </div>
              {showAddRoom && renderAddRooms}
            </div>
            <div className="Spaces__footer">
              <div className="Spaces__nav-buttons">
                <ButtonNG
                  className="Spaces__nav-button"
                  onClick={navigateToAdmin}
                  iconName={faHome}
                  iconOnly={true}
                  title="Home"
                />
                <ButtonNG
                  className="Spaces__nav-button"
                  onClick={navigateToAdmin}
                >
                  Back
                </ButtonNG>
                <ButtonNG
                  className="Spaces__nav-button"
                  onClick={onClickNext}
                  variant="primary"
                >
                  Next
                </ButtonNG>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="Spaces__map">
        <MapPreview
          isEditing={hasSelectedRoom}
          mapBackground={venue.mapBackgroundImageUrl}
          setSelectedRoom={setSelectedRoom}
          rooms={venue.rooms ?? emptyRoomsArray}
          onMoveRoom={updateRoomPosition}
          onResizeRoom={updateRoomSize}
          selectedRoom={selectedRoom}
        />
      </div>
    </div>
  );
};
