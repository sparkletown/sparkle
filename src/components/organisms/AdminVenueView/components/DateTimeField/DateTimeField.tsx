import React, { forwardRef, useCallback, useEffect, useState } from "react";

import { getDateTimeFromUtc, getUtcFromDateTime } from "utils/time";

import "./DateTimeField.scss";

export interface DateFieldProps {
  title: string;
  subTitle?: string;
  dateTimeValue?: number;
  onChange: (value: number) => void;
  name: string;
}

const _DateTimeField: React.ForwardRefRenderFunction<
  HTMLInputElement,
  DateFieldProps
> = ({ title, subTitle, dateTimeValue, onChange, name }, ref) => {
  const { date, time } = getDateTimeFromUtc(dateTimeValue);

  const [dateValue, setDateValue] = useState(date);
  const [timeValue, setTimeValue] = useState(time);

  const [utcValue, setUtcValue] = useState(0);

  const handleDateChange = useCallback((e) => setDateValue(e.target.value), []);
  const handleTimeChange = useCallback((e) => setTimeValue(e.target.value), []);

  useEffect(() => {
    const dateTime = getUtcFromDateTime(`${dateValue} ${timeValue}`);
    setUtcValue(Number(dateTime));
    onChange(dateTime);
  }, [dateValue, timeValue, onChange, name]);

  useEffect(() => {
    setDateValue(date);
  }, [date]);

  useEffect(() => {
    setTimeValue(time);
  }, [time]);

  return (
    <div className="DateTimeField">
      <div className="DateTimeField__title">{title}</div>
      {subTitle && <p className="DateTimeField__subtitle">{subTitle}</p>}
      <div className="DateTimeField__container">
        <input
          type="number"
          value={utcValue}
          ref={ref}
          name={name}
          hidden
          readOnly
        />
        <input
          type="date"
          className="DateTimeField__input DateTimeField__date"
          value={dateValue}
          onChange={handleDateChange}
        />
        <input
          type="number"
          value={utcValue}
          ref={ref}
          name={name}
          hidden
          readOnly
        />
        <input
          className="DateTimeField__input DateTimeField__time"
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
};

export const DateTimeField = forwardRef(_DateTimeField);
