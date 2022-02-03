import React from "react";

import { ExperimentalVenue } from "types/venues";

import "./ExperimentalSpace.scss";

export interface ExperimentalSpaceProps {
  venue: ExperimentalVenue;
}

export const ExperimentalSpace: React.FC<ExperimentalSpaceProps> = ({
  venue,
}) => {
  return <p>I am an experiment</p>;
};
