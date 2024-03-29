import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "components/attendee/Button";

import styles from "./TuneBanner.module.scss";

interface TuneBannerProps {
  isTuning: boolean;
  startTuning: () => void;
}

export const TuneBanner: React.FC<TuneBannerProps> = ({
  isTuning,
  startTuning,
}) => {
  return (
    <div className={styles.tuneBanner}>
      <span className={styles.multimediaBanner}>
        <FontAwesomeIcon icon={faSatelliteDish} />
        Multimedia
      </span>
      <span className={styles.tuneHint}>Share content with the space</span>
      <Button variant="primary" onClick={startTuning} disabled={isTuning}>
        Tune
      </Button>
    </div>
  );
};
