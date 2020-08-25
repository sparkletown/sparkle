import React from "react";
import { useHistory } from "react-router-dom";
import "firebase/storage";
import "./Account.scss";
//import { RouterLocation } from "types/RouterLocation";
import { PLAYA_IMAGE } from "settings";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const SplashPage = () => {
  const history = useHistory();

  const onSubmit = () => {
    history.push(`/enter/step1`);
  };

  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="welcome-to-the-burn">Welcome to the online burn</div>
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
