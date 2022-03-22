import React, { ReactNode, SyntheticEvent, useCallback } from "react";
import { UseFormRegister } from "react-hook-form";

import { AnyForm } from "types/utility";

import * as TW from "./Toggle.tailwind";

export interface ToggleProps {
  label: ReactNode;
  checked?: boolean;
  onChange?: React.ReactEventHandler<SyntheticEvent>;
  register?: UseFormRegister<AnyForm>;
  name?: string;
  title?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked = false,
  onChange,
  register,
  name = "",
  title = "",
}) => {
  // NOTE: the click handlers needs to be on the label to capture all its children clicks and there must always be a <label>
  const handleClick = useCallback(
    (event) => {
      !register && onChange?.(event);
    },
    [onChange, register]
  );

  // NOTE: the thumb is a little circle sliding left-right inside a horizontal track
  const thumbClasses = TW[`${!!checked}Thumb`];
  const trackClasses = TW[`${!!checked}Track`];

  return (
    <div className="flex flex-col w-full mb-3">
      {title && (
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
      )}
      <label className="flex items-center cursor-pointer mt-3">
        <div className="relative">
          <input
            className="sr-only"
            type="checkbox"
            onClick={handleClick}
            {...register?.(name)}
          />
          <div className={trackClasses} />
          <div className={thumbClasses} />
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
      </label>
    </div>
  );
};
