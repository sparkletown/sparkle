import React, { useCallback } from "react";

import { getDateTimeFromUtc } from "utils/time";

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

  // TODO: set dateTime correctly
  const onDateTimeChange = useCallback(() => {
    handleDateTimeChange(dateTimeValue ?? 0);
  }, [handleDateTimeChange, dateTimeValue]);

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
          value={date}
          onChange={onDateTimeChange}
        />
        <input
          type="time"
          name={`${name}_time`}
          value={time}
          onChange={onDateTimeChange}
        />
      </div>
    </>
  );
};
