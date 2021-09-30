import { getVenueRef } from "./collections";
import { TruncatedVenueType, WithId } from "./types";

export interface FetchSovereignVenueOptions {
  previouslyCheckedVenueIds?: readonly string[];
  maxDepth?: number;
}

export interface FetchSovereignVenueReturn {
  sovereignVenue: WithId<TruncatedVenueType>;
  checkedVenueIds: readonly string[];
}

export const fetchSovereignVenue = async (
  venueId: string,
  options?: FetchSovereignVenueOptions
): Promise<FetchSovereignVenueReturn> => {
  const { previouslyCheckedVenueIds = [], maxDepth } = options ?? {};

  const venue = await fetchVenue(venueId);

  if (!venue) throw new Error(`The '${venueId}' venue doesn't exist`);

  if (!venue.parentId)
    return {
      sovereignVenue: venue,
      checkedVenueIds: previouslyCheckedVenueIds,
    };

  if (previouslyCheckedVenueIds.includes(venueId))
    throw new Error(
      `Circular reference detected. '${venueId}' has already been checked`
    );

  if (maxDepth && maxDepth <= 0)
    throw new Error("Maximum depth reached before finding the sovereignVenue.");

  return fetchSovereignVenue(venue.parentId, {
    ...options,
    previouslyCheckedVenueIds: [...previouslyCheckedVenueIds, venueId],
    maxDepth: maxDepth ? maxDepth - 1 : undefined,
  });
};

export const fetchVenue = async (
  venueId: string
): Promise<WithId<TruncatedVenueType> | undefined> =>
  getVenueRef(venueId)
    .get()
    .then((docSnapshot) => ({
      ...(docSnapshot.data() as TruncatedVenueType),
      id: docSnapshot.id,
    }));
