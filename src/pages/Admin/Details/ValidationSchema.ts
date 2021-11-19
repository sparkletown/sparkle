import * as Yup from "yup";

import {
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
  PLAYA_HEIGHT,
  PLAYA_VENUE_SIZE,
  PLAYA_WIDTH,
  ROOM_TAXON,
  VENUE_NAME_MAX_CHAR_COUNT,
  VENUE_NAME_MIN_CHAR_COUNT,
} from "settings";

import { createSlug, EventInput, PlacementInput, VenueInput } from "api/admin";

import { isCurrentLocationValidUrl } from "utils/url";

import "firebase/functions";

const initialMapIconPlacement: VenueInput["placement"] = {
  x: (PLAYA_WIDTH - PLAYA_VENUE_SIZE) / 2,
  y: (PLAYA_HEIGHT - PLAYA_VENUE_SIZE) / 2,
};

export interface SchemaShape {
  name: string;
  subtitle?: string;
  description?: string;

  bannerImageUrl?: string;
  logoImageUrl: string;
}

export interface RoomSchemaShape {
  title: string;
  venueName?: string;
  url?: string;
  useUrl?: boolean;
  image_url: string;
}

export const urlIfNoFileValidation = (fieldName: string) =>
  Yup.string().when(
    fieldName,
    (file: FileList | undefined, schema: Yup.MixedSchema<FileList>) =>
      file && file.length > 0
        ? schema.notRequired()
        : schema.required("Required")
  );

export const mustBeMinimum = (fieldName: string, min: number) =>
  `${fieldName} must be at least ${min} characters`;

export const mustBeMaximum = (fieldName: string, max: number) =>
  `${fieldName} must be less than ${max} characters`;

export const roomTitleSchema = Yup.string()
  .required("Name is required")
  .min(VENUE_NAME_MIN_CHAR_COUNT, ({ min }) => mustBeMinimum("Name", min))
  .max(VENUE_NAME_MAX_CHAR_COUNT, ({ max }) => mustBeMaximum("Name", max));

export const validationSchema_v2 = Yup.object()
  .shape<SchemaShape>({
    name: roomTitleSchema.test(
      "name",
      "Must have alphanumeric characters",
      (val: string) => createSlug(val).length > 0
    ),
    subtitle: Yup.string().matches(/.{3,}/, {
      excludeEmptyString: true,
      message: mustBeMinimum("Subtitle", 3),
    }),
    description: Yup.string().matches(/.{3,}/, {
      excludeEmptyString: true,
      message: mustBeMinimum("Description", 3),
    }),

    bannerImageUrl: Yup.string(),
    logoImageUrl: Yup.string().required("Logo is required!"),
  })
  .required();

const venueNameSchema = Yup.string()
  .required("Venue name is required")
  .min(
    VENUE_NAME_MIN_CHAR_COUNT,
    ({ min }) => `Name must be at least ${min} characters`
  )
  .max(
    VENUE_NAME_MAX_CHAR_COUNT,
    ({ max }) => `Name must be less than ${max} characters`
  )
  .test(
    "name",
    "Must have alphanumeric characters",
    (val: string) => createSlug(val).length > 0
  );

export const roomUrlSchema = Yup.string()
  .required("Url is required!")
  .min(3, ({ min }) => mustBeMinimum("Url", min))
  // @debt possible replace with isValidUrl, see isCurrentLocationValidUrl for deprecation comments
  .test(
    "url validation",
    "Please enter a valid URL",
    isCurrentLocationValidUrl
  );

export interface SpaceSchema {
  template?: string;
  venueName?: string;
}

export interface PortalSchema extends SpaceSchema {
  roomUrl?: string;
}

const roomImageUrlSchema = Yup.string().required(
  `${ROOM_TAXON.capital} icon is required`
);

export const createSpaceSchema = Yup.object().shape<SpaceSchema>({
  venueName: venueNameSchema,
});

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: venueNameSchema,
  roomUrl: roomUrlSchema,
});

export const roomEditSchema = Yup.object().shape({
  room: Yup.object().shape<RoomSchemaShape>({
    title: roomTitleSchema,
    url: roomUrlSchema,
    image_url: roomImageUrlSchema,
  }),
});

export const roomEditNGSchema = Yup.object().shape({
  image_url: Yup.string().notRequired(),
  bannerImageUrl: Yup.string().notRequired(),
  venue: Yup.object().shape({
    iframeUrl: Yup.string().notRequired(),
    autoplay: Yup.boolean().notRequired(),
  }),
  numberOfSections: Yup.number()
    .required(
      `The number of sections needs to be between ${MIN_SECTIONS_AMOUNT} and ${MAX_SECTIONS_AMOUNT}`
    )
    .min(MIN_SECTIONS_AMOUNT)
    .max(MAX_SECTIONS_AMOUNT),
});

// this is used to transform the api data to conform to the yup schema
// @debt I'm pretty sure every one of these .from that have the same fromKey / toKey are redundant noops and should be removed
export const editVenueCastSchema = Yup.object()
  .shape<Partial<VenueInput>>({})
  // possible locations for the subtitle
  .from("subtitle", "subtitle")
  .from("config.landingPageConfig.subtitle", "subtitle")

  .from("config.landingPageConfig.description", "description")
  .from("host.icon", "logoImageUrl")
  .from("showGrid", "showGrid")
  .from("columns", "columns")

  // possible locations for the banner image
  .from("config.landingPageConfig.coverImageUrl", "bannerImageUrl")
  .from("config.landingPageConfig.bannerImageUrl", "bannerImageUrl");

// @debt I'm pretty sure every one of these .from that have the same fromKey / toKey are redundant noops and should be removed
export const editPlacementCastSchema = Yup.object()
  .shape<Partial<PlacementInput>>({})

  .from("placement.addressText", "addressText")
  .from("placement.notes", "notes")
  .required();

export const editPlacementSchema = Yup.object().shape<PlacementInput>({
  addressText: Yup.string(),
  notes: Yup.string(),
  width: Yup.number().required("Required"),
  height: Yup.number().required("Required"),
  placement: Yup.object()
    .shape({
      x: Yup.number().required("Required").min(0).max(PLAYA_WIDTH),
      y: Yup.number().required("Required").min(0).max(PLAYA_HEIGHT),
    })
    .default(initialMapIconPlacement),
});

export const eventEditSchema = Yup.object().shape<EventInput>({
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  start_date: Yup.string()
    .required("Start date required")
    .matches(
      /\d{4}-\d{2}-\d{2}/,
      'Start date must have the format "yyyy-mm-dd"'
    ),
  start_time: Yup.string().required("Start time required"),
  duration_hours: Yup.number()
    .typeError("Hours must be a number")
    .required("Hours required"),
  duration_minutes: Yup.number()
    .typeError("Minutes must be a number")
    .required("Minutes equired"),
  host: Yup.string().required("Host required"),
  room: Yup.string().required("Space is required"),
});
