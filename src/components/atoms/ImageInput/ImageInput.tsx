import React from "react";

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
}) => (
  <>
    <S.Wrapper small={small}>
      <input
        accept="image/x-png,image/gif,image/jpeg"
        className={customClass}
        hidden
        id={name}
        name={name}
        onChange={onChange}
        ref={forwardRef}
        type="file"
      />
      <S.Label htmlFor={name}>Upload</S.Label>
    </S.Wrapper>
    {error?.message && <span className="input-error">{error.message}</span>}
  </>
);

ImageInput.defaultProps = {
  small: false,
  customClass: "",
};

export default ImageInput;
