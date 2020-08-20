import React, { useState } from "react";
import "./SparkleFairiesPopUp.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmbulance } from "@fortawesome/free-solid-svg-icons";

interface PropsType {
  children: React.ReactNode;
}

const SparkleFairiesPopUp: React.FunctionComponent<PropsType> = ({
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
        <div className="icon-container">
          <div className="chevron-icon">
            <FontAwesomeIcon icon={faAmbulance} size="2x" color="black" />
          </div>
        </div>
        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default SparkleFairiesPopUp;
