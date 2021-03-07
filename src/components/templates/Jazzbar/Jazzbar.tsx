import React from "react";
import { AnyVenue } from "types/venues";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import JazzTab from "./JazzTab";

interface PropsType {
  venue?: AnyVenue;
}

// @debt This whole venue component looks ugly. There are a lot of places to improve it, but
// you can see it yourself, when you start understanding the way it works
export const Jazzbar: React.FunctionComponent<PropsType> = ({ venue }) => {
  return (
    <JazzBarSkeletonPage>
      <JazzTab venue={venue} setUserList={() => null} />
    </JazzBarSkeletonPage>
  );
};
