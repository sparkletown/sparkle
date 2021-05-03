import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { Checkbox } from "components/atoms/Checkbox";

import { PosterPageControl } from "../PosterPageControl";

import "./PosterPageSettingsControl.scss";

export interface PosterPageSettingsControlProps {
  setVenueLiveOff: () => void;
  setVenueLiveOn: () => void;
  isPosterLive?: boolean;
}

export const PosterPageSettingsControl: React.FC<PosterPageSettingsControlProps> = ({
  isPosterLive = false,
  setVenueLiveOff,
  setVenueLiveOn,
}) => (
  <OverlayTrigger
    trigger="click"
    placement="bottom-end"
    overlay={
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
    }
    rootClose={true}
  >
    <PosterPageControl label="Settings" icon={faCog} />
  </OverlayTrigger>
);
