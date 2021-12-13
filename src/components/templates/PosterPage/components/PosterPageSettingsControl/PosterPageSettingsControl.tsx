import React, { useCallback } from "react";
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
}) => {
  const setVenueLiveOn = useCallback(() => {
    setVenueLiveStatus({ venueId, isLive: true });
  }, [venueId]);

  const setVenueLiveOff = useCallback(() => {
    setVenueLiveStatus({ venueId, isLive: false });
  }, [venueId]);

  return (
    <div>
      <div
        id="poster-page-settings-popover"
        className="PosterPageSettingsControl__popover"
      >
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
      <PosterPageControl label="Settings" icon={faCog} />
    </div>
  );
};
