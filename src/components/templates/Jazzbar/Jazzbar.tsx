import React from "react";

import { JazzbarVenue } from "types/venues";

import { WithId } from "utils/id";

import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import JazzTab from "./JazzTab";

export interface JazzbarProps {
  venue: WithId<JazzbarVenue>;
}

// @debt This whole venue component looks ugly. There are a lot of places to improve it, but
//   you can see it yourself, when you start understanding the way it works
export const Jazzbar: React.FC<JazzbarProps> = ({ venue }) => {
  return (
    <JazzBarSkeletonPage>
      <JazzTab venue={venue} setUserList={() => null} />
    </JazzBarSkeletonPage>
  );
};
