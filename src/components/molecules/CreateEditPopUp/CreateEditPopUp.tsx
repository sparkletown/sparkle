import React, { useState } from "react";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "../InformationCard";
import {
  CREATE_EDIT_URL,
  SPARKLEVERSITY_URL,
  SPARKLEVERSE_COMMUNITY_URL,
  PLAYA_VENUE_NAME,
} from "../../../settings";

const CreateEditPopUp: React.FunctionComponent = () => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <InformationLeftColumn
      venueLogoPath={"create"}
      isLeftColumnExpanded={isLeftColumnExpanded}
      setIsLeftColumnExpanded={setIsLeftColumnExpanded}
    >
      <InformationCard title={`Create &amp; Edit on the ${PLAYA_VENUE_NAME}`}>
        <div style={{ textAlign: "center" }}>
          <p className="title-sidebar">
            Welcome to the online burn. You can still build in the SparkleVerse!
          </p>
          <a
            href={CREATE_EDIT_URL}
            rel="noopener noreferrer"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            Create &amp; Edit
          </a>
          <div className="title">Help With Creating And Hosting</div>
          <p className="title-sidebar">
            Want more help creating in SparklVerse? We have resources to help
            you get started and host amazing experiences. We call it the
            SparkleVersity.
          </p>
          <a
            href={SPARKLEVERSITY_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            Check Out SparkleVersity
          </a>
          <div className="title">Join the Community</div>
          <p className="title-sidebar">
            Our facebook group is the place to connect to fellow burners,
            discover and learn.
          </p>
          <a
            href={SPARKLEVERSE_COMMUNITY_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            SparkleVerse Community
          </a>
        </div>
      </InformationCard>
    </InformationLeftColumn>
  );
};

export default CreateEditPopUp;
