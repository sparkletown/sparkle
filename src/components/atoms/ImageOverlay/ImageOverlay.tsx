import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./ImageOverlay.scss";

export interface ImageOverlayProps
  extends ContainerClassName,
    React.HTMLProps<HTMLDivElement> {
  disabled?: boolean;
}

export const ImageOverlay: React.FC<
  React.PropsWithChildren<ImageOverlayProps>
> = ({ disabled, children, containerClassName, ...rest }) => {
  return (
    <div
      className={classNames("ImageOverlay", containerClassName, {
        "ImageOverlay--disabled": disabled,
      })}
      {...rest}
    >
      {children}
    </div>
  );
};
