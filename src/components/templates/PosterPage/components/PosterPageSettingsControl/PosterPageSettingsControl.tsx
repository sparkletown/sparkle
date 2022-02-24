import React, { useCallback } from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import { setVenueLiveStatus } from "api/venue";

import { Checkbox } from "components/atoms/Checkbox";
import { Popover } from "components/molecules/Popover";

import { PosterPageControl } from "../PosterPageControl";

import "./PosterPageSettingsControl.scss";

export interface PosterPageSettingsControlProps {
  venueId: string;
  isPosterLive?: boolean;
}

export const PosterPageSettingsControl: React.FC<PosterPageSettingsControlProps> = ({
  venueId,
  isPosterLive = false,
}) => {
  const setVenueLiveOn = useCallback(() => {
    setVenueLiveStatus({ venueId, isLive: true });
  }, [venueId]);

  const setVenueLiveOff = useCallback(() => {
    setVenueLiveStatus({ venueId, isLive: false });
  }, [venueId]);

  return (
    <Popover
      className="PosterPageSettingsControl"
      overlay={
        <div className="PosterPageSettingsControl__popover">
          <div className="PosterPageSettingsControl__popover-content">
            <Checkbox
              type="checkbox"
              checked={isPosterLive}
              onChange={isPosterLive ? setVenueLiveOff : setVenueLiveOn}
              label={isPosterLive ? "Poster is live" : "Make poster live"}
              toggler
            />
          </div>
        </div>
      }
      closeRoot
    >
      <PosterPageControl label="Settings" icon={faCog} />
    </Popover>
  );
};
