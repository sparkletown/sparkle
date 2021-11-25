import * as Yup from "yup";

import { PortalSchema } from "types/validation";

import { roomUrlSchema } from "forms/roomUrlSchema";
import { venueNameSchema } from "forms/venueNameSchema";

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: venueNameSchema,
  roomUrl: roomUrlSchema,
});
