import * as Yup from "yup";

import {
  VENUE_NAME_MAX_CHAR_COUNT,
  VENUE_NAME_MIN_CHAR_COUNT,
} from "settings/validationSettings";

import { mustBeMaximum, mustBeMinimum } from "forms/common";

export const commonTitleSchema = Yup.string()
  .required("Name is required")
  .min(VENUE_NAME_MIN_CHAR_COUNT, ({ min }) => mustBeMinimum("Name", min))
  .max(VENUE_NAME_MAX_CHAR_COUNT, ({ max }) => mustBeMaximum("Name", max));
