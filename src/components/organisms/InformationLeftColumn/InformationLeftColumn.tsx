import React, { useState } from "react";
import "./InformationLeftColumn.scss";

interface PropsType {
  experienceLogoPath: string;
  children: React.ReactNode;
}

const InformationLeftColumn: React.FunctionComponent<PropsType> = ({
  experienceLogoPath,
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
          src={experienceLogoPath}
          alt="experience-logo"
          className={`band-logo ${isLeftColumnExpanded ? "expanded" : ""}`}
        />
        {isLeftColumnExpanded && <>{children}</>}
      </div>
    </div>
  );
};

export default InformationLeftColumn;
