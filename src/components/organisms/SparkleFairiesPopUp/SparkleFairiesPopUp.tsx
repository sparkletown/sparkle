import React, { useState } from "react";
import "./SparkleFairiesPopUp.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmbulance } from "@fortawesome/free-solid-svg-icons";

const SparkleFairiesPopUp: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <div className="information-left-column-container">
      <div
        className={`left-column ${isLeftColumnExpanded ? "expanded" : ""}`}
        onClick={() => setIsLeftColumnExpanded((prevState) => !prevState)}
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
