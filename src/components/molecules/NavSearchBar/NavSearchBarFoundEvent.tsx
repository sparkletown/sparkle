import React from "react";

import { DEFAULT_VENUE_LOGO } from "settings";

import { Room } from "types/rooms";
import { AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { uppercaseFirstChar } from "utils/string";
import { formatUtcSecondsRelativeToNow } from "utils/time";

import { useValidImage } from "hooks/useCheckImage";

import { NavSearchResult } from "components/molecules/NavSearchBar/NavSearchResult";

interface NavSearchBarFoundEventProps {
  event: WithVenueId<WithId<VenueEvent>>;
  enabledRelatedRooms: Room[];
  relatedVenues: WithId<AnyVenue>[];
  onClick: () => void;
}

export const NavSearchBarFoundEvent: React.FC<NavSearchBarFoundEventProps> = ({
  event,
  enabledRelatedRooms,
  relatedVenues,
  onClick,
}) => {
  const [imageUrl] = useValidImage(
    enabledRelatedRooms.find((room) => room.title === event.room)?.image_url ??
      relatedVenues.find((venue) => venue.id === event.venueId)?.host?.icon,
    DEFAULT_VENUE_LOGO
  );

  return (
    <NavSearchResult
      title={event.name}
      description={`Event - ${uppercaseFirstChar(
        formatUtcSecondsRelativeToNow(event.start_utc_seconds)
      )}`}
      image={imageUrl}
      onClick={onClick}
    />
  );
};
