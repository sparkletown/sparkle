import React, { useCallback } from "react";
import classNames from "classnames";

import { ButtonNG, ButtonProps } from "../ButtonNG/ButtonNG";

import "./FileButton.scss";

export interface FileButtonOnChangeData {
  url: string;
  files: FileList;
  file: File;
}

export interface FileButtonProps extends Omit<ButtonProps, "onClick"> {
  onChange: (data: FileButtonOnChangeData) => void;
}

export const FileButton: React.FC<FileButtonProps> = ({
  disabled,
  onChange,
  className,
  children,
  ...buttonNgProps
}) => {
  const inputId = `FileButton-input-id-${new Date().getTime()}-${Math.random()}`;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files: FileList | null = event.target.files;

      if (!files?.[0] || disabled) return;

      const file = files[0];
      const url: string = URL.createObjectURL(file);

      onChange({ url, files, file });
    },
    [disabled, onChange]
  );

  const containerClass = classNames("FileButton", className);

  return (
    <div className={containerClass}>
      <ButtonNG
        disabled={disabled}
        className="FileButton__button"
        {...buttonNgProps}
      >
        <label className="FileButton__label" htmlFor={inputId}>
          {children}
        </label>
      </ButtonNG>

      <input
        hidden
        type="file"
        id={inputId}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
};
