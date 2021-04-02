import React from "react";

import { IFRAME_ALLOW } from "settings";

export interface VideoProps {
  containerClassname: string;
  iframeClassname: string;
  iframeStyles?: {};
  src?: string;
}

export const Video: React.FC<VideoProps> = ({
  src,
  overlayClassname,
  iframeClassname,
  iframeStyles,
}) => (
  <div className={overlayClassname}>
    <iframe
      className={iframeClassname}
      src={src}
      title="Video"
      frameBorder="0"
      allow={IFRAME_ALLOW}
      allowFullScreen
      style={iframeStyles}
    />
  </div>
);
