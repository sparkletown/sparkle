import React, { ReactNode } from "react";

import * as TW from "./Toggle.tailwind";

export interface ToggleProps {
  label: ReactNode;
  checked?: boolean;
  onChange?: (ev: React.FormEvent<HTMLInputElement>) => void;
  name?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked = false,
  onChange,
  name,
}) => {
  const toggleClassName = checked
    ? TW.checkedButtonClass
    : TW.uncheckedButtonClass;
  const dotClassName = checked ? TW.checkedLabelClass : TW.uncheckedLabelClass;
  return (
    <div className="flex justify-end w-full">
      <label
        htmlFor={`toggle${name}`}
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle${name}`}
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
