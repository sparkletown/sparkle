import * as Yup from "yup";

import { SpaceSchema } from "forms/common";
import { venueNameSchema } from "forms/venueNameSchema";

export const createSpaceSchema = Yup.object().shape<SpaceSchema>({
  venueName: venueNameSchema,
});
