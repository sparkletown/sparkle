import React, { CSSProperties, useMemo } from "react";

import styles from "./SubvenueDragPreview.module.scss";

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
      <div className={styles.dragPreview}>
        <div className={styles.container}>
          <img src={url} alt="subvenue-icon" style={imageStyle} />
        </div>
      </div>
    ),
    [url, imageStyle]
  );
};
