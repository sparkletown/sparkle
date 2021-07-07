import React from "react";

import { IFRAME_ALLOW } from "settings";

export interface IFrameProps extends React.HTMLProps<HTMLIFrameElement> {
  containerClassname?: string;
  iframeClassname?: string;
  iframeInlineStyles?: {};
}

export const IFrame: React.FC<IFrameProps> = ({
  containerClassname,
  iframeClassname,
  iframeInlineStyles,
  title = "iframe",
  ...extraIframeProps
}) => (
  <div className={containerClassname}>
    <iframe
      className={iframeClassname}
      style={iframeInlineStyles}
      title={title}
      frameBorder="0"
      allow={IFRAME_ALLOW}
      allowFullScreen
      {...extraIframeProps}
    />
  </div>
);
