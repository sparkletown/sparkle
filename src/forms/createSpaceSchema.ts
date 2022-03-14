import * as Yup from "yup";

import { spaceNameSchema } from "forms/spaceNameSchema";

interface SpaceSchema {
  template?: string;
  venueName?: string;
}

export const createSpaceSchema = Yup.object().shape<SpaceSchema>({
  venueName: spaceNameSchema,
  template: Yup.string().required(),
});
