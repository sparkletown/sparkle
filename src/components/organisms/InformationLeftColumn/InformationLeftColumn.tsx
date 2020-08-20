import React, { useState } from "react";
import "./InformationLeftColumn.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

interface PropsType {
  venueLogoPath: string;
  children: React.ReactNode;
}

const InformationLeftColumn: React.FunctionComponent<PropsType> = ({
  venueLogoPath,
  children,
}) => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <div className="information-left-column-container">
      <div
        className={`left-column ${isLeftColumnExpanded ? "expanded" : ""}`}
        onClick={() => setIsLeftColumnExpanded(!isLeftColumnExpanded)}
        id="expand-venue-information"
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
            className={`band-logo ${isLeftColumnExpanded ? "expanded" : ""}`}
          />
        ) : (
          <img
            src={venueLogoPath}
            alt="experience-logo"
            className={`band-logo ${isLeftColumnExpanded ? "expanded" : ""}`}
          />
        )}
        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default InformationLeftColumn;
