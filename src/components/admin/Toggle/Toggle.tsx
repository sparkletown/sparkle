import React from "react";

import * as TW from "./Toggle.tailwind";

export interface ToggleProps {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked = false,
  onChange,
}) => {
  const toggleClassName = checked
    ? TW.checkedButtonClass
    : TW.uncheckedButtonClass;
  const dotClassName = checked ? TW.checkedLabelClass : TW.uncheckedLabelClass;
  return (
    <div className="flex justify-end w-full">
      <label htmlFor="toggleB" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="toggleB"
            onChange={onChange}
            className="sr-only "
          />
          <div className={toggleClassName}></div>
          <div className={dotClassName}></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
      </label>
    </div>
  );
};
