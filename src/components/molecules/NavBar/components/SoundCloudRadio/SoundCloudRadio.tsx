import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import { generateId } from "utils/string";

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
  const id = useMemo(() => generateId("SoundCloudRadio-player"), []);

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

  const buttonClasses = classNames({
    "SoundCloudRadio__button SoundCloudRadio__button--on": volume,
    "SoundCloudRadio__button SoundCloudRadio__button--off": !volume,
  });

  return (
    <div className={parentClasses}>
      <ButtonNG className={buttonClasses} onClick={toggleVisible} />

      <div className="SoundCloudRadio__wrapper">
        <iframe
          id={id}
          title="radio"
          scrolling="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${station}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`}
        />
      </div>
    </div>
  );
};
