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
      <InformationCard title="About the venue" className="col information-card">
        Jazztastic Park is the Partypelago's most storied jazz venue. All
        flavours of this classic improvisational medium can be heard in the
        jungle-laden hills of this Northwesterly outcrop.
      </InformationCard>
      <InformationCard
        title="About tonight's show"
        className="col information-card"
      >
        <p>Performing tonight at Jazztastic Park:</p>
        <ul>
          <li>
            Kansas Smitty's:
            <ul>
              <li>Giacomo Smith - alto/clarinet</li>
              <li>Alec harper - Tenor</li>
              <li>Dave Archer - Guitar</li>
              <li>Joe Webb - Piano</li>
              <li>Ferg Ireland - Double Bass</li>
              <li>Will Cleasby - Drums</li>
            </ul>
          </li>
          <li>Sam Leak</li>
        </ul>
      </InformationCard>
    </div>
  </div>
);

export default EntranceExperience;
