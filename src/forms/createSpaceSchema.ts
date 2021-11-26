import * as Yup from "yup";

import { SpaceSchema } from "types/validation";

import { venueNameSchema } from "forms/venueNameSchema";

export const createSpaceSchema = Yup.object().shape<SpaceSchema>({
  venueName: venueNameSchema,
});
