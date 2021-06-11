import React, { MouseEventHandler, useCallback, useState } from "react";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import { updatePersonalizedSchedule, savePosterToProfile } from "api/profile";

import { Bookmark } from "components/atoms/Bookmark";

import { useUser } from "hooks/useUser";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useVenueEvents } from "hooks/events";

export const emptySavedPosters = {};

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
}

export const PosterBookmark: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const venueId = posterVenue.id;

  const { events: venueEvents } = useVenueEvents({
    venueIds: [venueId],
  });

  const { userWithId } = useUser();
  const [isBookmarkedPoster, setBookmarkPoster] = useState(
    userWithId?.savedPosters
      ? userWithId.savedPosters[venueId]?.[0] === venueId
      : false
  );

  const bookmarkPoster = useCallback(() => {
    if (userWithId?.id && venueId) {
      savePosterToProfile({
        venueId: venueId,
        userId: userWithId?.id,
        removeMode: isBookmarkedPoster,
      });
    }
    relatedVenueEvents
      .filter((event) => event.venueId === venueId)
      .map((event) => {
        userWithId?.id &&
          event.id &&
          updatePersonalizedSchedule({
            event: event,
            userId: userWithId?.id,
            removeMode: isBookmarkedPoster,
          });
        return {};
      });
    setBookmarkPoster(!isBookmarkedPoster);
  }, [userWithId, isBookmarkedPoster, venueId, relatedVenueEvents]);

  return <Bookmark onClick={bookmarkPoster} isSaved={isBookmarkedPoster} />;
};
