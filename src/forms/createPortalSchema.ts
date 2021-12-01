import * as Yup from "yup";

import { PortalSchema } from "types/validation";

import { venueNameSchema } from "forms/venueNameSchema";

import { createUrlSchema } from "./factory/createUrlSchema";

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: venueNameSchema,
  roomUrl: createUrlSchema({ required: true }),
});
