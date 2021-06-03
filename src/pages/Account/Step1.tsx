import React from "react";
import "firebase/storage";

import { PLAYA_IMAGE, PLAYA_VENUE_NAME } from "settings";

import {
  AuthenticationModal,
  AuthOptions,
} from "components/organisms/AuthenticationModal";

import "./Account.scss";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const Step1 = () => {
  return (
    <div className="splash-page-container">
      <img
        className="playa-img"
        src={PLAYA_IMAGE}
        alt={`${PLAYA_VENUE_NAME} Background Map`}
      />
      <AuthenticationModal
        show={true}
        onHide={() => {}}
        showAuth={AuthOptions.register}
      />
    </div>
  );
};

export default Step1;
