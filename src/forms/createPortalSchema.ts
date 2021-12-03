import * as Yup from "yup";

import { PortalSchema } from "types/validation";

import { spaceNameSchema } from "forms/spaceNameSchema";

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: spaceNameSchema,
});
