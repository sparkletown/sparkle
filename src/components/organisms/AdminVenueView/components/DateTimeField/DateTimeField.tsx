import React, { useCallback, useEffect, useState } from "react";

import { generateId } from "utils/id";
import { getDateTimeFromUtc, getUtcFromDateTime } from "utils/time";

import "./DateTimeField.scss";

export interface DateFieldProps {
  title: string;
  subTitle?: string;
  name: string;
  dateTimeValue?: number;
  onChange: (value: number) => void;
}

export const DateTimeField: React.FC<DateFieldProps> = ({
  title,
  subTitle,
  name,
  dateTimeValue,
  onChange,
}) => {
  const { date, time } = getDateTimeFromUtc(dateTimeValue);

  const [dateValue, setDateValue] = useState(date);
  const [timeValue, setTimeValue] = useState(time);
  const handleDateChange = useCallback((e) => setDateValue(e.target.value), []);
  const handleTimeChange = useCallback((e) => setTimeValue(e.target.value), []);

  useEffect(() => {
    const dateTime = getUtcFromDateTime(`${dateValue} ${timeValue}`);

    onChange(dateTime);
  }, [dateValue, timeValue, onChange]);

  return (
    <label className="DateTimeField__title" id={generateId(name)}>
      {title}
      {subTitle && <p className="DateTimeField__subtitle">{subTitle}</p>}
      <div className="DateTimeField__container">
        <input
          type="date"
          className="DateTimeField__date"
          value={dateValue}
          onChange={handleDateChange}
        />
        <input type="time" value={timeValue} onChange={handleTimeChange} />
      </div>
    </label>
  );
};
