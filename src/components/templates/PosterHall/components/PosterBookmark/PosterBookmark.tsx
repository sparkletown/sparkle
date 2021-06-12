import React, { MouseEventHandler, useMemo, useCallback } from "react";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import {
  addPosterToProfile,
  removePosterFromProfile,
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { Bookmark } from "components/atoms/Bookmark";

import { useUser } from "hooks/useUser";
import { useSingleVenueEvents } from "hooks/events";

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
}

export const PosterBookmark: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const venueId = posterVenue.id;

  const { userWithId } = useUser();
  const userId = userWithId?.id;

  const { events: venueEvents } = useSingleVenueEvents({
    venueId: venueId,
  });

  const savedPosters = useMemo(() => userWithId?.savedPosters ?? {}, [
    userWithId,
  ]);

  const isSaved = useMemo(
    () => savedPosters[venueId]?.includes(venueId) ?? false,
    [savedPosters, venueId]
  );

  const removeBookmarks = useCallback(() => {
    if (!userId) return;
    removePosterFromProfile({ venueId, userId });
    venueEvents.forEach((event) => {
      removeEventFromPersonalizedSchedule({ event, userId });
    });
  }, [venueId, userId, venueEvents]);

  const addBookmarks = useCallback(() => {
    if (!userId) return;
    addPosterToProfile({ venueId, userId });
    venueEvents.forEach((event) => {
      addEventToPersonalizedSchedule({ event, userId });
    });
  }, [venueId, userId, venueEvents]);

  const bookmarkPoster: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      isSaved ? removeBookmarks() : addBookmarks();
    },
    [isSaved, addBookmarks, removeBookmarks]
  );

  return <Bookmark onClick={bookmarkPoster} isSaved={isSaved} />;
};
