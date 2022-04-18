import * as Yup from "yup";

import { START_DATE_FORMAT_RE } from "settings";

import { EventInput } from "api/admin";

import { SpaceType } from "types/spaces";

export const eventEditSchema = Yup.object().shape<EventInput>({
  space: Yup.object()
    .shape<SpaceType>({
      id: Yup.string().when(
        ["$eventSpaceId", "$selectedSpace"],
        (
          eventSpaceId: string,
          selectedSpace: SpaceType,
          schema: Yup.ObjectSchema<SpaceType>
        ) =>
          eventSpaceId
            ? schema.notRequired()
            : schema.test(
                "space",
                "Space id required",
                () => !!selectedSpace.id
              )
      ),
      label: Yup.string(),
    })
    .notRequired(),
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  start_date: Yup.string()
    .required("Start date required")
    .matches(
      START_DATE_FORMAT_RE,
      'Start date must have the format "yyyy-mm-dd"'
    ),
  start_time: Yup.string().required("Start time required"),
  duration_hours: Yup.number()
    .typeError("Hours must be a number")
    .required("Hours required"),
  duration_minutes: Yup.number()
    .typeError("Minutes must be a number")
    .required("Minutes equired"),
  host: Yup.string().required("Host required"),
});
