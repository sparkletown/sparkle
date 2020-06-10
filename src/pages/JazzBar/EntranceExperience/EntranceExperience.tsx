import React from "react";
import SecretPasswordForm from "components/molecules/SecretPasswordForm";
import "./EntranceExperience.scss";
import InformationCard from "components/molecules/InformationCard";

const EntranceExperience = () => (
  <div className="jazz-bar-entrance-experience-container">
    <img
      src="/kansas-smittys-logo-red.png"
      alt="Kansas Smitty's"
      className="band-logo"
    />
    <SecretPasswordForm />
    <div className="party-information">
      <div className="row">
        <InformationCard
          title="About the venue"
          className="col information-card"
        >
          East London's renowned jazz bar
          <br />
          We do
        </InformationCard>
        <InformationCard
          title="About tonight's show"
          className="col information-card"
        >
          Hello
        </InformationCard>
      </div>
    </div>
  </div>
);

export default EntranceExperience;
