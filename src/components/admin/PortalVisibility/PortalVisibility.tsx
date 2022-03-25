import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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

import {
  imageSelectedTailwind,
  imageTailwind,
} from "./PortalVisibility.tailwind";

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

  const handleClick = useCallback(
    ({ value, name }) => {
      setSelected(value);
      setValue(name, value, { shouldValidate: true });
    },
    [setValue]
  );

  const renderedItems = useMemo(
    () =>
      Object.values(LABEL_VISIBILITY_OPTIONS).map(({ label, value }, i) => {
        const isSelected = isDefined(selected) && selected === value;
        const imageClasses = classNames({
          [imageSelectedTailwind]: isSelected,
          [imageTailwind]: !isSelected,
        });

        return (
          <div
            key={`${label}-${i}`}
            onClick={() => handleClick({ value, name })}
          >
            <div className={imageClasses}>
              {/* @debt: add portal visibility images */}
              <img src="#" alt="" />
            </div>
            <span className="text-gray-300 text-sm my-2">{label}</span>
          </div>
        );
      }),
    [selected, name, handleClick]
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

      <div className="grid grid-cols-4 gap-4">{renderedItems}</div>

      {error && (
        <span className="PortalVisibility__error">{error?.message}</span>
      )}
    </div>
  );
};
