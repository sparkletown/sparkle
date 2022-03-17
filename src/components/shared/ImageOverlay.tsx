import React from "react";
import classNames from "classnames";
import { CenterContent } from "components/admin/CenterContent";

export interface ImageOverlayProps extends React.HTMLProps<HTMLDivElement> {
  disabled?: boolean;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({
  disabled,
  children,
  className,
  ...rest
}) => {
  return (
    <CenterContent
      className={classNames("ImageOverlay whitespace-nowrap", className, {
        "ImageOverlay--disabled": disabled,
      })}
      {...rest}
    >
      {children}
    </CenterContent>
  );
};
