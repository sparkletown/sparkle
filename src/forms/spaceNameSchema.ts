import { SPACE_TAXON } from "settings";

import {
  testGeneratesValidSlug,
  testVenueByNameExists,
} from "utils/validation";

import { createNameSchema } from "forms/factory/createNameSchema";

export const spaceNameSchema = createNameSchema({
  name: `${SPACE_TAXON.capital} name`,
})
  .test("name", "Must have alphanumeric characters", testGeneratesValidSlug)
  .test("name", "This name is already taken", testVenueByNameExists);
