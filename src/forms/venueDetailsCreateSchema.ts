import firebase from "firebase/app";
import * as Yup from "yup";

import {
  BACKGROUND_IMG_TEMPLATES,
  DEFAULT_MAP_ICON_PLACEMENT,
  MAXIMUM_AUDITORIUM_COLUMNS_COUNT,
  MAXIMUM_AUDITORIUM_ROWS_COUNT,
  MINIMUM_AUDITORIUM_COLUMNS_COUNT,
  MINIMUM_AUDITORIUM_ROWS_COUNT,
  MINIMUM_PARTYMAP_COLUMNS_COUNT,
  PLAYA_HEIGHT,
  PLAYA_WIDTH,
  ZOOM_URL_TEMPLATES,
} from "settings";

import { createSlug, VenueInput } from "api/admin";

import { RoomVisibility, VenueTemplate } from "types/venues";

import { createFileSchema } from "forms/factory/createFileSchema";
import { createNameSchema } from "forms/factory/createNameSchema";
import { createUrlIfNoFileSchema } from "forms/factory/createUrlIfNoFileSchema";

export const venueDetailsCreateSchema = Yup.object()
  .shape<VenueInput>({
    template: Yup.mixed<VenueTemplate>().required(),
    name: createNameSchema({ name: "Name", withMin: true }).when(
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
    bannerImageFile: createFileSchema({
      name: "bannerImageFile",
      required: false,
    }).notRequired(), // override files to make them non required

    logoImageFile: createFileSchema({
      name: "logoImageFile",
      required: false,
    }).notRequired(),

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
          ? createUrlIfNoFileSchema("mapBackgroundImageFile")
          : schema.notRequired()
    ),

    bannerImageUrl: Yup.string(),
    logoImageUrl: createUrlIfNoFileSchema("logoImageFile"),
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
      .default(DEFAULT_MAP_ICON_PLACEMENT),

    showRadio: Yup.bool().notRequired(),
    radioStations: Yup.string().when("showRadio", {
      is: true,
      then: Yup.string().required("Radio station (stream) is required!"),
    }),

    owners: Yup.array<string>().notRequired(),
    placementRequests: Yup.string().notRequired(),
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
