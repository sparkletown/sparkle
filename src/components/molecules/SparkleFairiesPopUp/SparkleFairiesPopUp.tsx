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
          <button
            onClick={() => setShowEventSchedule(true)}
            className="btn btn-primary join-button button-event-schedule"
            style={{ fontSize: 14 }}
          >
            Events Schedule
          </button>
          <br />
          <a
            href={PLAYA_INFO_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            Playa Information Booth
          </a>
          <div className="title">Help and support</div>
          <p className="title-sidebar">{`If you're in need of help or support, you can call on our Reality Rangers`}</p>
          <a
            href={REALITY_RANGERS_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            Call the Reality Rangers
          </a>
        </div>
      </InformationCard>
    </InformationLeftColumn>
  );
};

export default SparkleFairiesPopUp;
