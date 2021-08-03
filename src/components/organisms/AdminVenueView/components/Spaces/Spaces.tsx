import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faCaretDown,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import { useShowHide } from "hooks/useShowHide";

import { VenueTemplate, Venue_v2 } from "types/venues";
import { RoomData_v2, RoomTemplate, VenueRoomTemplate } from "types/rooms";
import { Dimensions, Position } from "types/utility";

import { BackgroundSelect } from "pages/Admin/BackgroundSelect";
import { VenueRoomItem } from "components/molecules/VenueRoomItem";
import { EditRoomForm } from "components/molecules/EditRoomForm";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";

import RoomIconConversation from "assets/icons/icon-room-conversation.svg";
import RoomIconAuditorium from "assets/icons/icon-room-auditorium.svg";
import RoomIconMusicBar from "assets/icons/icon-room-musicbar.svg";
import RoomIconBurnBarrel from "assets/icons/icon-room-burnbarrel.svg";
import RoomIconArtPiece from "assets/icons/icon-room-artpiece.svg";
import RoomIconExperience from "assets/icons/icon-room-experience.svg";
import RoomIconExternalLink from "assets/icons/icon-room-externallink.svg";
import RoomIconMap from "assets/icons/icon-room-map.svg";

import "./Spaces.scss";

interface VenueRooms {
  text: string;
  template?: VenueRoomTemplate;
  icon: string;
}

const venueRooms: VenueRooms[] = [
  {
    text: "Conversation Space",
    icon: RoomIconConversation,
    template: VenueTemplate.conversationspace,
  },
  {
    text: "Auditorium",
    icon: RoomIconAuditorium,
    template: VenueTemplate.audience,
  },
  {
    text: "Music Bar",
    icon: RoomIconMusicBar,
    template: VenueTemplate.jazzbar,
  },
  {
    text: "Burn Barrel",
    icon: RoomIconBurnBarrel,
    template: VenueTemplate.firebarrel,
  },
  {
    text: "Art Piece",
    icon: RoomIconArtPiece,
    template: VenueTemplate.artpiece,
  },
  {
    text: "Experience",
    icon: RoomIconExperience,
    template: VenueTemplate.zoomroom,
  },
  {
    text: "External link",
    icon: RoomIconExternalLink,
    template: RoomTemplate.external,
  },
  {
    text: "Map",
    icon: RoomIconMap,
    template: VenueTemplate.partymap,
  },
];

export interface SpacesProps {
  venue: Venue_v2;
  onClickNext: () => void;
}

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

  const renderAddRooms = useMemo(
    () =>
      venueRooms.map((venueRoom, index) => (
        <VenueRoomItem
          key={`${venueRoom.text}-${index}`}
          text={venueRoom.text}
          template={venueRoom.template}
          icon={venueRoom.icon}
        />
      )),
    []
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
            <div className="Spaces__background">
              <div className="Spaces__title">Build your spaces</div>
            </div>
            <div>
              <div
                className="Spaces__venue-rooms"
                onClick={toggleShowAdvancedSettings}
              >
                <div>Map background</div>
                <FontAwesomeIcon
                  icon={showAdvancedSettings ? faCaretDown : faCaretRight}
                />{" "}
              </div>
              {showAdvancedSettings && (
                <BackgroundSelect venueName={venue.name} />
              )}
            </div>

            <div>
              <div className="Spaces__venue-rooms" onClick={toggleShowRooms}>
                <div>{numberOfRooms} Rooms</div>
                <FontAwesomeIcon
                  icon={showRooms ? faCaretDown : faCaretRight}
                />
              </div>

              {showRooms && renderVenueRooms}
            </div>

            <div className="Spaces__venue-rooms" onClick={toggleShowAddRoom}>
              <div>Add rooms</div>
              <FontAwesomeIcon
                icon={showAddRoom ? faCaretDown : faCaretRight}
              />
            </div>
            {showAddRoom && renderAddRooms}
            <div className="Spaces__footer">
              <div className="Spaces__home-button" onClick={navigateToAdmin}>
                <FontAwesomeIcon icon={faHome} />
              </div>
              <div className="Spaces__nav-buttons">
                <div className="Spaces__back-button" onClick={navigateToAdmin}>
                  Back
                </div>
                <div className="Spaces__next-button" onClick={onClickNext}>
                  Next
                </div>
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
