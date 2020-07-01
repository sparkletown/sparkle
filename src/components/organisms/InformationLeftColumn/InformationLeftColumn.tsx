import React, { useState } from "react";
import "./InformationLeftColumn.scss";

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
      >
        <img
          src={venueLogoPath}
          alt="experience-logo"
          className={`band-logo ${isLeftColumnExpanded ? "expanded" : ""}`}
        />
        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default InformationLeftColumn;
