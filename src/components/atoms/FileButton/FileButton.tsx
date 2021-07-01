import React from "react";
import classNames from "classnames";

import "./FileButton.scss";

export interface FileButtonProps {
  title: string;
  description?: string;
  disabled?: boolean;
  onChange: (url: string, file: FileList) => void;
}

export const FileButton: React.FC<FileButtonProps> = ({
  title,
  description,
  disabled,
  onChange,
}) => {
  const handleChange = (files: FileList | null) => {
    if (!files || disabled) return;

    const url = URL.createObjectURL(files[0]);

    onChange(url, files);
  };

  const buttonClasses = classNames("btn btn-primary", {
    "btn-disabled": disabled,
  });

  return (
    <div className="FileButton">
      <button className={buttonClasses} disabled={disabled}>
        <label className="FileButton__label" htmlFor="fileButton">
          {title}
        </label>
      </button>

      <input
        hidden
        type="file"
        id="fileButton"
        disabled={disabled}
        onChange={(event) => handleChange(event.target.files)}
      />

      {description && (
        <span className="FileButton__description">{description}</span>
      )}
    </div>
  );
};

export default FileButton;
