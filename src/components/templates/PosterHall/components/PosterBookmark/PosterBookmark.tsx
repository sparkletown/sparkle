import React, { MouseEventHandler, useCallback, useState } from "react";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import { updatePersonalizedSchedule, savePosterToProfile } from "api/profile";

import { Bookmark } from "components/atoms/Bookmark";

import { useUser } from "hooks/useUser";
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

  const bookmarkPoster: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (userWithId?.id && venueId) {
      savePosterToProfile({
        venueId: venueId,
        userId: userWithId?.id,
        removeMode: isBookmarkedPoster,
      });
    }
    venueEvents
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
  }, [userWithId, isBookmarkedPoster, venueId, venueEvents]);

  return <Bookmark onClick={bookmarkPoster} isSaved={isBookmarkedPoster} />;
};
