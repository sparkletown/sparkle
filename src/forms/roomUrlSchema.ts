import * as Yup from "yup";

import { isCurrentLocationValidUrl } from "utils/url";

import { mustBeMinimum } from "forms/common";

export const roomUrlSchema = Yup.string()
  .required("Url is required!")
  .min(3, ({ min }) => mustBeMinimum("Url", min))
  // @debt possible replace with isValidUrl, see isCurrentLocationValidUrl for deprecation comments
  .test(
    "url validation",
    "Please enter a valid URL",
    isCurrentLocationValidUrl
  );
