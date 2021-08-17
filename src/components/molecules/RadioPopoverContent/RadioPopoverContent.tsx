import React from "react";

import { RadioModal } from "components/organisms/RadioModal/RadioModal";

import "./RadioPopoverContent.scss";

export interface RadioPopoverContentProps {
  radioTitle: string;
  showNormalRadio: boolean;
  showSoundCloudRadio: boolean;
  radioStation: string | false;
  isRadioPlaying: boolean;
  handleRadioEnable: () => void;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

export const RadioPopoverContent: React.FC<RadioPopoverContentProps> = ({
  radioTitle,
  showNormalRadio,
  showSoundCloudRadio,
  radioStation,
  isRadioPlaying,
  handleRadioEnable,
  volume,
  setVolume,
}) => (
  <>
    <div className="RadioPopoverContent--title">{radioTitle}</div>
    {showNormalRadio && (
      <RadioModal
        {...{
          volume,
          setVolume,
        }}
        onEnableHandler={handleRadioEnable}
        isRadioPlaying={isRadioPlaying}
      />
    )}
    {showSoundCloudRadio && (
      <iframe
        title="venueRadio"
        id="sound-cloud-player"
        scrolling="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${radioStation}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`}
      />
    )}
  </>
);
