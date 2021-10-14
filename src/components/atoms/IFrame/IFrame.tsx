import React from "react";
import classNames from "classnames";

import { IFRAME_ALLOW } from "settings";

import { ContainerClassName } from "types/utility";

import "./IFrame.scss";

export interface IFrameProps
  extends React.HTMLProps<HTMLIFrameElement>,
    ContainerClassName {
  iframeClassname?: string;
  iframeInlineStyles?: {};
}

export const IFrame: React.FC<IFrameProps> = ({
  containerClassName,
  iframeClassname,
  iframeInlineStyles,
  title = "iframe",
  ...extraIframeProps
}) => {
  const containerClasses = classNames("IFrame", containerClassName);

  const iframeClasses = classNames("IFrame__content", iframeClassname);

  return (
    <div className={containerClasses}>
      <iframe
        className={iframeClasses}
        style={iframeInlineStyles}
        title={title}
        frameBorder="0"
        allow={IFRAME_ALLOW}
        allowFullScreen
        {...extraIframeProps}
      />
    </div>
  );
};
