import React from "react";

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
  return (
    <div className="information-left-column-container">
      <div
        className={`left-column ${
          !isLeftColumnExpanded
            ? ""
            : venueLogoPath === "heart"
            ? "expanded-donation"
            : "expanded-popup"
        }`}
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
            className={`band-logo ${
              isLeftColumnExpanded ? "expanded-popup" : ""
            }`}
          />
        ) : venueLogoPath === "heart" ? (
          <FontAwesomeIcon
            icon={faHeart}
            size="2x"
            className={`band-logo ${
              isLeftColumnExpanded ? "expanded-popup" : ""
            }`}
          />
        ) : venueLogoPath === "create" ? (
          <FontAwesomeIcon
            icon={faEdit}
            size="2x"
            className={`band-logo ${
              isLeftColumnExpanded ? "expanded-popup" : ""
            }`}
          />
        ) : (
          <img
            src={venueLogoPath}
            alt="experience-logo"
            className={`band-logo ${
              isLeftColumnExpanded ? "expanded-popup" : ""
            }`}
          />
        )}

        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default InformationLeftColumn;
