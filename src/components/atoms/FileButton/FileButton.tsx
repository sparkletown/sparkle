import React, { useCallback } from "react";
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
  disabled: isDisabled,
  onChange,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files || isDisabled) return;

      const url = URL.createObjectURL(files[0]);

      onChange(url, files);
    },
    [isDisabled, onChange]
  );

  const buttonClasses = classNames("btn btn-primary", {
    "btn-disabled": isDisabled,
  });

  return (
    <div className="FileButton">
      <button className={buttonClasses} disabled={isDisabled}>
        <label className="FileButton__label" htmlFor="fileButton">
          {title}
        </label>
      </button>

      <input
        hidden
        type="file"
        id="fileButton"
        disabled={isDisabled}
        onChange={handleChange}
      />

      {description && (
        <span className="FileButton__description">{description}</span>
      )}
    </div>
  );
};
