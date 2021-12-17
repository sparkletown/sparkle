import * as Yup from "yup";

import { SpaceSchema } from "types/validation";

import { spaceNameSchema } from "forms/spaceNameSchema";

export const createSpaceSchema = Yup.object().shape<SpaceSchema>({
  venueName: spaceNameSchema,
  template: Yup.string().required(),
});
