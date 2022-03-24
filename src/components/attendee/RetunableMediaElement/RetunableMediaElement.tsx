import { useCallback, useMemo, useState } from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { MediaElement } from "../MediaElement";
import { useVideoComms } from "../VideoComms/hooks";
import { VideoSource } from "../VideoComms/types";

import { TuneBanner } from "./components/TuneBanner";
import { Tuner } from "./components/Tuner";
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
  const { localParticipant, remoteParticipants } = useVideoComms();

  const mediaElement = useMemo(() => {
    if (settings.sourceType === RetunableMediaSource.embed) {
      return <MediaElement url={settings.embedUrl} autoPlay={true} />;
    } else if (settings.sourceType === RetunableMediaSource.notTuned) {
      return <></>;
    }
    if (
      settings.sourceType === RetunableMediaSource.screenshare ||
      settings.sourceType === RetunableMediaSource.webcam
    ) {
      const allParticipants = [...remoteParticipants];
      if (localParticipant) {
        allParticipants.push(localParticipant);
      }

      const desiredSourceType =
        settings.sourceType === RetunableMediaSource.screenshare
          ? VideoSource.Screenshare
          : VideoSource.Webcam;
      const desiredUserId =
        settings.sourceType === RetunableMediaSource.screenshare
          ? settings.screenshareUserId
          : settings.webcamUserId;

      const participant = allParticipants.find(
        (p) => p.sparkleId === desiredUserId
      );
      if (!participant) {
        // TODO probably want to warn here
        return <></>;
      }

      const videoTrack = participant.videoTracks.find(
        ({ sourceType }) => sourceType === desiredSourceType
      );

      if (!videoTrack) {
        // TODO probably want to warn here
        return <></>;
      }

      return <MediaElement track={videoTrack} autoPlay />;
    }
    // TODO probably want to warn here
    return <></>;
  }, [localParticipant, remoteParticipants, settings]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      {mediaElement}
      {isTuning && <Tuner space={space} stopTuning={stopTuning} />}
      <TuneBanner isTuning={isTuning} startTuning={startTuning} />
    </div>
  );
};
