import React, { useEffect } from "react";

export interface ExternalRoomProps {
  venue: WithId<AnyVenue>;
}

export const ExternalRoom: React.FC<ExternalRoomProps> = ({ zoomUrl }) => {
  useEffect(() => {
    window.open(zoomUrl);
  }, [zoomUrl]);
  return (
    <div className="external-rooms">
      <h4>
        Please keep this tab open while you are directed to external content.
      </h4>
      <h4>Return to this tab when you are ready to explore some more!</h4>
      <a rel="noreferrer" href={zoomUrl} target="_blank">
        Open room manually.
      </a>
    </div>
  );
};
