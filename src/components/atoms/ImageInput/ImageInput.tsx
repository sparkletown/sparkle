import React, { useState } from "react";
import { GIF_RESIZER_URL, MAX_IMAGE_FILE_SIZE_BYTES } from "settings";

// Typings
import { ImageInputProps } from "./ImageInput.types";

// Styles
import * as S from "./ImageInput.styles";

const ImageInput: React.FC<ImageInputProps> = ({
  onChange = () => {},
  customClass,
  name,
  imgUrl,
  error,
  small,
  forwardRef,
  nameWithUnderscore = false,
}) => {
  const [imageUrl, setImageUrl] = useState(imgUrl);
  const [imageSizeError, setImageSizeError] = useState(false);

  const handleOnChange = (files: FileList | null) => {
    if (!files) return;

    if (files[0].size < MAX_IMAGE_FILE_SIZE_BYTES) {
      const url = URL.createObjectURL(files[0]);

      setImageSizeError(false);
      setImageUrl(url);

      return onChange(url);
    }

    setImageSizeError(true);
  };

  const imageError =
    error?.message ||
    `File size limit is 2mb. You can shrink images at ${GIF_RESIZER_URL}`;

  const fileName = nameWithUnderscore ? `${name}_file` : `${name}File`;
  const fileUrl = nameWithUnderscore ? `${name}_url` : `${name}Url`;

  return (
    <>
      <S.Wrapper
        small={small}
        hasError={!!error?.message}
        backgroundImage={imageUrl}
        as="label"
      >
        <input
          accept="image/png,image/x-png,image/gif,image/jpeg"
          className={customClass}
          hidden
          id={name}
          name={fileName}
          onChange={(event) => handleOnChange(event.target.files)}
          ref={forwardRef}
          type="file"
        />

        <S.UploadButton isHidden={!!imageUrl}>Upload</S.UploadButton>
      </S.Wrapper>

      <input
        type="hidden"
        name={fileUrl}
        ref={forwardRef}
        value={imageUrl}
        readOnly
      />
      {(error?.message || imageSizeError) && <S.Error>{imageError}</S.Error>}
    </>
  );
};

ImageInput.defaultProps = {
  small: false,
  customClass: "",
};

export default ImageInput;
