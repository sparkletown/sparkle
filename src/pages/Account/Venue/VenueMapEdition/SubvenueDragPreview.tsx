import React, { CSSProperties, useMemo } from "react";

export interface PropsType {
  url: string;
  containerStyle: CSSProperties;
  imageStyle: CSSProperties;
}

export const SubvenueDragPreview: React.FC<PropsType> = ({
  url,
  imageStyle,
  containerStyle,
}) => {
  return useMemo(
    () => (
      <div
        className="subvenue-drag-preview"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <div style={containerStyle}>
          <img src={url} alt="subvenue-icon" style={imageStyle} />
        </div>
      </div>
    ),
    [url, imageStyle, containerStyle]
  );
};
