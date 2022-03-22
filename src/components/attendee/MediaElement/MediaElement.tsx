import { useCallback, useState } from "react";
import {
  faCompressArrowsAlt,
  faExpandArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { IFRAME_ALLOW } from "settings";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";

import styles from "./MediaElement.module.scss";

interface MediaElementProps {
  url: string;
  autoPlay: boolean;
  // Used in various templates to create a "full width" non-resizable media
  // element
  fullWidth?: boolean;
}

export const MediaElement: React.FC<MediaElementProps> = ({
  url,
  autoPlay,
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

  return (
    <div className={styles.componentMediaObject}>
      <div className={videoClassnames}>
        {embedIframeUrl ? (
          <iframe
            title="main event"
            className={styles.iframe}
            src={embedIframeUrl}
            frameBorder="0"
            allow={IFRAME_ALLOW}
          />
        ) : (
          <div>Embedded Video URL not yet set up</div>
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
