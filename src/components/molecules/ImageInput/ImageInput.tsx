import React, { useMemo } from "react";
import { FieldError } from "react-hook-form";
import "firebase/functions";
import { ACCEPTED_IMAGE_TYPES } from "settings";
import { ContainerClassName } from "../../../types/utility";

interface ImageInputProps extends ContainerClassName {
  disabled: boolean;
  name: string;
  remoteUrlInputName?: string;
  remoteImageUrl?: string;
  image?: FileList;
  imageClassName?: string;
  error?: FieldError;
}

// eslint-disable-next-line
export const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  (props, ref) => {
    const {
      image,
      remoteUrlInputName,
      remoteImageUrl,
      containerClassName,
      imageClassName,
      name,
      error,
      disabled,
    } = props;

    const imageUrl = useMemo(
      () =>
        (image && image.length > 0 && URL.createObjectURL(image[0])) ||
        remoteImageUrl,
      [image, remoteImageUrl]
    );

    return (
      <>
        <div className={`image-input default-container ${containerClassName}`}>
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
            disabled={disabled}
            name={name}
            type="file"
            ref={ref}
            accept={ACCEPTED_IMAGE_TYPES}
            className="default-input"
          />
          {remoteUrlInputName && (
            <input
              type="hidden"
              ref={ref}
              name={remoteUrlInputName}
              value={remoteImageUrl}
            />
          )}
        </div>
        {error?.message && <span className="input-error">{error.message}</span>}
      </>
    );
  }
);
