import * as Yup from "yup";

import { EventInput } from "api/admin";

export const eventEditSchema = Yup.object().shape<EventInput>({
  name: Yup.string().required("Name required"),
  description: Yup.string().required("Description required"),
  start_date: Yup.string()
    .required("Start date required")
    .matches(
      /\d{4}-\d{2}-\d{2}/,
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
  room: Yup.string().required("Space is required"),
});
