import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import imageCompression from "browser-image-compression";
import classNames from "classnames";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  MAX_IMAGE_FILE_SIZE_MB,
} from "settings";

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
  const [compressionError, setCompressionError] = useState(false);

  const [{ loading }, compressIfNecessary] = useAsyncFn(
    async (files: FileList | null) => {
      if (!files) return;

      let file = files?.[0];
      if (!file) return;

      if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
        const compressionOptions = {
          maxSizeMB: MAX_IMAGE_FILE_SIZE_MB,
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

      onChange(url);
      return file;
    },
    [onChange]
  );

  const fileName = nameWithUnderscore ? `${name}_file` : `${name}File`;
  const fileUrl = nameWithUnderscore ? `${name}_url` : `${name}Url`;

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const compressedFile = await compressIfNecessary(event.target.files);

      if (compressedFile) setValue(fileName, [compressedFile], false);
      else setValue(fileName, null, false);
    },
    [fileName, compressIfNecessary, setValue]
  );

  useEffect(() => {
    register(fileName);
  }, [fileName, register]);

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
