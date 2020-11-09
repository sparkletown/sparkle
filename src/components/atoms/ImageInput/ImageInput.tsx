import React, { useEffect, useRef, useState } from "react";
import { GIF_RESIZER_URL, MAX_IMAGE_FILE_SIZE_BYTES } from "settings";

// Typings
import { ImageInputProps } from "./ImageInput.types";

// Styles
import * as S from "./ImageInputProps.styles";

const ImageInput: React.FC<ImageInputProps> = ({
  onChange,
  customClass,
  name,
  imgUrl,
  error,
  small,
  forwardRef,
}) => {
  const [imageUrl, setImageUrl] = useState("");
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

  const initialRender = useRef<boolean>(true);

  useEffect(() => {
    initialRender.current = false;
  });

  useEffect(() => {
    if (initialRender && imgUrl) setImageUrl(imgUrl);
  }, [imgUrl]);

  return (
    <>
      <S.Wrapper
        small={small}
        hasError={!!error?.message}
        backgroundImage={imageUrl}
        as="label"
      >
        <input
          accept="image/x-png,image/gif,image/jpeg"
          className={customClass}
          hidden
          id={name}
          name={`${name}File`}
          onChange={(event) => handleOnChange(event.target.files)}
          ref={forwardRef}
          type="file"
        />

        <S.UploadButton isHidden={!!imageUrl}>Upload</S.UploadButton>
      </S.Wrapper>

      <input
        type="hidden"
        name={`${name}Url`}
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
