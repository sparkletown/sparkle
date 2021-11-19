import * as Yup from "yup";

import { MAX_SECTIONS_AMOUNT, MIN_SECTIONS_AMOUNT } from "settings";

import { createNameSchema } from "forms/createNameSchema";

export const spaceEditNGSchema = Yup.object().shape({
  name: createNameSchema({ name: "Name" }),
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
