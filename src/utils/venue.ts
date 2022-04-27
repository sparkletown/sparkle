import { CONVERSATION_TABLES, JAZZBAR_TABLES } from "settings";

import { createSlug, VenueInput_v2 } from "api/admin";

import { SpaceSlug } from "types/id";
import { AnyVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

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
