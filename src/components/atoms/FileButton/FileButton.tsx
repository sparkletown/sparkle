import React from "react";

// Typings
import { FileButtonProps } from "./FileButton.types";

// Styles
import * as S from "./FileButton.styles";

const FileButton: React.FC<FileButtonProps> = ({
  text = "Import a map background",
  recommendedSize = "Recommended size: 2000px / 1200px",
  onChange,
}) => {
  const handleChange = (files: FileList | null) => {
    if (!files) return;

    const url = URL.createObjectURL(files[0]);

    onChange(url, files);
  };

  return (
    <S.Wrapper>
      <S.Label htmlFor="backgroundMap" as="label">
        {text}
      </S.Label>

      <input
        hidden
        type="file"
        id="backgroundMap"
        onChange={(event) => handleChange(event.target.files)}
      />

      <S.Recommended>{recommendedSize}</S.Recommended>
    </S.Wrapper>
  );
};

export default FileButton;
