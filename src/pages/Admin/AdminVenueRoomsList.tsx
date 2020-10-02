import React, { useState } from "react";
import { CampRoomData } from "types/CampRoomData";
import { AdminVenueRoomDetails } from "./AdminVenueRoomDetails";
import { isCampVenue } from "types/CampVenue";
import { canHaveSubvenues } from "utils/venue";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { Link } from "react-router-dom";
import AdminEventModal from "./AdminEventModal";
import AdminDeleteEvent from "./AdminDeleteEvent";
import { VenueEvent } from "types/VenueEvent";

interface Props {
  venue: WithId<Venue>;
}

export const AdminVenueRoomsList: React.FC<Props> = ({ venue }) => {
  const rooms = isCampVenue(venue) ? venue.rooms : [];

  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);

  return (
    <div className="rooms-list-container">
      <div className="room-stats">
        <div className="rooms-counter">{rooms.length} Rooms</div>
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
        rooms.map((room: CampRoomData, idx: number) => (
          <AdminVenueRoomDetails
            key={idx}
            index={idx}
            venue={venue}
            room={room}
            setEditedEvent={setEditedEvent}
            setShowCreateEventModal={setShowCreateEventModal}
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
