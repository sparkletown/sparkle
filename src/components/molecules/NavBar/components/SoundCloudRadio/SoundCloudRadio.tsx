import React, { useCallback, useState } from "react";
import classNames from "classnames";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./SoundCloudRadio.scss";

export type SoundCloudRadioProps = {
  station: string | undefined;
  volume: number;
};

export const SoundCloudRadio: React.FC<SoundCloudRadioProps> = ({
  station,
  volume,
}) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = useCallback(
    () => setVisible((prevState) => !prevState),
    []
  );

  const parentClasses = classNames({
    SoundCloudRadio: true,
    "SoundCloudRadio--on": volume,
    "SoundCloudRadio--off": !volume,
    "SoundCloudRadio--visible": visible,
    "SoundCloudRadio--invisible": !visible,
  });

  return (
    <div className={parentClasses}>
      <ButtonNG className="SoundCloudRadio__button" onClick={toggleVisible} />

      <div className="SoundCloudRadio__wrapper">
        <iframe
          title="venueRadio"
          id="sound-cloud-player"
          scrolling="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${station}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`}
        />
      </div>
    </div>
  );
};
