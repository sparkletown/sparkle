import React, { ReactNode, useEffect, useMemo, useState } from "react";
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
      Object.values(LABEL_VISIBILITY_OPTIONS).map(
        ({ subtitle, label, value }) => {
          const isSelected = isDefined(selected) && selected === value;
          const itemClasses = classNames({
            "PortalVisibility__item PortalVisibility__item--selected": isSelected,
            "PortalVisibility__item PortalVisibility__item--unselected": !isSelected,
          });

          return (
            <div
              key={label}
              onClick={(e) => {
                e.preventDefault();
                setSelected(value);
                setValue(name, value, { shouldValidate: true });
              }}
              className={itemClasses}
            >
              <div className="PortalVisibility__image">
                {subtitle && (
                  <div className="PortalVisibility__subtitle">
                    {subtitle.map(({ text, icon }, index) => (
                      <div
                        key={`${text}-${index}`}
                        className="PortalVisibility__subtitle-item"
                      >
                        <FontAwesomeIcon icon={icon} />
                        <span className="PortalVisibility__subtitle-text">
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="PortalVisibility__caption">{label}</span>
            </div>
          );
        }
      ),
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
    <div className="PortalVisibility">
      {label ? (
        <label className="PortalVisibility__label">
          {label}
          {renderedInput}
        </label>
      ) : (
        renderedInput
      )}

      {renderedItems}

      {error && (
        <span className="PortalVisibility__error">{error?.message}</span>
      )}
    </div>
  );
};
