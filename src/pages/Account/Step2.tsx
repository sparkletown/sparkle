import React from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import Profile from "./Profile";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const Step2 = () => {
  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <Profile />
    </div>
  );
};

export default Step2;
