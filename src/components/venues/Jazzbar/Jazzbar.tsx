import React, { useState } from "react";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Jazz from "./JazzTab";
import Cocktail from "./CocktailTab";
import { User } from "types/User";

const JazzBar = () => {
  const [selectedTab, setSelectedTab] = useState("jazz");
  useProfileInformationCheck();

  const [userList, setUserList] = useState<User[]>([]);

  return (
    <JazzBarSkeletonPage
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      {selectedTab === "jazz" && <Jazz setUserList={setUserList} />}
      {selectedTab === "cocktail" && (
        <Cocktail userList={userList} setUserList={setUserList} />
      )}
    </JazzBarSkeletonPage>
  );
};

export default JazzBar;
