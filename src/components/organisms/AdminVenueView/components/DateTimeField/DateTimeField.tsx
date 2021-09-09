import React from "react";

import "./DateTimeField.scss";

export interface DateFieldProps {
  title: string;
  subTitle?: string;
  name: string;
}

export const DateTimeField: React.FC<DateFieldProps> = ({
  title,
  subTitle,
  name,
}) => {
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
        />
        <input type="time" name={`${name}_time`} />
      </div>
    </>
  );
};
