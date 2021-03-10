import React from "react";

import { IFRAME_ALLOW } from "settings";

import "./Video.scss";

export interface VideoProps {
  src?: string;
}

export const Video: React.FC<VideoProps> = ({ src }) => (
  <div className="auditorium__video">
    <iframe
      className="frame"
      src={src}
      title="Video"
      frameBorder="0"
      allow={IFRAME_ALLOW}
      allowFullScreen
    />
  </div>
);
