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

  const { relatedVenueIds } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const { events: relatedVenueEvents } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const { userWithId } = useUser();
  const userPosterIds = userWithId?.savedPosters ?? emptySavedPosters;

  const [isBookmarkedPoster, setBookmarkPoster] = useState(
    //@ts-ignore
    userPosterIds[venueId]?.[0] === venueId
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
    return relatedVenueEvents;
  }, [userWithId, isBookmarkedPoster, venueId, relatedVenueEvents]);

  const onBookmarkPoster: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    bookmarkPoster();
  }, [bookmarkPoster]);

  return <Bookmark onClick={onBookmarkPoster} isSaved={isBookmarkedPoster} />;
};
