import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { useImageInputCompression } from "hooks/useImageInputCompression";

import { ImageOverlay } from "components/atoms/ImageOverlay";

import "./ImageInput.scss";

export interface ImageInputProps {
  onChange?: (url: string) => void;
  name: string;
  imgUrl?: string;
  error?: FieldError;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  small?: boolean;
  register: ReturnType<typeof useForm>["register"];
  nameWithUnderscore?: boolean;
  btnLabel?: string;
  isInputHidden?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onChange = () => {},
  name,
  imgUrl,
  error,
  small = false,
  register,
  setValue,
  nameWithUnderscore = false,
  isInputHidden = false,
  btnLabel = "Upload",
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(imgUrl);

  const fileName = nameWithUnderscore ? `${name}_file` : `${name}File`;
  const fileUrl = nameWithUnderscore ? `${name}_url` : `${name}Url`;

  const {
    loading,
    errorMessage,
    handleFileInputChange,
  } = useImageInputCompression(register, error?.message, fileName);

  const handleFileInputChangeWrapper = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const [url, compressedFile] = await handleFileInputChange(event);
      if (!compressedFile || !url) return;

      setImageUrl(url);
      setValue(fileName, [compressedFile], false);
      onChange(url);
    },
    [handleFileInputChange, onChange, setValue, fileName]
  );

  const onButtonClick = () => {
    inputFileRef?.current?.click();
  };

  return (
    <>
      <label
        className={classNames("ImageInput__container", {
          "ImageInput__container--error": !!error?.message,
          "ImageInput__container--small": small,
          "ImageInput__container--disabled": loading,
          "ImageInput__container--hidden": isInputHidden,
        })}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <input
          accept={ACCEPTED_IMAGE_TYPES}
          hidden
          id={name}
          onChange={handleFileInputChangeWrapper}
          type="file"
          ref={inputFileRef}
        />
        {loading && <ImageOverlay disabled>processing...</ImageOverlay>}

        <span
          className={classNames("ImageInput__upload-button", {
            "ImageInput__upload-button--small": small,
            "ImageInput__upload-button--hidden": !!imageUrl,
          })}
        >
          Upload
        </span>
      </label>

      <input
        type="hidden"
        name={fileUrl}
        ref={register}
        value={imageUrl}
        readOnly
      />
      {isInputHidden && (
        <Button onClick={onButtonClick} variant="primary">
          {btnLabel}
        </Button>
      )}
      {errorMessage && <div className="ImageInput__error">{errorMessage}</div>}
    </>
  );
};

export default ImageInput;
