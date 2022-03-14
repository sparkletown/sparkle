import React, { ReactNode, SyntheticEvent, useCallback } from "react";

import * as TW from "./Toggle.tailwind";

export interface ToggleProps {
  label: ReactNode;
  checked?: boolean;
  onChange?: React.ReactEventHandler<SyntheticEvent>;
  name?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked = false,
  onChange,
  name,
}) => {
  // NOTE: the click handlers needs to be on the label to capture all its children clicks and there must always be a <label>
  const handleClick = useCallback((event) => onChange?.(event), [onChange]);

  // NOTE: the thumb is a little circle sliding left-right inside a horizontal track
  const thumbClasses = TW[`${!!checked}Thumb`];
  const trackClasses = TW[`${!!checked}Track`];

  return (
    <div className="flex justify-end w-full">
      <label className="flex items-center cursor-pointer" onClick={handleClick}>
        <div className="relative">
          <input className="sr-only " name={name} type="checkbox" />
          <div className={trackClasses} />
          <div className={thumbClasses} />
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
      </label>
    </div>
  );
};
