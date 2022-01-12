import * as Yup from "yup";

import { START_DATE_FORMAT_RE } from "settings";

import { WorldScheduleEvent } from "api/admin";

export const eventEditSchema = Yup.object().shape<WorldScheduleEvent>({
  spaceId: Yup.string().when(
    "$eventEditSchema",
    (eventEditSchema: string, schema: Yup.StringSchema) =>
      eventEditSchema ? schema : schema.required("Space id required")
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
