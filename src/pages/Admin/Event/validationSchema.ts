import dayjs from "dayjs";
import { string, object, number } from "yup";
import { Event_v2 } from "./EventModal.types";

export const eventModalValidationSchema = object().shape<Event_v2>({
  name: string().required("Name is required!"),

  description: string().required("Description is required!"),

  start_date: string()
    .required("Start date is required")
    .matches(
      /\d{4}-\d{2}-\d{2}/,
      'Start date must have the format "yyyy-mm-dd"'
    )
    .test(
      "start_date_future",
      "Start date must be in the future",
      (start_date) => dayjs(start_date).isSameOrAfter(dayjs(), "day")
    ),

  start_time: string().required("Start time is required!"),

  duration_hours: number()
    .typeError("Duration must be a number")
    .required("Duration is required!"),

  host: string().required("Host is required!"),
});
