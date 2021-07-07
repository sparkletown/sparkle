import React from "react";

import { IFRAME_ALLOW } from "settings";

export interface IFrameProps extends React.HTMLProps<HTMLIFrameElement>{
  containerClassname?: string;
  iframeClassname?: string;
}

export const IFrame: React.FC<IFrameProps> = ({
  src,
  containerClassname,
  iframeClassname,
  iframeStyles,
  title = "iframe",
}) => (
  <div className={containerClassname}>
    <iframe
      className={iframeClassname}
      style={iframeStyles}
      src={src}
      title={title}
      frameBorder="0"
      allow={IFRAME_ALLOW}
      allowFullScreen
    />
  </div>
);
