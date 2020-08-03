import React, { useMemo } from "react";
import { FieldError } from "react-hook-form";
import "firebase/functions";

interface ImageInputProps {
  disabled: boolean;
  name: string;
  image?: FileList;
  containerClassName?: string;
  imageClassName?: string;
  error?: FieldError;
}

// eslint-disable-next-line
export const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  (props, ref) => {
    const {
      image,
      containerClassName,
      imageClassName,
      name,
      error,
      disabled,
    } = props;

    const imageUrl = useMemo(
      () => image && image.length > 0 && URL.createObjectURL(image[0]),
      [image]
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
              <h6 className=" text">Click to upload an image</h6>
            </div>
          )}
          <input
            disabled={disabled}
            name={name}
            type="file"
            ref={ref}
            accept="image/x-png,image/gif,image/jpeg"
            className="default-input"
          />
        </div>
        {error?.message && <span className="input-error">{error.message}</span>}
      </>
    );
  }
);
