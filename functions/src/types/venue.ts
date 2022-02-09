import * as yup from "yup";

import { VENUE_ID_REGEX } from "../utils/venue";

export const VenueIdSchema = yup.string().matches(VENUE_ID_REGEX).required();

// @debt This should ideally be in a shared module
export interface LandingPageConfig {
  coverImageUrl?: string;
  subtitle?: string;
  description?: string;
}
