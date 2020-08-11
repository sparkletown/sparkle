import React, { useEffect, useState, useMemo } from "react";

export interface PropsType {
  url: string;
}

export const SubvenueDragPreview: React.FC<PropsType> = ({ url }) => {
  const [tickTock, setTickTock] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTickTock(!tickTock), 500);
    return () => clearInterval(interval);
  }, [tickTock]);

  return useMemo(
    () => (
      <div className="subvenue-drag-preview">
        <img src={url} alt="subvenue-icon" />
      </div>
    ),
    [url]
  );
};
