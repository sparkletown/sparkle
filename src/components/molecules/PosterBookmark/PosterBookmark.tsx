import React, { useMemo, useCallback } from "react";

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
import { useVenueEvents } from "hooks/events";

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
}

export const PosterBookmark: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const venueId = posterVenue.id;

  const { userWithId, userId } = useUser();

  const venueIds = useMemo(() => [venueId], [venueId]);

  const { events: venueEvents } = useVenueEvents({ venueIds: venueIds });

  const savedPosters = useMemo(() => userWithId?.savedPosters ?? {}, [
    userWithId,
  ]);

  const isSaved = savedPosters[venueId]?.includes(venueId) ?? false;

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

  return (
    <Bookmark
      onClick={isSaved ? removeBookmarks : addBookmarks}
      isSaved={isSaved}
    />
  );
};
