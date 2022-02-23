import * as Yup from "yup";

import { START_DATE_FORMAT_RE } from "settings";

import { WorldScheduleEvent } from "api/admin";

export interface SpaceType {
  id?: string;
  name?: string;
}

export const eventEditSchema = Yup.object().shape<WorldScheduleEvent>({
  space: Yup.object()
    .shape<SpaceType>({
      id: Yup.string().notRequired(),
      name: Yup.string().notRequired(),
    })
    .when(
      "$eventSpaceId",
      (eventSpaceId: string, schema: Yup.ObjectSchema<SpaceType>) =>
        eventSpaceId
          ? schema.notRequired()
          : schema.test("space", "Space id required", (space) => !!space?.id)
    ),
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  startDate: Yup.string()
    .required("Start date required")
    .matches(
      START_DATE_FORMAT_RE,
      'Start date must have the format "yyyy-mm-dd"'
    ),
  startTime: Yup.string().required("Start time required"),
  durationHours: Yup.number()
    .typeError("Hours must be a number")
    .required("Hours required"),
  durationMinutes: Yup.number()
    .typeError("Minutes must be a number")
    .required("Minutes equired"),
  host: Yup.string().required("Host required"),
});
