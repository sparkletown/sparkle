import React, { useCallback, useMemo } from "react";

import { ACCEPTED_IMAGE_TYPES, INVALID_SLUG_CHARS_REGEX } from "settings";

import { generateId } from "utils/string";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./FileButton.scss";

export interface FileButtonProps {
  title: string;
  accept?: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (url: string, file: FileList) => void;
}

export const FileButton: React.FC<FileButtonProps> = ({
  title,
  accept = ACCEPTED_IMAGE_TYPES,
  description,
  disabled,
  loading,
  onChange,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files || disabled) return;

      const url = URL.createObjectURL(files[0]);

      onChange(url, files);
    },
    [disabled, onChange]
  );

  const id = useMemo(
    () =>
      generateId("FileButton-" + title.replace(INVALID_SLUG_CHARS_REGEX, "-")),
    [title]
  );

  return (
    <div className="FileButton">
      <ButtonNG variant="primary" disabled={disabled} loading={loading}>
        <label className="FileButton__label" htmlFor={id}>
          {title}
        </label>
      </ButtonNG>

      <input
        className="FileButton__input"
        hidden
        type="file"
        id={id}
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
      />

      {description && (
        <span className="FileButton__description">{description}</span>
      )}
    </div>
  );
};
