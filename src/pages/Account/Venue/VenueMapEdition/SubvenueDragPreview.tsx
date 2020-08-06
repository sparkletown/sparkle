import React, { useEffect, useState, memo } from "react";

export interface PropsType {
  url: string;
}

export const SubvenueDragPreview: React.FC<PropsType> = memo(({ url }) => {
  const [tickTock, setTickTock] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTickTock(!tickTock), 500);
    return () => clearInterval(interval);
  }, [tickTock]);

  return (
    <div className="subvenue-drag-preview">
      <img src={url} alt="subvenue-icon" />
    </div>
  );
});
