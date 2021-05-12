import React from "react";

export interface TogglerProps {
  toggled: boolean;
  onChange: () => void;
  containerClassName?: string;
}

export const Toggler: React.FC<TogglerProps> = ({
  toggled,
  onChange,
  containerClassName = "",
}) => {
  return (
    <label className={`switch ${containerClassName}`}>
      <input type="checkbox" checked={toggled} onChange={onChange} />
      <span className="slider" />
    </label>
  );
};
