import * as Yup from "yup";

import { DISPLAY_NAME_MAX_CHAR_COUNT } from "settings";

export interface ProfileSchemaShape {
  partyName: string;
  pictureUrl: string;
}

export const profileSchema = Yup.object().shape<ProfileSchemaShape>({
  partyName: Yup.string()
    .required("Display name is required")
    .max(
      DISPLAY_NAME_MAX_CHAR_COUNT,
      ` Display name must be ${DISPLAY_NAME_MAX_CHAR_COUNT} characters or less`
    ),
  pictureUrl: Yup.string().required("Profile picture is required"),
});
