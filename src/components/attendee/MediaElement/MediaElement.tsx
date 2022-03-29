import { useCallback, useState } from "react";
import {
  faCompressArrowsAlt,
  faExpandArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { IFRAME_ALLOW } from "settings";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import { VideoTrack } from "../VideoComms/types";
import { VideoTrackDisplay } from "../VideoComms/VideoTrackDisplay";

import styles from "./MediaElement.module.scss";

interface MediaElementProps {
  track?: VideoTrack;
  url?: string;
  autoPlay: boolean;
  // Used in various templates to create a "full width" non-resizable media
  // element
  fullWidth?: boolean;
}

export const MediaElement: React.FC<MediaElementProps> = ({
  url,
  autoPlay,
  track,
  fullWidth = false,
}) => {
  const embedIframeUrl = convertToEmbeddableUrl({
    url,
    autoPlay,
  });
  const [expandedIframe, setExpandedIframe] = useState(false);

  const toggleExpandedIframe = useCallback(() => {
    setExpandedIframe((prevValue) => !prevValue);
  }, [setExpandedIframe]);

  const videoClassnames = classNames(styles.video, {
    [styles.video__expanded]: expandedIframe && !fullWidth,
    [styles.video__fullWidth]: fullWidth,
  });

  const containerClassnames = classNames(styles.componentMediaObject, {
    [styles.componentMediaObject__fullWidth]: fullWidth,
  });

  return (
    <div className={containerClassnames}>
      <div className={videoClassnames}>
        {embedIframeUrl && (
          <iframe
            title="main event"
            className={styles.iframe}
            src={embedIframeUrl}
            frameBorder="0"
            allow={IFRAME_ALLOW}
          />
        )}
        {track && (
          <div className={styles.iframe}>
            <VideoTrackDisplay track={track} />
          </div>
        )}
      </div>
      {!fullWidth && (
        <div className={styles.mediaControls}>
          <FontAwesomeIcon
            icon={expandedIframe ? faCompressArrowsAlt : faExpandArrowsAlt}
            onClick={toggleExpandedIframe}
          />
        </div>
      )}
    </div>
  );
};
