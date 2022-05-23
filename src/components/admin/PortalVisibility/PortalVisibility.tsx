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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      Object.values(LABEL_VISIBILITY_OPTIONS).map(
        ({ label, value, subtitle }, i) => {
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
                <div className="flex flex-col text-xs font-medium text-gray-700 bg-white rounded-md py-2 px-2">
                  {subtitle?.map(({ text, icon }) => (
                    <div
                      className="flex items-center justify-center"
                      key={text}
                    >
                      <FontAwesomeIcon icon={icon} />
                      <span className="ml-1 w-min">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-gray-700 text-sm my-2">{label}</span>
            </div>
          );
        }
      ),
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
    setSelected(value ?? RoomVisibility.nameCount);
  }, [name, getValues, setSelected]);

  return (
    <div className="my-2">
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
