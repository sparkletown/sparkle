import * as Yup from "yup";

import {
  IFRAME_TEMPLATES,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
} from "settings";

import { VenueTemplate } from "types/venues";

import { validUrlSchema } from "./validUrlSchema";

const vectorSchema = Yup.number().when(
  "$template",
  (template: VenueTemplate, schema: Yup.StringSchema) =>
    template === VenueTemplate.auditorium
      ? schema.required()
      : schema.notRequired()
);

const numberOfSectionsSchema = Yup.number().when(
  "$template",
  (template: VenueTemplate, schema: Yup.StringSchema) =>
    template === VenueTemplate.auditorium
      ? schema
          .required(
            `The number of sections needs to be between ${MIN_SECTIONS_AMOUNT} and ${MAX_SECTIONS_AMOUNT}`
          )
          .min(MIN_SECTIONS_AMOUNT)
          .max(MAX_SECTIONS_AMOUNT)
      : schema.notRequired()
);

const iframeUrlSchema = Yup.string().when(
  "$template",
  (template: VenueTemplate, schema: Yup.StringSchema) =>
    IFRAME_TEMPLATES.includes(template) ? validUrlSchema : schema
);

export const spaceEditSchema = Yup.object().shape({
  bannerImageUrl: Yup.string().notRequired(),
  autoplay: Yup.boolean().notRequired(),
  numberOfSections: numberOfSectionsSchema,
  iframeUrl: iframeUrlSchema,
  auditoriumColumns: vectorSchema,
  auditoriumRows: vectorSchema,
});
