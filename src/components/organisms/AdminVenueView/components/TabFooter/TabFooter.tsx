import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useAdminV3NavigateHome } from "hooks/useAdminV3NavigateHome";
import React from "react";

import "./TabFooter.scss";

interface Props {
  containerClassName?: string;
  onHomeClick?: () => void;
  onBackClick: () => void;
  onNextClick: () => void;
}

export const TabFooter: React.FC<Props> = ({
  onHomeClick,
  onBackClick,
  onNextClick,
  containerClassName,
}: Props) => {
  const navigateToAdmin = useAdminV3NavigateHome();

  return (
    <div className={classNames("TabFooter", containerClassName)}>
      <div
        className="TabFooter__home-button"
        onClick={onHomeClick ?? navigateToAdmin}
      >
        <FontAwesomeIcon icon={faHome} />
      </div>
      <div className="TabFooter__nav-buttons">
        <div className="TabFooter__back-button" onClick={onBackClick}>
          Back
        </div>
        <div className="TabFooter__next-button" onClick={onNextClick}>
          Next
        </div>
      </div>
    </div>
  );
};
