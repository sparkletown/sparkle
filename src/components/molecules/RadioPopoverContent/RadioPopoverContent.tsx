import React from "react";

import { getSoundCloudPlayerUrl } from "utils/radio";

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
  setVolume: (volume: number) => void;
  onMute: () => void;
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
  onMute,
}) => {
  const radioUrl = radioStation ? getSoundCloudPlayerUrl(radioStation) : "";

  return (
    <>
      <div className="RadioPopoverContent__title">{radioTitle}</div>
      {showNormalRadio && (
        <RadioModal
          {...{
            volume,
            setVolume,
          }}
          onMute={onMute}
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
          src={radioUrl}
        />
      )}
    </>
  );
};
