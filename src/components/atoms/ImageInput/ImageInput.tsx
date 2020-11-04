import React, { useState } from "react";

// Typings
import { ImageInputProps } from "./ImageInput.types";

// Styles
import * as S from "./ImageInputProps.styles";

const ImageInput: React.FC<ImageInputProps> = ({
  onChange,
  customClass,
  name,
  imageURL,
  error,
  small,
  forwardRef,
}) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleOnChange = (files: FileList | null) => {
    if (!files) return;

    const url = URL.createObjectURL(files[0])

    setImageUrl(url);
    return onChange(url);
  }

  return (
  <>
    <S.Wrapper small={small} hasError={!!error?.message}>
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
      <S.Label htmlFor={name}>Upload</S.Label>

      <input
        type="hidden"
        name={`${name}Url`}
        ref={forwardRef}
        value={imageUrl}
        readOnly
      />
    </S.Wrapper>
    {error?.message && <S.Error>{error.message}</S.Error>}
  </>
)}

ImageInput.defaultProps = {
  small: false,
  customClass: "",
};

export default ImageInput;
