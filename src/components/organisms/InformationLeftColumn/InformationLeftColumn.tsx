import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faAngleDoubleRight,
  faHeart,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

import "./InformationLeftColumn.scss";

// TODO: only allow isColumnExanded and setColumnExpanded to be provided together, or not at all; not one or the other
interface InformationLeftColumnProps {
  venueLogoPath: LogoMapTypes | string;
  children: React.ReactNode;
}

export interface InformationLeftColumnControls {
  isExpanded: boolean;
  setExpanded: (isExpanded: boolean) => void;
  toggleExpanded: () => void;
}

type LogoMapTypes = "ambulance" | "heart" | "create";

const logoMap = new Map([
  ["ambulance", faAmbulance],
  ["heart", faHeart],
  ["create", faEdit],
]);

export const InformationLeftColumn = forwardRef<
  InformationLeftColumnControls,
  InformationLeftColumnProps
>(({ venueLogoPath, children }, controlsRef) => {
  const [isExpanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Expose internal state/controls to parent components via ref
  useImperativeHandle(controlsRef, () => ({
    isExpanded,
    setExpanded,
    toggleExpanded,
  }));

  const leftColumnClasses = classNames("left-column", {
    "expanded-donation": isExpanded && venueLogoPath === "heart",
    "expanded-popup": isExpanded,
  });

  const chevronIconClasses = classNames("chevron-icon", {
    turned: isExpanded,
  });

  const venueLogoClasses = classNames("band-logo", {
    "expanded-popup": isExpanded,
  });

  const iconPath = logoMap.get(venueLogoPath);

  return (
    <div className="information-left-column-container">
      <div className={leftColumnClasses} onClick={toggleExpanded}>
        <div className="chevron-icon-container">
          <div className={chevronIconClasses}>
            <FontAwesomeIcon icon={faAngleDoubleRight} size="lg" />
          </div>
        </div>

        {iconPath !== undefined ? (
          <FontAwesomeIcon
            className={venueLogoClasses}
            icon={iconPath}
            size="2x"
          />
        ) : (
          <img
            className={venueLogoClasses}
            src={venueLogoPath}
            alt="experience-logo"
          />
        )}

        {isExpanded && <>{children}</>}
      </div>
    </div>
  );
});

export default InformationLeftColumn;
