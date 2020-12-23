import React from "react";
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
  venueLogoPath: string;
  children: React.ReactNode;
  isLeftColumnExpanded: boolean;
  setIsLeftColumnExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const InformationLeftColumn: React.FC<InformationLeftColumnProps> = ({
  venueLogoPath,
  children,
  isLeftColumnExpanded,
  setIsLeftColumnExpanded,
}) => {
  const leftColumnClasses = classNames("left-column", {
    "expanded-donation": isLeftColumnExpanded && venueLogoPath === "heart",
    "expanded-popup": isLeftColumnExpanded,
  });

  const venueLogoClasses = classNames("band-logo", {
    "expanded-popup": isLeftColumnExpanded,
  });

  return (
    <div className="information-left-column-container">
      <div
        className={leftColumnClasses}
        onClick={() => setIsLeftColumnExpanded(!isLeftColumnExpanded)}
      >
        <div className="chevron-icon-container">
          <div
            className={`chevron-icon ${isLeftColumnExpanded ? "turned" : ""}`}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} size="lg" />
          </div>
        </div>
        {venueLogoPath === "ambulance" ? (
          <FontAwesomeIcon
            icon={faAmbulance}
            size="2x"
            className={venueLogoClasses}
          />
        ) : venueLogoPath === "heart" ? (
          <FontAwesomeIcon
            icon={faHeart}
            size="2x"
            className={venueLogoClasses}
          />
        ) : venueLogoPath === "create" ? (
          <FontAwesomeIcon
            icon={faEdit}
            size="2x"
            className={venueLogoClasses}
          />
        ) : (
          <img
            src={venueLogoPath}
            alt="experience-logo"
            className={venueLogoClasses}
          />
        )}

        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default InformationLeftColumn;
