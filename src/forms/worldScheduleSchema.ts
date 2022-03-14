import * as Yup from "yup";

import { convertUtcSecondsFromInputDateAndTime } from "utils/time";

const testEndDate: Yup.TestFunction = function testEndIsAfterStart() {
  const { startDate, endDate } = this.parent;

  const zeroHour = "00:00";
  const start = convertUtcSecondsFromInputDateAndTime({
    date: startDate,
    time: zeroHour,
  });
  const end = convertUtcSecondsFromInputDateAndTime({
    date: endDate,
    time: zeroHour,
  });

  return start <= end;
};

const testEndTime: Yup.TestFunction = function testEndIsAfterStart() {
  const { endTime, startTime, startDate, endDate } = this.parent;

  const start = convertUtcSecondsFromInputDateAndTime({
    date: startDate,
    time: startTime,
  });
  const end = convertUtcSecondsFromInputDateAndTime({
    date: endDate,
    time: endTime,
  });

  return start < end;
};

export const worldScheduleSchema = Yup.object().shape({
  startDate: Yup.string().required(),
  startTime: Yup.string().required(),
  endDate: Yup.string()
    .required()
    .test(
      "endDate",
      "End date must not be before the starting date",
      testEndDate
    ),
  endTime: Yup.string()
    .required()
    .test("endTime", "End time must be after the start time", testEndTime),
});
