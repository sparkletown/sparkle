import React, { useCallback } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faAngleDoubleRight,
  faHeart,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

import "./InformationLeftColumn.scss";

interface InformationLeftColumnProps {
  venueLogoPath: LogoMapTypes | string;
  children: React.ReactNode;
  isLeftColumnExpanded: boolean;
  setIsLeftColumnExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

type LogoMapTypes = "ambulance" | "heart" | "create";

const logoMap = new Map([
  ["ambulance", faAmbulance],
  ["heart", faHeart],
  ["create", faEdit],
]);

const InformationLeftColumn: React.FC<InformationLeftColumnProps> = ({
  venueLogoPath,
  children,
  isLeftColumnExpanded,
  setIsLeftColumnExpanded,
}) => {
  const toggleColumnExpanded = useCallback(
    () => setIsLeftColumnExpanded(!isLeftColumnExpanded),
    [isLeftColumnExpanded, setIsLeftColumnExpanded]
  );

  const leftColumnClasses = classNames("left-column", {
    "expanded-donation": isLeftColumnExpanded && venueLogoPath === "heart",
    "expanded-popup": isLeftColumnExpanded,
  });

  const chevronIconClasses = classNames("chevron-icon", {
    turned: isLeftColumnExpanded,
  });

  const venueLogoClasses = classNames("band-logo", {
    "expanded-popup": isLeftColumnExpanded,
  });

  const iconPath = logoMap.get(venueLogoPath);

  return (
    <div className="information-left-column-container">
      <div className={leftColumnClasses} onClick={toggleColumnExpanded}>
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

        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default InformationLeftColumn;
