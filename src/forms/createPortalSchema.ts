import * as Yup from "yup";

import { PortalSchema } from "types/validation";

import { spaceNameSchema } from "forms/spaceNameSchema";

import { createUrlSchema } from "./factory/createUrlSchema";

export const createPortalSchema = Yup.object().shape<PortalSchema>({
  venueName: spaceNameSchema,
  roomUrl: createUrlSchema({ required: true }),
});
