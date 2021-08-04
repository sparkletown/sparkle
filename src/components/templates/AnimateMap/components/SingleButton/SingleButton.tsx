import React from "react";
import "./SingleButton.scss";

export interface SingleButtonProps {
  onClick?: () => void;
  icon?: string;
  alt?: string;
  label?: string;
  toggled?: boolean;
  toggledIcon?: string;
  toggledValue?: boolean;
}

export const SingleButton: React.FC<SingleButtonProps> = ({
  onClick,
  icon,
  alt,
  label,
  toggled,
  toggledIcon,
  toggledValue,
}) => {
  const iconElement =
    !toggled && (icon || alt) ? (
      <img className="SingleButton__icon" src={icon} alt={alt ?? undefined} />
    ) : undefined;
  const toggleIconElement =
    toggled && (toggledIcon || alt) ? (
      <img
        className="SingleButton__icon"
        src={toggledValue ? icon : toggledIcon}
        alt={alt ?? undefined}
      />
    ) : undefined;
  const labelElement = label ? (
    <div className="SingleButton__label">{label}</div>
  ) : undefined;

  return (
    <div onClick={onClick} className="SingleButton">
      {toggled ? toggleIconElement : iconElement}
      {labelElement}
    </div>
  );
};
