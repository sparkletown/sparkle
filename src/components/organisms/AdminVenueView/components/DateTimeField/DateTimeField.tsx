import React, { useCallback, useEffect, useState } from "react";

import { getDateTimeFromUtc, getUtcFromDateTime } from "utils/time";

import "./DateTimeField.scss";

export interface DateFieldProps {
  title: string;
  subTitle?: string;
  name: string;
  dateTimeValue?: number;
  handleDateTimeChange: (args: number) => void;
}

export const DateTimeField: React.FC<DateFieldProps> = ({
  title,
  subTitle,
  name,
  dateTimeValue,
  handleDateTimeChange,
}) => {
  const { date, time } = getDateTimeFromUtc(dateTimeValue);

  const [dateValue, setDateValue] = useState(date);
  const [timeValue, setTimeValue] = useState(time);
  const handleDateChange = useCallback((e) => setDateValue(e.target.value), []);
  const handleTimeChange = useCallback((e) => setTimeValue(e.target.value), []);

  useEffect(() => {
    const dateTime = getUtcFromDateTime(`${dateValue} ${timeValue}`);

    handleDateTimeChange(dateTime);
  }, [dateValue, timeValue, handleDateTimeChange]);

  return (
    <>
      <label className="DateTimeField__title" htmlFor={`${name}_date`}>
        {title}
      </label>
      {subTitle && <p className="DateTimeField__subtitle">{subTitle}</p>}
      <div className="DateTimeField__container">
        <input
          type="date"
          name={`${name}_date`}
          className="DateTimeField__container--date"
          value={dateValue}
          onChange={handleDateChange}
        />
        <input
          type="time"
          name={`${name}_time`}
          value={timeValue}
          onChange={handleTimeChange}
        />
      </div>
    </>
  );
};
