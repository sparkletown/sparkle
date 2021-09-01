import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";

import { ButtonNG } from "components/atoms/ButtonNG";

import TV_IMAGE from "assets/images/old-tv-404.png";
import SPARKLEVERSE_LANDSCAPE from "assets/images/sparkleverse-landscape.png";

import "./NotFound.scss";

export interface NotFoundProps {
  fullScreen?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({ fullScreen }) => {
  const history = useHistory();
  const navigateBack = useCallback(() => history.goBack(), [history]);
  const componentClasses = classNames({
    NotFound: true,
    "NotFound--full-screen": fullScreen,
  });

  return (
    <div className={componentClasses}>
      <div className="NotFound__message-container">
        <img
          className="NotFound__logo"
          alt="Sparkle logo"
          src={SPARKLEVERSE_LANDSCAPE}
        />
        <img
          className="NotFound__tv"
          alt="shape indicating denied access"
          src={TV_IMAGE}
        />
        <p className="NotFound__move-along-text">Nothing to see here.</p>
        <ButtonNG
          className="NotFound__button"
          variant="primary"
          onClick={navigateBack}
        >
          Go Back
        </ButtonNG>
      </div>
    </div>
  );
};
