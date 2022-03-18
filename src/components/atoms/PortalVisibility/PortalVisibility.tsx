import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { LABEL_VISIBILITY_OPTIONS } from "settings";

import { RoomVisibility } from "types/RoomVisibility";
import { AnyForm } from "types/utility";

import { isDefined } from "utils/types";

import "./PortalVisibility.scss";

interface PortalVisibilityProps {
  errors?: FieldErrors<FieldValues>;
  getValues: () => Record<string, unknown>;
  name: string;
  label?: ReactNode | string;
  register: UseFormRegister<AnyForm>;
  setValue: UseFormSetValue<AnyForm>;
}

export const PortalVisibility: React.FC<PortalVisibilityProps> = ({
  errors,
  getValues,
  name,
  label,
  setValue,
  register,
}) => {
  const error = get(errors, name);
  const [selected, setSelected] = useState<RoomVisibility | undefined>();

  const renderedItems = useMemo(
    () =>
      Object.values(LABEL_VISIBILITY_OPTIONS).map(({ label, value }) => {
        const isSelected = isDefined(selected) && selected === value;
        const imageClasses = classNames({
          "bg-indigo-600 border-transparent text-white hover:bg-indigo-700 border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 bg-white border-gray-200 text-gray-900 hover:bg-white": isSelected,
          "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 bg-white border-gray-200 text-gray-900 hover:bg-white": !isSelected,
        });

        return (
          <div
            key={label}
            onClick={(e) => {
              e.preventDefault();
              setSelected(value);
              setValue(name, value, { shouldValidate: true });
            }}
          >
            <div className={imageClasses}>
              <img src="#" alt="" />
            </div>
            <span className="text-gray-300 text-sm my-2">{label}</span>
          </div>
        );
      }),
    [selected, setValue, setSelected, name]
  );

  const renderedInput = useMemo(
    () => (
      <input
        className="PortalVisibility__input"
        type="hidden"
        name={name}
        {...register}
      />
    ),
    [name, register]
  );

  useEffect(() => {
    const values = getValues?.();
    const value = get(values, name) as RoomVisibility | undefined;
    setSelected(value);
  }, [name, getValues, setSelected]);

  return (
    <div className="mt-1">
      {label ? (
        <label className="PortalVisibility__label">
          {label}
          {renderedInput}
        </label>
      ) : (
        renderedInput
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {renderedItems}
      </div>

      {error && (
        <span className="PortalVisibility__error">{error?.message}</span>
      )}
    </div>
  );
};
