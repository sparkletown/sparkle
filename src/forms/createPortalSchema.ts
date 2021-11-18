import * as Yup from "yup";

import { PortalSchema } from "forms/common";
import { roomUrlSchema } from "forms/roomUrlSchema";
import { venueNameSchema } from "forms/venueNameSchema";

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: venueNameSchema,
  roomUrl: roomUrlSchema,
});
