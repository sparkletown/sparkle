import React, { useState } from "react";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import JazzTab from "./JazzTab";
import { User } from "types/User";

const JazzBar = () => {
  useProfileInformationCheck();

  const [userList, setUserList] = useState<User[]>([]);

  return (
    <JazzBarSkeletonPage>
      <JazzTab setUserList={setUserList} />
    </JazzBarSkeletonPage>
  );
};

export default JazzBar;
