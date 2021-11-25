import * as Yup from "yup";

import { COMMON_STRING_MIN_CHAR_COUNT } from "settings";

import { isCurrentLocationValidUrl } from "utils/url";
import { messageMustBeMinimum } from "utils/validation";

export const roomUrlSchema = Yup.string()
  .required("Url is required!")
  .min(COMMON_STRING_MIN_CHAR_COUNT, ({ min }) =>
    messageMustBeMinimum("Url", min)
  )
  // @debt possible replace with isValidUrl, see isCurrentLocationValidUrl for deprecation comments
  .test(
    "url validation",
    "Please enter a valid URL",
    isCurrentLocationValidUrl
  );
