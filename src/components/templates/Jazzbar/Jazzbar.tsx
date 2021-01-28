import React from "react";
import { Venue } from "types/Venue";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import JazzTab from "./JazzTab";

interface PropsType {
  venue?: Venue;
}

const JazzBar: React.FunctionComponent<PropsType> = ({ venue }) => {
  return (
    <JazzBarSkeletonPage>
      <JazzTab venue={venue} setUserList={() => null} />
    </JazzBarSkeletonPage>
  );
};

export default JazzBar;
