import React, { useCallback } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { TabNavigationProps } from "components/organisms/AdminVenueView/AdminVenueView";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./TabFooter.scss";

export interface TabFooterProps extends TabNavigationProps {
  handleVenueUpdate?: () => void;
}

export const TabFooter: React.FC<TabFooterProps> = ({
  onClickHome,
  onClickBack,
  onClickNext,
  handleVenueUpdate,
}) => {
  const handleClickNext = useCallback(() => {
    onClickNext();
    handleVenueUpdate?.();
  }, [onClickNext, handleVenueUpdate]);

  return (
    <div className="TabFooter TabFooter__footer">
      <div className="TabFooter__nav-buttons">
        <ButtonNG
          className="TabFooter__nav-button"
          onClick={onClickHome}
          iconName={faHome}
          iconOnly={true}
          title="Home"
        />
        <ButtonNG className="TabFooter__nav-button" onClick={onClickBack}>
          Back
        </ButtonNG>
        <ButtonNG
          className="TabFooter__nav-button"
          onClick={handleClickNext}
          variant="primary"
        >
          Next
        </ButtonNG>
      </div>
    </div>
  );
};
