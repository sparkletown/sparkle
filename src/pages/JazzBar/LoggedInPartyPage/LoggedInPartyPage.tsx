import React, { useState } from "react";
import { useSelector } from "react-redux";
import JazzBarSkeletonPage from "../JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Jazz from "../Jazz";
import Cocktail from "../Cocktail";
import { User } from "types/User";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import { PARTY_NAME } from "config";
import ExperienceContextProvider from "components/context/ExperienceContext";

const LoggedInPartyPage: React.FunctionComponent = () => {
  const [selectedTab, setSelectedTab] = useState("jazz");
  useProfileInformationCheck();

  const [userList, setUserList] = useState<User[]>([]);

  const { user, experience } = useSelector((state: any) => ({
    user: state.user,
    experience:
      state.firestore &&
      state.firestore.data.config?.[PARTY_NAME]?.experiences?.jazzbar,
  }));

  useUpdateLocationEffect(user, experience.associatedRoom);

  return (
    <ExperienceContextProvider experienceName="kansassmittys">
      <JazzBarSkeletonPage
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      >
        {selectedTab === "jazz" && <Jazz setUserList={setUserList} />}
        {selectedTab === "cocktail" && (
          <Cocktail userList={userList} setUserList={setUserList} />
        )}
      </JazzBarSkeletonPage>
    </ExperienceContextProvider>
  );
};

export default LoggedInPartyPage;
