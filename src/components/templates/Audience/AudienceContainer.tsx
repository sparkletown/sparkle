import React from "react";
import { ExperienceContextWrapper } from "components/context/ExperienceContext";
import { Audience } from "./Audience";

type PropsType = {
  venueName: string;
};

const AudienceContainer: React.FunctionComponent<PropsType> = ({
  venueName,
}) => {
  return (
    <ExperienceContextWrapper venueName={venueName}>
      <Audience />
    </ExperienceContextWrapper>
  );
};

export default AudienceContainer;
