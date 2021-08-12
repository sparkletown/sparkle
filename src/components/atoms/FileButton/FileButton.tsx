import React, { useCallback, useRef } from "react";
import classNames from "classnames";

import { ButtonNG, ButtonProps } from "../ButtonNG/ButtonNG";

import "./FileButton.scss";

export interface FileButtonOnChangeData {
  url: string;
  files: FileList;
  file: File;
}

export interface FileButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: (data: FileButtonOnChangeData) => void;
}

export const FileButton: React.FC<FileButtonProps> = ({
  disabled,
  onClick,
  className,
  children,
  ...buttonNgProps
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputId = `FileButton-input-id-${new Date().getTime()}-${Math.random()}`;

  const onChange = useCallback(
    (event) => {
      const files: FileList | null = event.target.files;

      if (!files?.[0] || disabled) return;

      const file = files[0];
      const url: string = URL.createObjectURL(file);

      onClick({ url, files, file });
      formRef.current?.reset();
    },
    [disabled, onClick]
  );

  const containerClass = classNames("FileButton", className);

  return (
    <div className={containerClass}>
      <form ref={formRef}>
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
          onChange={onChange}
        />
      </form>
    </div>
  );
};
