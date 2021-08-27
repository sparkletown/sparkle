import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { ButtonNG } from "components/atoms/ButtonNG";
import { SparkleLogo } from "components/atoms/SparkleLogo";

import TV_IMAGE from "assets/images/old-tv.png";

import "./NotFound.scss";

export const NotFound: React.FC = ({ children }) => {
  const history = useHistory();
  const navigateBack = useCallback(() => history.goBack(), [history]);

  return (
    <div className="NotFound">
      <div className="NotFound__message-container">
        <SparkleLogo className="NotFound__logo" />
        <img
          className="NotFound__tv"
          alt="shape indicating denied access"
          src={TV_IMAGE}
        />
        <p className="NotFound__title">Nothing to see here.</p>
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
