import React, { useState } from "react";
import { FieldError } from "react-hook-form";
import { useAsyncFn } from "react-use";
import imageCompression from "browser-image-compression";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE_BYTES } from "settings";

import "./ImageInput.scss";

export interface ImageInputProps {
  onChange?: (url: string) => void;
  name: string;
  imgUrl?: string;
  error?: FieldError;
  small?: boolean;
  forwardRef: (
    value: React.RefObject<HTMLInputElement> | HTMLInputElement | null
  ) => void;
  nameWithUnderscore?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onChange = () => {},
  name,
  imgUrl,
  error,
  small = false,
  forwardRef,
  nameWithUnderscore = false,
}) => {
  const [imageUrl, setImageUrl] = useState(imgUrl);
  const [compressionError, setCompressionError] = useState(false);

  const [{ loading }, handleOnChange] = useAsyncFn(
    async (files: FileList | null) => {
      if (!files) return;

      let file = files?.[0];
      if (!file) return;

      if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
        const compressionOptions = {
          maxSizeMB: 2,
          useWebWorker: true,
          maxIteration: 20,
        };

        try {
          file = await imageCompression(file, compressionOptions);
        } catch (e) {
          setCompressionError(true);
          return;
        }
        if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
          setCompressionError(true);
          return;
        }
      }

      setCompressionError(false);

      const url = URL.createObjectURL(file);

      setImageUrl(url);

      return onChange(url);
    },
    [onChange]
  );

  const fileName = nameWithUnderscore ? `${name}_file` : `${name}File`;
  const fileUrl = nameWithUnderscore ? `${name}_url` : `${name}Url`;

  const errorMessage =
    error?.message ??
    (compressionError && "An error occurred while compressing the image.");

  return (
    <>
      <label
        className={classNames("ImageInput__container", {
          "ImageInput__container--error": !!error?.message,
          "ImageInput__container--small": small,
          "ImageInput__container--disabled": loading,
        })}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <input
          accept={ACCEPTED_IMAGE_TYPES}
          hidden
          id={name}
          name={fileName}
          onChange={(event) => handleOnChange(event.target.files)}
          ref={forwardRef}
          type="file"
        />
        {loading && (
          <div className="ImageInput__processing ImageInput__processing--disabled">
            processing...
          </div>
        )}

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
        ref={forwardRef}
        value={imageUrl}
        readOnly
      />
      {errorMessage && <div className="ImageInput__error">{errorMessage}</div>}
    </>
  );
};

export default ImageInput;
