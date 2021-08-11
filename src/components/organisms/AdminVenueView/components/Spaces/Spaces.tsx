import React, { useCallback, useMemo, useState } from "react";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { RoomData_v2, RoomTemplate, VenueRoomTemplate } from "types/rooms";
import { Dimensions, Position } from "types/utility";
import { AnyVenue, VenueTemplate } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { BackgroundSelect } from "pages/Admin/BackgroundSelect";

import { TabNavigationProps } from "components/organisms/AdminVenueView/AdminVenueView";
import { MapPreview } from "components/organisms/AdminVenueView/components/MapPreview";
import { TabFooter } from "components/organisms/AdminVenueView/components/TabFooter";

import { EditRoomForm } from "components/molecules/EditRoomForm";
import { VenueRoomItem } from "components/molecules/VenueRoomItem";

import RoomIconArtPiece from "assets/icons/icon-room-artpiece.svg";
import RoomIconAuditorium from "assets/icons/icon-room-auditorium.svg";
import RoomIconBurnBarrel from "assets/icons/icon-room-burnbarrel.svg";
import RoomIconConversation from "assets/icons/icon-room-conversation.svg";
import RoomIconExperience from "assets/icons/icon-room-experience.svg";
import RoomIconExternalLink from "assets/icons/icon-room-externallink.svg";
import RoomIconMap from "assets/icons/icon-room-map.svg";
import RoomIconMusicBar from "assets/icons/icon-room-musicbar.svg";

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

interface SpacesProps extends TabNavigationProps {
  venue?: WithId<AnyVenue>;
}

const emptyRoomsArray: RoomData_v2[] = [];

export const Spaces: React.FC<SpacesProps> = ({
  venue,
  ...tabNavigationProps
}) => {
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

  const hasSelectedRoom = !!selectedRoom;
  const numberOfRooms = venue?.rooms?.length ?? 0;

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
      venue?.rooms?.map((room, index) => (
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
    [venue?.rooms]
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

  const selectedRoomIndex =
    venue?.rooms?.findIndex((room) => room === selectedRoom) ?? -1;

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
            <div className="Spaces__options">
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
                  <BackgroundSelect venueName={venue?.name ?? ""} />
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
            </div>
            <TabFooter {...tabNavigationProps} />
          </>
        )}
      </div>
      <div className="Spaces__map">
        <MapPreview
          isEditing={hasSelectedRoom}
          mapBackground={venue?.mapBackgroundImageUrl}
          setSelectedRoom={setSelectedRoom}
          rooms={venue?.rooms ?? emptyRoomsArray}
          onMoveRoom={updateRoomPosition}
          onResizeRoom={updateRoomSize}
          selectedRoom={selectedRoom}
        />
      </div>
    </div>
  );
};
