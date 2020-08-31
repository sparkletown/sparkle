import React from "react";
import "firebase/storage";
import "./Account.scss";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { PLAYA_IMAGE } from "settings";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const Step1 = () => {
  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <AuthenticationModal show={true} onHide={() => {}} showAuth="register" />
    </div>
  );
};

export default Step1;
