import * as Yup from "yup";

import { MAX_SECTIONS_AMOUNT, MIN_SECTIONS_AMOUNT } from "settings";

import { VenueTemplate } from "types/venues";

import { validUrlSchema } from "./validUrlSchema";

export interface RoomSchemaShape {
  title: string;
  venueName?: string;
  url?: string;
  useUrl?: boolean;
  image_url: string;
}

export const spaceEditSchema = Yup.object().shape({
  image_url: Yup.string().notRequired(),
  bannerImageUrl: Yup.string().notRequired(),
  autoplay: Yup.boolean().notRequired(),
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
  iframeUrl: validUrlSchema,
});
