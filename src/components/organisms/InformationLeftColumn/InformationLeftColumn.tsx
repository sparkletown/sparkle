import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import classNames from "classnames";

import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faAngleDoubleRight,
  faHeart,
  faEdit,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./InformationLeftColumn.scss";

export type ValidLogoIconName = "ambulance" | "create" | "heart" | "info";

const logoMap = new Map<ValidLogoIconName, IconDefinition>([
  ["ambulance", faAmbulance],
  ["create", faEdit],
  ["heart", faHeart],
  ["info", faInfoCircle],
]);

interface InformationLeftColumnProps {
  iconNameOrPath?: ValidLogoIconName | string;
  children: React.ReactNode;
}

export interface InformationLeftColumnControls {
  isExpanded: boolean;
  setExpanded: (isExpanded: boolean) => void;
  toggleExpanded: (e?: React.MouseEvent<HTMLElement>) => void;
}

export const InformationLeftColumn = forwardRef<
  InformationLeftColumnControls,
  InformationLeftColumnProps
>(({ iconNameOrPath = "info", children }, controlsRef) => {
  const [isExpanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback((e?: React.MouseEvent<HTMLElement>) => {
    e && e.stopPropagation();

    setExpanded((prev) => !prev);
  }, []);

  // Expose internal state/controls to parent components via ref
  useImperativeHandle(controlsRef, () => ({
    isExpanded,
    setExpanded,
    toggleExpanded,
  }));

  const leftColumnClasses = classNames("left-column", {
    "left-column--expanded": isExpanded,
  });

  const chevronIconClasses = classNames("chevron-icon", {
    "chevron-icon--turned": isExpanded,
  });

  const venueLogoClasses = classNames("left-column__logo", {
    "left-column__logo--expanded": isExpanded,
  });

  const iconPath = logoMap.get(iconNameOrPath as ValidLogoIconName);

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
            src={iconNameOrPath}
            alt="experience-logo"
          />
        )}

        {isExpanded && <>{children}</>}
      </div>
    </div>
  );
});
