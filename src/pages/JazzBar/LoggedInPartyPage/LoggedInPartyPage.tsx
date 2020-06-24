import React, { useState } from "react";
import { useSelector } from "react-redux";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Jazz from "../Jazz";
import Cocktail from "../Cocktail";
import { User } from "types/User";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import { PARTY_NAME } from "config";

const LoggedInPartyPage: React.FunctionComponent = () => {
  const [selectedTab, setSelectedTab] = useState("jazz");
  useProfileInformationCheck();

  const [userList, setUserList] = useState<User[]>([]);

  const { user, experience } = useSelector((state: any) => ({
    user: state.user,
    experience: state.firestore.data.config?.[PARTY_NAME]?.experiences.jazzbar,
  }));

  useUpdateLocationEffect(user, experience.associatedRoom);

  return (
    <JazzBarSkeletonPage
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      {selectedTab === "jazz" && (
        <Jazz selectedTab={selectedTab} setUserList={setUserList} />
      )}
      {selectedTab === "cocktail" && (
        <Cocktail userList={userList} setUserList={setUserList} />
      )}
    </JazzBarSkeletonPage>
  );
};

export default LoggedInPartyPage;
