import * as Yup from "yup";

import {
  MAXIMUM_PARTYMAP_COLUMNS_COUNT,
  MINIMUM_PARTYMAP_COLUMNS_COUNT,
} from "settings";

import { UsernameVisibility } from "types/User";
import { RoomVisibility, VenueAdvancedConfig } from "types/venues";

export const advancedSettingsSchema = Yup.object().shape<VenueAdvancedConfig>({
  showGrid: Yup.boolean().notRequired(),
  columns: Yup.number().when("showGrid", {
    is: true,
    then: Yup.number()
      .required(
        `The columns need to be between ${MINIMUM_PARTYMAP_COLUMNS_COUNT} and ${MAXIMUM_PARTYMAP_COLUMNS_COUNT}.`
      )
      .min(MINIMUM_PARTYMAP_COLUMNS_COUNT)
      .max(MAXIMUM_PARTYMAP_COLUMNS_COUNT),
  }),
  radioStations: Yup.string().when("showRadio", {
    is: true,
    then: Yup.string().required("Radio stream is required!"),
  }),
  requiresDateOfBirth: Yup.bool().notRequired(),
  showBadges: Yup.bool().notRequired(),
  showNametags: Yup.mixed()
    .oneOf(Object.values(UsernameVisibility))
    .notRequired(),
  showRadio: Yup.bool().notRequired(),
  roomVisibility: Yup.mixed()
    .oneOf(Object.values(RoomVisibility))
    .notRequired(),
});
