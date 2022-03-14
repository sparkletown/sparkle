import React from "react";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import { JazzBar } from "./JazzBar";
import { JazzBarSkeletonPage } from "./JazzBarSkeletonPage";

export interface JazzbarProps {
  venue: WithId<JazzbarVenue>;
}

// @debt This whole venue component looks ugly. There are a lot of places to improve it, but
//   you can see it yourself, when you start understanding the way it works
export const JazzBarPage: React.FC<JazzbarProps> = ({ venue }) => {
  return (
    <JazzBarSkeletonPage venue={venue}>
      <JazzBar space={venue} />
    </JazzBarSkeletonPage>
  );
};
