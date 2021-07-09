import React from "react";
import { Link } from "react-router-dom";

import { isVenueWithRooms } from "types/venues";

import { canHaveSubvenues } from "utils/venue";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import { VenueListProps } from "./VenueList.types";

const VenueList: React.FC<VenueListProps> = ({
  selectedVenueId,
  roomIndex,
}) => {
  const { relatedVenues, isLoading } = useRelatedVenues({
    currentVenueId: selectedVenueId,
  });

  if (isLoading) return <>Loading...</>;

  return (
    <>
      <div className="page-container-adminsidebar-title title">My Venues</div>
      <div className="page-container-adminsidebar-top">
        <Link to="/admin-ng/venue/creation" className="btn btn-primary">
          Create a venue
        </Link>
      </div>
      <ul className="page-container-adminsidebar-venueslist">
        {relatedVenues.map((venue) => (
          <li
            key={venue.id}
            className={`${selectedVenueId === venue.id ? "selected" : ""} ${
              canHaveSubvenues(venue) ? "camp" : ""
            }`}
          >
            <Link to={`/admin-ng/venue/${venue.id}`}>{venue.name}</Link>
            {isVenueWithRooms(venue) && venue.rooms && (
              <ul className="page-container-adminsidebar-subvenueslist">
                {venue.rooms.map((room, idx) => (
                  <li
                    key={idx}
                    className={`${idx === roomIndex ? "selected" : ""}`}
                  >
                    <Link to={`/admin-ng/venue/${venue.id}?roomIndex=${idx}`}>
                      {room.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default VenueList;
