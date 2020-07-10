import React from "react";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import JazzTab from "./JazzTab";

const JazzBar = () => {
  useProfileInformationCheck();

  return (
    <JazzBarSkeletonPage>
      <JazzTab setUserList={() => null} />
    </JazzBarSkeletonPage>
  );
};

export default JazzBar;
