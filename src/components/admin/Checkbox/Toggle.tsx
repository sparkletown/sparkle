import React from "react";

import * as TW from "./Toggle.tailwind";

export interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}

export const Toggle: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
}) => {
  const buttonClassName = checked
    ? TW.checkedButtonClass
    : TW.uncheckedButtonClass;
  const labelClassName = checked
    ? TW.checkedLabelClass
    : TW.uncheckedLabelClass;
  return (
    // <div className="flex justify-center">
    //   <div className="form-check form-switch">
    //     <input checked onChange={onChange} className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
    //     <label className="form-check-label inline-block text-gray-800" htmlFor="flexSwitchCheckDefault">{label}</label>
    //   </div>
    // </div>
    <div className="flex justify-center">
      <div className="form-check form-switch">
        <input
          onChange={onChange}
          className={buttonClassName}
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
        />
        <label className={labelClassName} htmlFor="flexSwitchCheckDefault">
          {label}
        </label>
      </div>
    </div>
  );
};
