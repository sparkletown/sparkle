import React from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE, PLAYA_VENUE_NAME } from "settings";
import { Profile } from "./Profile";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const Step2 = () => {
  return (
    <div className="splash-page-container">
      <img
        className="playa-img"
        src={PLAYA_IMAGE}
        alt={`${PLAYA_VENUE_NAME} Background Map`}
      />
      <Profile />
    </div>
  );
};

export default Step2;
