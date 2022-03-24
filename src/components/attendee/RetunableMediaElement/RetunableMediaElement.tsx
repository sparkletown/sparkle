import { useCallback, useState } from "react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { TuneBanner } from "./components/TuneBanner";
import { useRetunableMediaElement } from "./hooks";
import { RetunableMediaSource } from "./types";

import styles from "./RetunableMediaElement.module.scss";

interface RetunableMediaElementProps {
  space: WithId<AnyVenue>;
}

export const RetunableMediaElement: React.FC<RetunableMediaElementProps> = ({
  space,
}: RetunableMediaElementProps) => {
  const [isTuning, setIsTuning] = useState(false);
  const startTuning = useCallback(() => setIsTuning(true), [setIsTuning]);
  const stopTuning = useCallback(() => setIsTuning(false), [setIsTuning]);
  const { isLoading, settings } = useRetunableMediaElement({
    spaceId: space.id,
  });

  if (isLoading) {
    return <></>;
  }

  if (isTuning) {
    return (
      <div className={styles.container}>
        <div className={styles.tuner}>
          <div className={styles.close} onClick={stopTuning}>
            Close
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
          <div>
            <label htmlFor="webcam">
              <input type="radio" name="source" value="webcam" id="webcam" />
              Broadcast my webcam
            </label>
            <label htmlFor="screenshare">
              <input
                type="radio"
                name="source"
                value="screenshare"
                id="screenshare"
              />
              Screen share
            </label>
            <div className={styles.divider} />
            <label htmlFor="channel">
              <input type="radio" name="source" value="channel" id="channel" />
              Channels
            </label>
            <label htmlFor="embed">
              <input type="radio" name="source" value="embed" id="embed" />
              Custom embed URL
            </label>
          </div>
        </div>
        <TuneBanner isTuning={isTuning} startTuning={startTuning} />
      </div>
    );
  }

  if (settings.sourceType === RetunableMediaSource.notTuned) {
    return (
      <div className={styles.container}>
        <TuneBanner isTuning={isTuning} startTuning={startTuning} />
      </div>
    );
  }
  return <div>I am media</div>;
};
