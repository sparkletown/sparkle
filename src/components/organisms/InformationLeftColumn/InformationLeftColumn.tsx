import React, { useCallback, useState } from "react";
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
  isExpanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

type LogoMapTypes = "ambulance" | "heart" | "create";

const logoMap = new Map([
  ["ambulance", faAmbulance],
  ["heart", faHeart],
  ["create", faEdit],
]);

const InformationLeftColumn: React.FC<InformationLeftColumnProps> = ({
  venueLogoPath,
  isExpanded: _isExpanded,
  setExpanded: _setExpanded,
  children,
}) => {
  const [_isExpandedInternal, _setExpandedInternal] = useState(false);

  const isExpanded = _isExpanded ?? _isExpandedInternal;

  const toggleExpanded = useCallback(() => {
    const setExpanded = _setExpanded ?? _setExpandedInternal;

    setExpanded((prev) => !prev);
  }, [_setExpanded]);

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
};

export default InformationLeftColumn;
