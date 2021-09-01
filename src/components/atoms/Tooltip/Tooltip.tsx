import React from "react";
import {
  OverlayTrigger,
  OverlayTriggerProps,
  Tooltip as BoostrapTooltip,
} from "react-bootstrap";

export interface TooltipProps extends Omit<OverlayTriggerProps, "overlay"> {
  id: string;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  id,
  text,
  ...overlayTriggerProps
}) => {
  return (
    <OverlayTrigger
      {...overlayTriggerProps}
      overlay={<BoostrapTooltip id={id}>{text}</BoostrapTooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};
