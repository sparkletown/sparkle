import React, { useCallback } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { setVenueLiveStatus } from "api/venue";

import { Checkbox } from "components/atoms/Checkbox";

import { PosterPageControl } from "../PosterPageControl";

import "./PosterPageSettingsControl.scss";

export interface PosterPageSettingsControlProps {
  venueId: string;
  isPosterLive?: boolean;
}

export const PosterPageSettingsControl: React.FC<PosterPageSettingsControlProps> = ({
  venueId,
  isPosterLive = false,
}) => (
  <OverlayTrigger
    trigger="click"
    placement="bottom-end"
    overlay={
      <PosterPageSettingsControlOverlay
        isPosterLive={isPosterLive}
        venueId={venueId}
      />
    }
    rootClose={true}
  >
    <PosterPageControl label="Settings" icon={faCog} />
  </OverlayTrigger>
);

export interface PosterPageSettingsControlOverlayProps {
  isPosterLive?: boolean;
  venueId: string;
}

export const PosterPageSettingsControlOverlay: React.FC<PosterPageSettingsControlProps> = ({
  isPosterLive,
  venueId,
}) => {
  const setVenueLiveOn = useCallback(() => {
    setVenueLiveStatus(venueId, true);
  }, [venueId]);

  const setVenueLiveOff = useCallback(() => {
    setVenueLiveStatus(venueId, false);
  }, [venueId]);

  return (
    <Popover
      id="poster-page-settings-popover"
      className="PosterPageSettingsControl__popover"
    >
      <Popover.Content className="PosterPageSettingsControl__popover-content">
        <Checkbox
          type="checkbox"
          checked={isPosterLive}
          onChange={isPosterLive ? setVenueLiveOff : setVenueLiveOn}
          label={isPosterLive ? "Poster is live" : "Make poster live"}
          toggler
        />
      </Popover.Content>
    </Popover>
  );
};
