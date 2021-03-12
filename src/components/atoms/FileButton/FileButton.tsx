import React from "react";

import * as S from "./FileButton.styles";

export interface FileButtonProps {
  text?: string;
  onChange: (url: string, file: FileList) => void;
}

const FileButton: React.FC<FileButtonProps> = ({
  text = "Upload a map background",
  onChange,
}) => {
  const handleChange = (files: FileList | null) => {
    if (!files) return;

    const url = URL.createObjectURL(files[0]);

    onChange(url, files);
  };

  return (
    <S.Wrapper htmlFor="backgroundMap" as="label">
      <S.Label >
        {text}
      </S.Label>

      <input
        hidden
        type="file"
        id="backgroundMap"
        onChange={(event) => handleChange(event.target.files)}
      />

    </S.Wrapper>
  );
};

export default FileButton;
