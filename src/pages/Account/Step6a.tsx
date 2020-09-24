import React from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";

const Step6 = () => {
  return (
    <div className="splash-page-container">
      <img
        className="playa-img"
        src={PLAYA_IMAGE}
        alt="Paddock Background Map"
      />
      <div className="step-container step4-container">
        <div className="login-container">
          <h2>HEROIC EXPERIENCE GOES HERE</h2>
        </div>
      </div>
    </div>
  );
};

export default Step6;
