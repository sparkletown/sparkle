import { CONVERSATION_TABLES, JAZZBAR_TABLES } from "settings";

import { createSlug, VenueInput_v2 } from "api/admin";

import { SpaceSlug } from "types/id";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { WithId } from "./id";

export const buildEmptySpace = (
  name: string,
  template: VenueTemplate
): Omit<VenueInput_v2, "id"> => {
  const list = new DataTransfer();

  const fileList = list.files;
  const isSpaceWithTables =
    template === VenueTemplate.jazzbar ||
    template === VenueTemplate.conversationspace;

  return {
    name,
    slug: createSlug(name) as SpaceSlug,
    subtitle: "",
    description: "",
    template,
    backgroundImageFile: fileList,
    backgroundImageUrl: "",
    logoImageUrl: "",
    mapBackgroundImageUrl: "",
    logoImageFile: fileList,
    rooms: [],
    ...(isSpaceWithTables && {
      tables:
        template === VenueTemplate.jazzbar
          ? JAZZBAR_TABLES
          : CONVERSATION_TABLES,
    }),
  };
};

export type WithVenue<T extends object> = T & { venue: AnyVenue };

export const withVenue = <T extends object>(
  obj: T,
  venue: AnyVenue
): WithVenue<T> => ({
  ...obj,
  venue,
});

export enum SortingOptions {
  az = "A - Z",
  za = "Z - A",
  newestFirst = "Newest First",
  oldestFirst = "Oldest First",
}

export interface FindSovereignVenueOptions {
  previouslyCheckedVenueIds?: readonly string[];
  maxDepth?: number;
}

export interface FindSovereignVenueReturn {
  sovereignVenue: WithId<AnyVenue>;
  checkedVenueIds: readonly string[];
}

export const findSovereignVenue = (
  venueId: string,
  venues: WithId<AnyVenue>[],
  options?: FindSovereignVenueOptions
): FindSovereignVenueReturn | undefined => {
  const { previouslyCheckedVenueIds = [], maxDepth } = options ?? {};

  const venue = venues.find((venue) => venue.id === venueId);

  if (!venue) return undefined;

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

  return findSovereignVenue(venue.parentId, venues, {
    ...options,
    previouslyCheckedVenueIds: [...previouslyCheckedVenueIds, venueId],
    maxDepth: maxDepth ? maxDepth - 1 : undefined,
  });
};
