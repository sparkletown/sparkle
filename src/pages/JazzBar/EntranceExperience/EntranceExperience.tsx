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
        Kansas Smitty’s is East London’s most dynamic jazz venue. Located on
        Broadway Market, it opens six nights a week for live jazz in an intimate
        basement environment. Their seven-piece house band share the name. The
        signature cocktail in this cult bar, the julep, is a bourbon-based
        cocktail served in an ice-filled tin, and recalls the jazzy bars of
        1920s Kansas where the likes of Mary Lou Williams gave us new ways of
        hearing
      </InformationCard>
      <InformationCard
        title="About tonight's show"
        className="col information-card"
      >
        Tonight, the Kansas Smitty’s House Band are playing from their new
        album, Things Happened Here. Drawing influence from over one hundred
        years of jazz history, from Django Reinhardt to Ahmad Jamal, and the
        vivid musical landscapes of Debussy and even Brian Eno, Kansas Smitty’s
        new album combines journeying into the jazz sublime with every flavour
        of cinematic texture.
      </InformationCard>
    </div>
  </div>
);

export default EntranceExperience;
