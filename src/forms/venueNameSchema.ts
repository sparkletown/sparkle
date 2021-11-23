import { testGeneratesValidSlug, testVenueByNameExists } from "forms/common";
import { createNameSchema } from "forms/createNameSchema";

export const venueNameSchema = createNameSchema({ name: "Venue name" })
  .test("name", "Must have alphanumeric characters", testGeneratesValidSlug)
  .test("name", "This name is already taken", testVenueByNameExists);
