import React from "react";

import { IFRAME_ALLOW } from "settings";

import "./Video.scss";

export interface VideoProps {
  src?: string;
}

export const Video: React.FC<VideoProps> = ({
  src = "https://www.youtube.com/embed/x4Xt3P7FQ2M",
}) => (
  <div className="auditorium__video">
    <iframe
      className="auditorium__video__iframe"
      src={src}
      title="Video"
      frameBorder="0"
      allow={IFRAME_ALLOW}
      allowFullScreen
    />
  </div>
);
