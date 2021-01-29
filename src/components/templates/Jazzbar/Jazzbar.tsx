import React from "react";
import { Venue } from "types/venues";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import JazzTab from "./JazzTab";

interface PropsType {
  venue?: Venue;
}

export const Jazzbar: React.FunctionComponent<PropsType> = ({ venue }) => {
  return (
    <JazzBarSkeletonPage>
      <JazzTab venue={venue} setUserList={() => null} />
    </JazzBarSkeletonPage>
  );
};
