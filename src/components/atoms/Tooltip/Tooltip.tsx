import React from "react";
import {
  OverlayTrigger,
  OverlayTriggerProps,
  Tooltip as BoostrapTooltip,
} from "react-bootstrap";

import { DEFAULT_MESSAGES } from "assets/messages";

export interface TooltipProps extends Omit<OverlayTriggerProps, "overlay"> {
  id: string;
  label: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, id, label }) => {
  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={
        <BoostrapTooltip id={id}>{DEFAULT_MESSAGES[label]}</BoostrapTooltip>
      }
    >
      {children}
    </OverlayTrigger>
  );
};
