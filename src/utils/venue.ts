import { ReactNode } from "react";

import { PLAYA_TEMPLATES, SUBVENUE_TEMPLATES } from "settings";

import { createSlug, VenueInput_v2 } from "api/admin";

import {
  AnyVenue,
  PortalTemplate,
  SpaceSlug,
  VenueTemplate,
} from "types/venues";

import { SpaceEditForm } from "components/molecules/SpaceEditForm";
import { SpaceEditFormProps } from "components/molecules/SpaceEditForm/SpaceEditForm";
import { SpaceEditFormNGProps } from "components/molecules/SpaceEditFormNG/SpaceEditFormNG";

import { assertUnreachable } from "./error";
import { WithId } from "./id";

export const canHaveSubvenues = (venue: AnyVenue): boolean =>
  SUBVENUE_TEMPLATES.includes(venue.template);

export const canBeDeleted = (venue: AnyVenue): boolean =>
  !PLAYA_TEMPLATES.includes(venue.template);

export const canHavePlacement = (venue: AnyVenue): boolean =>
  PLAYA_TEMPLATES.includes(venue.template);

export const checkIfValidVenueId = (venueId?: string): boolean => {
  if (typeof venueId !== "string") return false;

  return /[a-z0-9_]{1,250}/.test(venueId);
};

export const buildEmptySpace = (
  name: string,
  template: VenueTemplate
): Omit<VenueInput_v2, "id"> => {
  const list = new DataTransfer();

  const fileList = list.files;

  return {
    name,
    slug: createSlug(name) as SpaceSlug,
    subtitle: "",
    description: "",
    template,
    bannerImageFile: fileList,
    bannerImageUrl: "",
    logoImageUrl: "",
    mapBackgroundImageUrl: "",
    logoImageFile: fileList,
    rooms: [],
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

export const sortVenues = (
  venueList: WithId<AnyVenue>[],
  sortingOption: SortingOptions
) => {
  switch (sortingOption) {
    case SortingOptions.az:
      return [...venueList].sort((a, b) => a.id.localeCompare(b.id));
    case SortingOptions.za:
      return [...venueList].sort((a, b) => -1 * a.id.localeCompare(b.id));
    case SortingOptions.oldestFirst:
      return [...venueList].sort(
        (a, b) =>
          (a.createdAt ?? 0) - (b.createdAt ?? 0) || a.id.localeCompare(b.id)
      );
    case SortingOptions.newestFirst:
      return [...venueList].sort(
        (a, b) =>
          (b.createdAt ?? 0) - (a.createdAt ?? 0) || a.id.localeCompare(b.id)
      );
    default:
      assertUnreachable(sortingOption);
  }
};

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

/**
 * @deprecated not needed as we moved the logic to modals; can be removed with the next admin cleanup.
 * @see https://github.com/sparkletown/sparkle/pull/2655
 */
export const SPACE_EDIT_FORM_TEMPLATES = (() => {
  // these are the original templates, they all share one old form
  const ogTemplates: [VenueTemplate, ReactNode][] = Object.values(
    VenueTemplate
  ).map((template) => [template, SpaceEditForm]);

  // these are the new templates, some will override the old ones
  const ngTemplates: [PortalTemplate | "undefined" | "", ReactNode][] = [
    [VenueTemplate.auditorium, SpaceEditForm],
    ["external", SpaceEditForm],
    // this is a deliberate attempt in providing default form for missing portal template
    ["", SpaceEditForm],
    ["undefined", SpaceEditForm],
  ];

  // mapping is created with NG overriding OG and type set as the record generated from the arrays
  return Object.fromEntries([...ogTemplates, ...ngTemplates]) as Record<
    string,
    React.FC<SpaceEditFormNGProps | SpaceEditFormProps>
  >;
})();
