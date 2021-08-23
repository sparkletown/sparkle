import React, { ChangeEvent, useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_SELECTABLE_IMAGE_FILE_SIZE_BYTES,
  MAX_SELECTABLE_IMAGE_FILE_SIZE_MB,
} from "settings";

import { fileSizeLimitString } from "utils/misc";

import { useTryCompressImage } from "hooks/useTryCompressImage";

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
}

const compressionError = "An error occurred while compressing the image.";
const tooLargeFileError = fileSizeLimitString(
  MAX_SELECTABLE_IMAGE_FILE_SIZE_MB
);

const ImageInput: React.FC<ImageInputProps> = ({
  onChange = () => {},
  name,
  imgUrl,
  error,
  small = false,
  register,
  setValue,
  nameWithUnderscore = false,
}) => {
  const [imageUrl, setImageUrl] = useState(imgUrl);

  const tryCompress = useTryCompressImage();

  const fileName = nameWithUnderscore ? `${name}_file` : `${name}File`;
  const fileUrl = nameWithUnderscore ? `${name}_url` : `${name}Url`;

  const [isTooLargeFileError, setIsTooLargeFileError] = useState(false);

  const [{ loading, error: isCompressionError }, handleFileChange] = useAsyncFn(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const file = files?.[0];
      if (!files || !file) return;
      if (file.size >= MAX_SELECTABLE_IMAGE_FILE_SIZE_BYTES) {
        setIsTooLargeFileError(true);
        return;
      } else setIsTooLargeFileError(false);

      const compressedFile = await tryCompress(file);

      const url = URL.createObjectURL(file);

      setImageUrl(url);

      onChange(url);
      setValue(fileName, [compressedFile], false);
    },
    [tryCompress, onChange, setValue, fileName]
  );

  useEffect(() => {
    register(fileName);
  }, [fileName, register]);

  const errorMessage =
    error?.message ??
    (isCompressionError && compressionError) ??
    (isTooLargeFileError && tooLargeFileError);

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
          onChange={handleFileChange}
          type="file"
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
      {errorMessage && <div className="ImageInput__error">{errorMessage}</div>}
    </>
  );
};

export default ImageInput;
