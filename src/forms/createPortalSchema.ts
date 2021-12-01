import * as Yup from "yup";

import { PortalSchema } from "types/validation";

import { roomUrlSchema } from "forms/roomUrlSchema";
import { spaceNameSchema } from "forms/spaceNameSchema";

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: spaceNameSchema,
  roomUrl: roomUrlSchema,
});
