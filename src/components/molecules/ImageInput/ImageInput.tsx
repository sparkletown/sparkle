import React, { ChangeEvent, useCallback, useMemo, useRef } from "react";
import { FieldError, useForm } from "react-hook-form";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { ContainerClassName } from "types/utility";

import { useImageInputCompression } from "hooks/useImageInputCompression";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ImageOverlay } from "components/atoms/ImageOverlay";

import "firebase/functions";

interface ImageInputProps extends ContainerClassName {
  disabled: boolean;
  isInputHidden?: boolean;
  name: string;
  remoteUrlInputName?: string;
  remoteImageUrl?: string;
  image?: FileList;
  imageClassName?: string;
  error?: FieldError;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  register: ReturnType<typeof useForm>["register"];
  text?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  image,
  remoteUrlInputName,
  remoteImageUrl,
  containerClassName,
  imageClassName,
  name,
  error,
  disabled,
  setValue,
  register,
  isInputHidden = false,
  text = "Upload",
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const imageUrl = useMemo(
    () =>
      (image && image.length > 0 && URL.createObjectURL(image[0])) ||
      remoteImageUrl,
    [image, remoteImageUrl]
  );

  const {
    loading,
    errorMessage,
    handleFileInputChange,
  } = useImageInputCompression(register, error?.message, name);

  const handleFileInputChangeWrapper = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const [url, compressedFile] = await handleFileInputChange(event);
      if (!compressedFile || !url) return;

      setValue(name, [compressedFile], false);

      if (remoteUrlInputName) {
        setValue(remoteUrlInputName, url, true);
      }
    },
    [handleFileInputChange, name, remoteUrlInputName, setValue]
  );

  const onButtonClick = () => {
    inputFileRef?.current?.click();
  };

  const containerClasses = classNames(
    "image-input default-container",
    {
      containerClassName,
      "mod--hidden": isInputHidden,
    },
    { disabled: loading }
  );

  return (
    <>
      <div className={containerClasses}>
        {imageUrl ? (
          <img
            className={`default-image ${imageClassName}`}
            src={imageUrl}
            alt="upload"
          />
        ) : (
          <div className="centered-flex empty">
            <h6 className=" text" style={{ fontWeight: "lighter" }}>
              Click to upload an image
            </h6>
          </div>
        )}
        <input
          disabled={disabled || loading}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          onChange={handleFileInputChangeWrapper}
          className="default-input"
          ref={inputFileRef}
        />

        {loading && <ImageOverlay>processing...</ImageOverlay>}
        {remoteUrlInputName && (
          <input type="hidden" ref={register} name={remoteUrlInputName} />
        )}
      </div>
      {isInputHidden && (
        <ButtonNG onClick={onButtonClick} variant="primary">
          {text}
        </ButtonNG>
      )}
      {errorMessage && <span className="input-error">{errorMessage}</span>}
    </>
  );
};
