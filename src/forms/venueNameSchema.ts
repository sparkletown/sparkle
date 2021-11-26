import {
  testGeneratesValidSlug,
  testVenueByNameExists,
} from "utils/validation";

import { createNameSchema } from "forms/factory/createNameSchema";

export const venueNameSchema = createNameSchema({ name: "Venue name" })
  .test("name", "Must have alphanumeric characters", testGeneratesValidSlug)
  .test("name", "This name is already taken", testVenueByNameExists);
