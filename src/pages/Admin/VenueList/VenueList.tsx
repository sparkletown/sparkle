import React from "react";
import { Link } from "react-router-dom";

import { isVenueWithRooms } from "types/venues";

import { orderedVenuesSelector } from "utils/selectors";
import { canHaveSubvenues } from "utils/venue";

import { useSelector } from "hooks/useSelector";

import { VenueListProps } from "./VenueList.types";

const VenueList: React.FC<VenueListProps> = ({
  selectedVenueId,
  roomIndex,
}) => {
  // @debt This selector relies on all venues in firebase being loaded into memory.. not very efficient
  const venues = useSelector(orderedVenuesSelector);

  if (!venues) return <>Loading...</>;

  return (
    <>
      <div className="page-container-adminsidebar-title title">My Venues</div>
      <div className="page-container-adminsidebar-top">
        <Link to="/admin-ng/create/venue" className="btn btn-primary">
          Create a venue
        </Link>
      </div>
      <ul className="page-container-adminsidebar-venueslist">
        {venues.map((venue, index) => (
          <li
            key={index}
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
