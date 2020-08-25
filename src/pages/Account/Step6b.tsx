import React from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { useHistory } from "react-router-dom";

const Step6 = () => {
  const history = useHistory();
  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="step-container step6b-container">
        <div>
          <h2>Welcome to the playa!</h2>
          <div className="step6b-welcome-message">
            A nice welcome message, A nice welcome message, A nice welcome
            message
          </div>
          <button
            className={`btn btn-primary btn-block btn-centered`}
            onClick={() => history.push(`/in/playa`)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6;
