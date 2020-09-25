import React, { useState } from "react";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "../InformationCard";
import "./SparkleFairiesPopUp.scss";
import { PLAYA_INFO_URL, REALITY_RANGERS_URL } from "../../../../src/settings";

interface PropsType {
  setShowEventSchedule: Function;
}

const SparkleFairiesPopUp: React.FunctionComponent<PropsType> = ({
  setShowEventSchedule,
}) => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <InformationLeftColumn
      venueLogoPath={"ambulance"}
      isLeftColumnExpanded={isLeftColumnExpanded}
      setIsLeftColumnExpanded={setIsLeftColumnExpanded}
    >
      <InformationCard title="Information">
        <div style={{ textAlign: "center" }}>
          <p className="title-sidebar">{`If you're looking for information, please check out these resources:`}</p>
          <a
            href={PLAYA_INFO_URL}
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            Paddock Info Booth
          </a>
          <div className="title">Call a Ranger</div>
          <p className="title-sidebar">It's OK to need help!</p>
          <p className="title-sidebar">
            Rangers and harm reduction volunteers are available 24/7 to provide
            support &amp; assistance, if you need it.
          </p>
          <a
            href={REALITY_RANGERS_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            Red Earth Ranger Chat
          </a>
        </div>
      </InformationCard>
    </InformationLeftColumn>
  );
};

export default SparkleFairiesPopUp;
