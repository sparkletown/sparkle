import * as Yup from "yup";

import { isValidUrl } from "utils/url";
import { messageInvalidUrl } from "utils/validation";

export const validUrlSchema = Yup.string().test(
  "isValidUrl",
  messageInvalidUrl,
  isValidUrl
);
