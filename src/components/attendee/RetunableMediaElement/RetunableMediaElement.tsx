import React, { useCallback, useMemo, useState } from "react";

import { SpaceWithId } from "types/id";

import { MediaElement } from "../MediaElement";
import { useVideoComms } from "../VideoComms/hooks";
import { VideoSource } from "../VideoComms/types";

import { TuneBanner } from "./components/TuneBanner";
import { Tuner } from "./components/Tuner";
import { useRetunableMediaElement } from "./hooks";
import { RetunableMediaSource } from "./RetunableMediaElement.types";

import styles from "./RetunableMediaElement.module.scss";

interface RetunableMediaElementProps {
  space: SpaceWithId;
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

  // @debt Ideally this would be done using a map of type -> render method
  // rather than a switch statement. However, I couldn't immediately see a way
  // to do that which works nicely with the type inference that occurs below
  // with the type of the settings variable.
  const mediaElement = useMemo(() => {
    switch (settings.sourceType) {
      case RetunableMediaSource.embed:
        return <MediaElement url={settings.embedUrl} autoPlay={true} />;
      case RetunableMediaSource.channel:
        return <MediaElement url={settings.channelUrl} autoPlay={true} />;
      case RetunableMediaSource.notTuned:
        return <></>;
      case RetunableMediaSource.screenshare:
      case RetunableMediaSource.webcam:
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
          // The participant hasn't been found. Likely cause is that they have
          // left after sharing their screen - which is valid behaviour. Render
          // nothing.
          return <></>;
        }

        const videoTrack = participant.videoTracks.find(
          ({ sourceType }) => sourceType === desiredSourceType
        );

        if (!videoTrack) {
          // Similar to the above, the user that shared their screen has probably
          // left the call.
          return <></>;
        }

        return <MediaElement track={videoTrack} autoPlay />;
    }
  }, [localParticipant, remoteParticipants, settings]);

  if (isLoading) {
    // Deliberately display nothing, this will load quickly as the fetch is a
    // single quick one.
    // @debt We should think about a loading spinner that only displays on slow
    // loads
    return <></>;
  }

  return (
    <div
      data-bem="RetunableMediaElement"
      data-block="RetunableMediaElement"
      data-side="att"
      className={styles.container}
    >
      {mediaElement}
      {isTuning && <Tuner space={space} stopTuning={stopTuning} />}
      <TuneBanner isTuning={isTuning} startTuning={startTuning} />
    </div>
  );
};
