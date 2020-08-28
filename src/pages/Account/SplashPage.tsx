import React from "react";
import { useHistory } from "react-router-dom";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { venueInsideUrl } from "utils/url";
import { useUser } from "hooks/useUser";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const SplashPage = () => {
  const history = useHistory();
  const { user } = useUser();

  const onSubmit = () => {
    history.push(user ? venueInsideUrl("playa") : "/enter/step1");
  };

  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="welcome-to-the-burn">WELCOME TO THE ONLINE BURN</div>
      <div className="step-container step0-container">
        Join us to build Virtual Black Rock City, Sparkleverse is a giant
        interactive map that puts ur creattivity on the virtual playa in
        minutes. We share our knowledge of hosting online experiences in
        SparkleVersity.
        <button
          className="btn btn-primary btn-block btn-centered enter-button"
          onClick={() => onSubmit()}
        >
          Enter the burn
        </button>
      </div>
    </div>
  );
};

export default SplashPage;
