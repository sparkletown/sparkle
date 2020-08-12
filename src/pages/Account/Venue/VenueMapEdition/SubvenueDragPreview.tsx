import React, { useMemo, CSSProperties } from "react";

export interface PropsType {
  url: string;
  imageStyle: CSSProperties;
}

export const SubvenueDragPreview: React.FC<PropsType> = ({
  url,
  imageStyle,
}) => {
  return useMemo(
    () => (
      <div className="subvenue-drag-preview">
        <img src={url} alt="subvenue-icon" style={imageStyle} />
      </div>
    ),
    [url, imageStyle]
  );
};
