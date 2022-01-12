import React from "react";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useShowHide } from "hooks/useShowHide";

import "./MobileWarning.scss";

export const MobileWarning: React.FC = () => {
  const { isShown: isWarningShown, hide: hideWarning } = useShowHide(true);

  if (!isWarningShown) return null;

  return (
    <div className="MobileWarning">
      <FontAwesomeIcon
        className="MobileWarning__icon"
        icon={faExclamationCircle}
      />
      <div className="MobileWarning__message">
        Please enter this experience on a larger screen. We are best experienced
        using your Chrome browser on a desktop device. See you there!
      </div>

      <FontAwesomeIcon icon={faTimesCircle} onClick={hideWarning} />
    </div>
  );
};
