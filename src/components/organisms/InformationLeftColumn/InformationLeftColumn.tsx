import React from "react";
import "./InformationLeftColumn.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faAngleDoubleRight,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

interface PropsType {
  venueLogoPath: string;
  children: React.ReactNode;
  isLeftColumnExpanded: boolean;
  setIsLeftColumnExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const InformationLeftColumn: React.FunctionComponent<PropsType> = ({
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
            : "expanded"
        }`}
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
        ) : venueLogoPath === "heart" && isLeftColumnExpanded ? (
          <img
            src="/imageDonate1.png"
            alt="experience-logo"
            className={`expanded`}
          />
        ) : venueLogoPath === "heart" && !isLeftColumnExpanded ? (
          <FontAwesomeIcon icon={faHeart} size="2x" className={`band-logo`} />
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
