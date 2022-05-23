import * as Yup from "yup";

import {
  IFRAME_TEMPLATES,
  MAX_SECTIONS_AMOUNT,
  MIN_SECTIONS_AMOUNT,
} from "settings";

import { VenueTemplate } from "types/VenueTemplate";

import { validUrlSchema } from "./validUrlSchema";

export interface RoomSchemaShape {
  title: string;
  venueName?: string;
  url?: string;
  useUrl?: boolean;
  image_url: string;
}

export const spaceEditSchema = Yup.object().shape({
  logoImageUrl: Yup.string().notRequired(),
  backgroundImageUrl: Yup.string().notRequired(),
  autoplay: Yup.boolean().notRequired(),
  // @debt: Number of sections is deprecated and is no longer available on the UI.
  // To be removed by anyone looking at it when you're confident that this change will be tested.
  numberOfSections: Yup.number().when(
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
  ),
  iframeUrl: Yup.string().when(
    "$template",
    (template: VenueTemplate, schema: Yup.StringSchema) =>
      IFRAME_TEMPLATES.includes(template) ? validUrlSchema : schema
  ),
  template: Yup.mixed<VenueTemplate>().oneOf(Object.values(VenueTemplate)),
  boothsEnabled: Yup.boolean().when(
    "$template",
    (template: VenueTemplate, schema: Yup.StringSchema) =>
      template === VenueTemplate.jazzbar
        ? schema.required()
        : schema.notRequired()
  ),
  maxBooths: Yup.number().required(),
  boothTemplateSpaceId: Yup.string().notRequired(),
});
