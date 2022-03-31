import React, { MouseEventHandler } from "react";
import { Popover, PopoverProps } from "components/attendee/Popover";

import { Room } from "types/rooms";

import { useSpaceById } from "hooks/spaces/useSpaceById";

import { Button } from "../Button";

import CN from "./PortalModal.module.scss";

interface PortalModalProps extends PopoverProps {
  onEnter?: MouseEventHandler<HTMLButtonElement>;
  portal: Room;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  referenceElement,
  onEnter,
  portal,
}) => {
  const { space } = useSpaceById({ spaceId: portal.spaceId });

  return (
    <Popover referenceElement={referenceElement}>
      <div className={CN.PortalPopupInfo}>
        <h3>{space?.name}</h3>
        <p>{space?.config?.landingPageConfig.description}</p>
        <Button onClick={onEnter}>Enter</Button>
      </div>
    </Popover>
  );
};
