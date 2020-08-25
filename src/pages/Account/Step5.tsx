import React from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { useHistory } from "react-router-dom";

const Step5 = () => {
  const history = useHistory();
  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="step-container step4-container">
        <div className="login-container">
          <h2>Finally, enter the burn</h2>
          <p>Pick how you wanna get in</p>
          <div
            className="step-4-buttons"
            onClick={() => history.push(`/enter/step6b`)}
          >
            <h3>Normal Mode</h3>
            <div>
              Enter the playa straight waya and start exploring the venues.
            </div>
          </div>
          <div
            className="step-4-buttons"
            //onClick={() => history.push(`/enter/step6a`)}
          >
            <h3>Heroic Mode</h3>
            <div>
              Enter an art car with other users and make some friends before
              entering the playa.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;
