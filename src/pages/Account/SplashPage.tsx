import React from "react";
import { useHistory } from "react-router-dom";

import { PLAYA_IMAGE, PLAYA_VENUE_ID, PLAYA_VENUE_NAME } from "settings";

import { venueInsideUrl } from "utils/url";

import { useUser } from "hooks/useUser";

import "firebase/storage";

import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

export const SplashPage = () => {
  const history = useHistory();
  const { user } = useUser();

  const onSubmit = () => {
    history.push(user ? venueInsideUrl(PLAYA_VENUE_ID) : "/enter/step1");
  };

  return (
    <>
      <div className="splash-page-container">
        <img
          className="playa-img"
          src={PLAYA_IMAGE}
          alt={`${PLAYA_VENUE_NAME} Background Map`}
        />
        <div className="welcome-to-the-burn">WELCOME TO THE ONLINE BURN</div>
        <div className="step-container step0-container">
          Join us to build Virtual Burning Seed. Sparkleverse is a giant
          interactive map that puts your creativity on the virtual{" "}
          {PLAYA_VENUE_NAME} in minutes. We share our knowledge of hosting
          online experiences in SparkleVersity.
          <button
            className="btn btn-primary btn-block btn-centered enter-button"
            onClick={() => onSubmit()}
          >
            Enter the burn
          </button>
        </div>
      </div>
    </>
  );
};
