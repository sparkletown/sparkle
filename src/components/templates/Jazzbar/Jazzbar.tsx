import React from "react";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";

import JazzTab from "./JazzTab";

const JazzBar = () => {
  return (
    <JazzBarSkeletonPage>
      <JazzTab setUserList={() => null} />
    </JazzBarSkeletonPage>
  );
};

export default JazzBar;
