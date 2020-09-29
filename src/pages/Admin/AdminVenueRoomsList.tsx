import React from "react";
import { CampRoomData } from "types/CampRoomData";
import { AdminVenueRoomDetails } from "./AdminVenueRoomDetails";
import { isCampVenue } from "types/CampVenue";
import { canHaveSubvenues } from "utils/venue";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { Link } from "react-router-dom";

interface Props {
  venue: WithId<Venue>;
}

export const AdminVenueRoomsList: React.FC<Props> = ({ venue }) => {
  const rooms = isCampVenue(venue) ? venue.rooms : [];

  return (
    <div>
      <div>{rooms.length} Rooms</div>
      {canHaveSubvenues(venue) && (
        <Link to={`/admin/venue/rooms/${venue.id}`} className="btn btn-block">
          Add a Room
        </Link>
      )}
      {rooms &&
        rooms.map((room: CampRoomData, idx: number) => (
          <AdminVenueRoomDetails key={idx} room={room} />
        ))}
    </div>
  );
};
