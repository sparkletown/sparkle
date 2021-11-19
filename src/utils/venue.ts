import React, { ReactNode } from "react";

import { PLAYA_TEMPLATES, SUBVENUE_TEMPLATES } from "settings";

import { createSlug, VenueInput_v2 } from "api/admin";

import {
  AnyVenue,
  JazzbarVenue,
  PortalTemplate,
  urlFromImage,
  VenueTemplate,
} from "types/venues";

import { FormValues } from "pages/Admin/Venue/VenueDetailsForm";

import { SpaceEditForm } from "components/molecules/SpaceEditForm";
import { SpaceEditFormProps } from "components/molecules/SpaceEditForm/SpaceEditForm";
import { SpaceEditFormNG } from "components/molecules/SpaceEditFormNG";
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

export const buildEmptyVenue = (
  venueName: string,
  template: VenueTemplate
): VenueInput_v2 => {
  const list = new DataTransfer();

  const fileList = list.files;

  return {
    name: venueName,
    slug: createSlug(venueName),
    subtitle: "",
    description: "",
    template: template,
    bannerImageFile: fileList,
    bannerImageUrl: "",
    logoImageUrl: "",
    mapBackgroundImageUrl: "",
    logoImageFile: fileList,
    rooms: [],
  };
};

export const createJazzbar = (values: FormValues): JazzbarVenue => {
  return {
    template: VenueTemplate.jazzbar,
    name: values.name || "Your Jazz Bar",
    slug: values.name ? createSlug(values.name) : createSlug("Your Jazz Bar"),
    config: {
      theme: {
        primaryColor: "yellow",
        backgroundColor: "red",
      },
      landingPageConfig: {
        coverImageUrl: urlFromImage(
          "/default-profile-pic.png",
          values.bannerImageFile
        ),
        subtitle: values.subtitle || "Subtitle for your space",
        description: values.description || "Description of your space",
        presentation: [],
        checkList: [],
        quotations: [],
      },
    },
    host: {
      icon: urlFromImage("/default-profile-pic.png", values.logoImageFile),
    },
    owners: [],
    termsAndConditions: [],
    width: values.width ?? 40,
    height: values.width ?? 40,
    // @debt Should these fields be defaulted like this? Or potentially undefined? Or?
    iframeUrl: "",
    logoImageUrl: "",
    worldId: "",
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

export enum VenueSortingOptions {
  az = "A - Z",
  za = "Z - A",
  newestFirst = "Newest First",
  oldestFirst = "Oldest First",
}

export const sortVenues = (
  venueList: WithId<AnyVenue>[],
  sortingOption: VenueSortingOptions
) => {
  switch (sortingOption) {
    case VenueSortingOptions.az:
      return [...venueList].sort((a, b) => a.id.localeCompare(b.id));
    case VenueSortingOptions.za:
      return [...venueList].sort((a, b) => -1 * a.id.localeCompare(b.id));
    case VenueSortingOptions.oldestFirst:
      return [...venueList].sort(
        (a, b) =>
          (a.createdAt ?? 0) - (b.createdAt ?? 0) || a.id.localeCompare(b.id)
      );
    case VenueSortingOptions.newestFirst:
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

export const SPACE_EDIT_FORM_TEMPLATES = (() => {
  // these are the original templates, they all share one old form
  const ogTemplates: [VenueTemplate, ReactNode][] = Object.values(
    VenueTemplate
  ).map((template) => [template, SpaceEditForm]);

  // these are the new templates, some will override the old ones
  const ngTemplates: [PortalTemplate | "undefined" | "", ReactNode][] = [
    [VenueTemplate.auditorium, SpaceEditFormNG],
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
