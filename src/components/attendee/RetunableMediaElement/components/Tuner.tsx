import React, { useCallback, useMemo, useRef, useState } from "react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "components/attendee/Button";
import { Input } from "components/attendee/Input";
import { useVideoComms } from "components/attendee/VideoComms/hooks";

import { setRetunableMediaSettings } from "api/retunableMediaElement";

import { SpaceWithId } from "types/id";

import { useUserId } from "hooks/user/useUserId";

import { useRetunableMediaElement } from "../hooks";
import { RetunableMediaSource } from "../RetunableMediaElement.types";

import styles from "./Tuner.module.scss";

interface TunerProps {
  space: SpaceWithId;
  stopTuning: () => void;
}

export const Tuner: React.FC<TunerProps> = ({
  space,
  stopTuning,
}: TunerProps) => {
  const { userId } = useUserId();
  const [selectedSource, setSelectedSource] = useState<RetunableMediaSource>(
    RetunableMediaSource.notTuned
  );
  const { settings } = useRetunableMediaElement({
    spaceId: space.id,
  });

  const { shareScreen, stopShareScreen } = useVideoComms();

  const onTune = useCallback(() => {
    if (selectedSource === RetunableMediaSource.webcam) {
      setRetunableMediaSettings({
        spaceId: space.id,
        settings: {
          sourceType: selectedSource,
          webcamUserId: userId,
        },
      });
    } else if (selectedSource === RetunableMediaSource.screenshare) {
      shareScreen();
      setRetunableMediaSettings({
        spaceId: space.id,
        settings: {
          sourceType: selectedSource,
          screenshareUserId: userId,
        },
      });
    } else if (selectedSource === RetunableMediaSource.embed) {
      const value = embedUrlInputEl?.current?.value;
      if (value) {
        setRetunableMediaSettings({
          spaceId: space.id,
          settings: {
            sourceType: selectedSource,
            embedUrl: value,
          },
        });
      }
    } else if (selectedSource === RetunableMediaSource.notTuned) {
      setRetunableMediaSettings({
        spaceId: space.id,
        settings: { sourceType: selectedSource },
      });
    }
  }, [selectedSource, shareScreen, space.id, userId]);

  const stopSharing = useCallback(() => {
    stopShareScreen();
    setRetunableMediaSettings({
      spaceId: space.id,
      settings: {
        sourceType: RetunableMediaSource.notTuned,
      },
    });
  }, [space.id, stopShareScreen]);

  const onChangeSourceSelection = useCallback(
    (ev) => {
      setSelectedSource(ev.target.value);
    },
    [setSelectedSource]
  );

  const previousEmbedUrl = useMemo(() => {
    return settings.sourceType === RetunableMediaSource.embed
      ? settings.embedUrl
      : "";
  }, [settings]);

  const embedUrlInputEl = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.tuner}>
      <div className={styles.close} onClick={stopTuning}>
        Close
        <FontAwesomeIcon icon={faCircleXmark} />
      </div>
      <div onChange={onChangeSourceSelection}>
        <label htmlFor="webcam">
          <input
            type="radio"
            name="source"
            value={RetunableMediaSource.webcam}
            id="webcam"
          />
          Broadcast my webcam
        </label>
        <label htmlFor="screenshare">
          <input
            type="radio"
            name="source"
            value={RetunableMediaSource.screenshare}
            id="screenshare"
          />
          Screen share
        </label>
        <div className={styles.divider} />
        <label htmlFor="embed">
          <input
            type="radio"
            name="source"
            value={RetunableMediaSource.embed}
            id="embed"
          />
          Custom embed URL
        </label>
        {selectedSource === RetunableMediaSource.embed && (
          <span className={styles.embedUrlInput}>
            <Input
              type="url"
              name="URL"
              ref={embedUrlInputEl}
              defaultValue={previousEmbedUrl}
              onChange={(ev) => {
                // Propagation must be stopped, otherwise, the radio box change
                // is triggered
                ev.stopPropagation();
              }}
            />
          </span>
        )}
        <label htmlFor="notTuned">
          <input
            type="radio"
            name="source"
            value={RetunableMediaSource.notTuned}
            id="notTuned"
          />
          Nothing
        </label>
      </div>

      <div className={styles.endControls}>
        <Button variant="primary" onClick={onTune}>
          Share content
        </Button>
        <Button
          variant="alternative"
          border="alternative"
          onClick={stopSharing}
        >
          Stop sharing
        </Button>
      </div>
    </div>
  );
};
