import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Room } from "types/rooms";
import { AnyVenue, isVenueWithRooms, VenueEvent } from "types/venues";

import { WithId } from "utils/id";
import { canHaveSubvenues } from "utils/venue";

import AdminDeleteEvent from "./AdminDeleteEvent";
import AdminEventModal from "./AdminEventModal";
import { AdminVenueRoomDetails } from "./AdminVenueRoomDetails";

interface Props {
  venue: WithId<AnyVenue>;
}

export const AdminVenueRoomsList: React.FC<Props> = ({ venue }) => {
  const rooms = isVenueWithRooms(venue) ? venue.rooms : [];

  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [roomName, setRoomName] = useState("");

  return (
    <div className="rooms-list-container">
      <div className="room-stats">
        <div className="rooms-counter">{rooms?.length ?? 0} Rooms</div>
        <div className="add-room-button">
          {canHaveSubvenues(venue) && (
            <Link
              to={`/admin/venue/rooms/${venue.id}`}
              className="btn btn-block"
            >
              Add a Room
            </Link>
          )}
        </div>
      </div>
      {rooms &&
        rooms.map((room: Room, idx: number) => (
          <AdminVenueRoomDetails
            key={idx}
            index={idx}
            venue={venue}
            room={room}
            setEditedEvent={setEditedEvent}
            setShowCreateEventModal={(param1: boolean, param2: string) => {
              setShowCreateEventModal(param1);
              setRoomName(param2);
            }}
            setShowDeleteEventModal={setShowDeleteEventModal}
          />
        ))}
      <AdminEventModal
        show={showCreateEventModal}
        onHide={() => {
          setShowCreateEventModal(false);
          setEditedEvent && setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
        template={venue.template}
        setEditedEvent={setEditedEvent}
        setShowDeleteEventModal={setShowDeleteEventModal}
        roomName={roomName}
      />
      <AdminDeleteEvent
        show={showDeleteEventModal}
        onHide={() => {
          setShowDeleteEventModal(false);
          // setEditedEvent && setEditedEvent(undefined);
        }}
        venueId={venue.id}
        event={editedEvent}
      />
    </div>
  );
};
