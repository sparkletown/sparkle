import firebase from "firebase/app";
import * as Yup from "yup";

import {
  BACKGROUND_IMG_TEMPLATES,
  MAXIMUM_AUDITORIUM_COLUMNS_COUNT,
  MAXIMUM_AUDITORIUM_ROWS_COUNT,
  MINIMUM_AUDITORIUM_COLUMNS_COUNT,
  MINIMUM_AUDITORIUM_ROWS_COUNT,
  MINIMUM_PARTYMAP_COLUMNS_COUNT,
  PLAYA_HEIGHT,
  PLAYA_VENUE_SIZE,
  PLAYA_WIDTH,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { createSlug, PlacementInput, VenueInput } from "api/admin";

import { RoomVisibility, VenueTemplate } from "types/venues";

import {
  roomTitleSchema,
  urlIfNoFileValidation,
} from "pages/Admin/Details/ValidationSchema";

import "firebase/functions";

const initialMapIconPlacement: VenueInput["placement"] = {
  x: (PLAYA_WIDTH - PLAYA_VENUE_SIZE) / 2,
  y: (PLAYA_HEIGHT - PLAYA_VENUE_SIZE) / 2,
};

const createFileSchema = (name: string, required: boolean) =>
  Yup.mixed<FileList>().test(
    name,
    "Image required",
    (val: FileList) => !required || val.length > 0
  );

export const validationSchema = Yup.object()
  .shape<VenueInput>({
    template: Yup.mixed<VenueTemplate>().required(),
    name: roomTitleSchema.when(
      "$editing",
      (editing: boolean, schema: Yup.StringSchema) =>
        !editing
          ? schema
              .test(
                "name",
                "Must have alphanumeric characters",
                (val: string) => createSlug(val).length > 0
              )
              .test(
                "name",
                "This venue name is already taken",
                async (val: string) =>
                  !val ||
                  !(
                    await firebase
                      .firestore()
                      .collection("venues")
                      .doc(createSlug(val))
                      .get()
                  ).exists
              )
          : schema //will be set from the data from the api. Does not need to be unique
    ),
    bannerImageFile: createFileSchema("bannerImageFile", false).notRequired(), // override files to make them non required
    logoImageFile: createFileSchema("logoImageFile", false).notRequired(),

    showGrid: Yup.bool().notRequired(),
    columns: Yup.number().when("showGrid", {
      is: true,
      then: Yup.number()
        .required(
          `The columns need to be between ${MINIMUM_PARTYMAP_COLUMNS_COUNT} and ${MAXIMUM_AUDITORIUM_COLUMNS_COUNT}.`
        )
        .min(MINIMUM_PARTYMAP_COLUMNS_COUNT)
        .max(MAXIMUM_AUDITORIUM_COLUMNS_COUNT),
    }),

    mapBackgroundImageUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.StringSchema) =>
        BACKGROUND_IMG_TEMPLATES.includes(template)
          ? urlIfNoFileValidation("mapBackgroundImageFile")
          : schema.notRequired()
    ),

    bannerImageUrl: Yup.string(),
    logoImageUrl: urlIfNoFileValidation("logoImageFile"),
    zoomUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        ZOOM_URL_TEMPLATES.includes(template)
          ? schema
              .required("Required")
              .test("zoomUrl", "URL required", (val: string) => val.length > 0)
          : schema.notRequired()
    ),
    iframeUrl: Yup.string().notRequired(),
    roomVisibility: Yup.mixed()
      .oneOf(Object.values(RoomVisibility))
      .notRequired(),

    width: Yup.number().notRequired().min(0).max(PLAYA_WIDTH),
    height: Yup.number().notRequired().min(0).max(PLAYA_HEIGHT),

    placement: Yup.object()
      .shape({
        x: Yup.number().required("Required").min(0).max(PLAYA_WIDTH),
        y: Yup.number().required("Required").min(0).max(PLAYA_HEIGHT),
      })
      .default(initialMapIconPlacement),

    showRadio: Yup.bool().notRequired(),
    radioStations: Yup.string().when("showRadio", {
      is: true,
      then: Yup.string().required("Radio station (stream) is required!"),
    }),

    owners: Yup.array<string>().notRequired(),
    placementRequests: Yup.string().notRequired(),
    adultContent: Yup.bool().required(),
    parentId: Yup.string().notRequired(),
    showReactions: Yup.bool().notRequired(),
    enableJukebox: Yup.bool().notRequired(),
    hasSocialLoginEnabled: Yup.bool().notRequired(),
    showShoutouts: Yup.bool().notRequired(),
    auditoriumColumns: Yup.number()
      .notRequired()
      .min(
        MINIMUM_AUDITORIUM_COLUMNS_COUNT,
        `The columns need to be between ${MINIMUM_AUDITORIUM_COLUMNS_COUNT} and ${MAXIMUM_AUDITORIUM_COLUMNS_COUNT}.`
      )
      .max(
        MAXIMUM_AUDITORIUM_COLUMNS_COUNT,
        `The columns need to be between ${MINIMUM_AUDITORIUM_COLUMNS_COUNT} and ${MAXIMUM_AUDITORIUM_COLUMNS_COUNT}.`
      ),
    auditoriumRows: Yup.number()
      .notRequired()
      .min(
        MINIMUM_AUDITORIUM_ROWS_COUNT,
        `The rows need to be between ${MINIMUM_AUDITORIUM_ROWS_COUNT} and ${MAXIMUM_AUDITORIUM_ROWS_COUNT}.`
      )
      .max(
        MAXIMUM_AUDITORIUM_ROWS_COUNT,
        `The rows need to be between ${MINIMUM_AUDITORIUM_ROWS_COUNT} and ${MAXIMUM_AUDITORIUM_ROWS_COUNT}.`
      ),
  })
  .required();

// this is used to transform the api data to conform to the yup schema
// @debt I'm pretty sure every one of these .from that have the same fromKey / toKey are redundant noops and should be removed
export const editVenueCastSchema = Yup.object()
  .shape<Partial<VenueInput>>({})
  // possible locations for the subtitle
  .from("subtitle", "subtitle")
  .from("config.landingPageConfig.subtitle", "subtitle")

  .from("config.landingPageConfig.description", "description")
  .from("host.icon", "logoImageUrl")
  .from("adultContent", "adultContent")
  .from("showGrid", "showGrid")
  .from("showReactions", "showReactions")
  .from("enableJukebox", "enableJukebox")
  .from("hasSocialLoginEnabled", "hasSocialLoginEnabled")
  .from("showShoutouts", "showShoutouts")
  .from("columns", "columns")

  // possible locations for the banner image
  .from("config.landingPageConfig.coverImageUrl", "bannerImageUrl")
  .from("config.landingPageConfig.bannerImageUrl", "bannerImageUrl")

  .from("auditoriumColumns", "auditoriumColumns")
  .from("auditoriumRows", "auditoriumRows");

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
