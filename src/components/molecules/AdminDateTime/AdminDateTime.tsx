import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { get, omit } from "lodash";

import { SpaceTimingFormInput } from "components/organisms/SpaceTimingForm/SpaceTimingForm";

import "./AdminDateTime.scss";

const omitChildProps = (childProps: AdminDateTimeChildInputProps | undefined) =>
  omit(childProps, ["label"]);

export interface AdminDateTimeChildInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  label?: ReactNode | string;
}

export interface DateFieldProps {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  supertext?: ReactNode | string;
  register: UseFormRegister<SpaceTimingFormInput>;
  errors?: FieldErrors<FieldValues>;
  dateProps?: AdminDateTimeChildInputProps;
  timeProps?: AdminDateTimeChildInputProps;
}

export const AdminDateTime: React.FC<DateFieldProps> = ({
  name,
  label,
  subtext,
  supertext,
  register,
  errors,
  dateProps,
  timeProps,
}) => {
  const nameDate = `${name}Date`;
  const nameTime = `${name}Time`;

  const errorParent = get(errors, name);
  const errorDate = get(errors, nameDate);
  const errorTime = get(errors, nameTime);

  const classesParent = classNames({
    AdminDateTime: !errorParent,
    "AdminDateTime AdminDateTime--error": errorParent,
  });

  const classesDate = classNames({
    "AdminDateTime__date-input": !errorDate,
    "AdminDateTime__date-input AdminDateTime--error": errorDate,
  });

  const classesTime = classNames({
    "AdminDateTime__time-input": !errorTime,
    "AdminDateTime__time-input AdminDateTime--error": errorTime,
  });

  const dateInput = useMemo(
    () => (
      // NOTE: allowing the type to be overridden by props for special cases
      <span className="AdminDateTime__input-wrapper">
        <input
          type="date"
          {...omitChildProps(dateProps)}
          className={classesDate}
          name={nameDate}
          {...register}
        />
        {errorDate && (
          <span className="AdminDateTime__error">{errorDate?.message}</span>
        )}
      </span>
    ),
    [nameDate, errorDate, classesDate, register, dateProps]
  );

  const timeInput = useMemo(
    () => (
      // NOTE: allowing the type to be overridden by props for special cases
      <span className="AdminDateTime__input-wrapper">
        <input
          type="time"
          {...omitChildProps(timeProps)}
          className={classesTime}
          name={nameTime}
          {...register}
        />
        {errorTime && (
          <span className="AdminDateTime__error">{errorTime?.message}</span>
        )}
      </span>
    ),
    [nameTime, errorTime, classesTime, register, timeProps]
  );

  return (
    <p className={classesParent}>
      {label && (
        <label className="AdminDateTime__label">
          {label}
          {/*
          NOTE: probably not kept in sync with the other values,
          but does provide a convenient input target for the label
          (which can't have multiple targets i.e. date and time)
          */}
          <input
            className="AdminDateTime__input"
            name={name}
            {...register}
            type="hidden"
          />
        </label>
      )}

      {supertext && (
        <span className="AdminDateTime__supertext">{supertext}</span>
      )}

      <span className="AdminDateTime__inputs">
        {dateProps?.label ? (
          <label className="AdminDateTime__date-label">
            {dateProps.label}
            {dateInput}
          </label>
        ) : (
          dateInput
        )}

        {timeProps?.label ? (
          <label className="AdminDateTime__time-label">
            {timeProps.label}
            {timeInput}
          </label>
        ) : (
          timeInput
        )}
      </span>

      {subtext && <span className="AdminDateTime__subtext">{subtext}</span>}
      {errorParent && (
        <span className="AdminDateTime__error">{errorParent?.message}</span>
      )}
    </p>
  );
};
