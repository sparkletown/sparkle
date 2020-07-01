import React, { useState } from "react";
import { useSelector } from "react-redux";
import JazzBarSkeletonPage from "./JazzBarSkeletonPage";
import useProfileInformationCheck from "hooks/useProfileInformationCheck";

import Jazz from "./JazzTab";
import Cocktail from "./CocktailTab";
import { User } from "types/User";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import { PARTY_NAME } from "config";

import { Switch, Route, useRouteMatch } from "react-router-dom";

const JazzBar = () => {
  // const [selectedTab, setSelectedTab] = useState("jazz");
  // useProfileInformationCheck();

  // const [userList, setUserList] = useState<User[]>([]);

  // const { user, experience } = useSelector((state: any) => ({
  //     user: state.user,
  //     experience:
  //     state.firestore &&
  //     state.firestore.data.config?.[PARTY_NAME]?.experiences?.jazzbar,
  // }));

  // useUpdateLocationEffect(user, experience.associatedRoom);

  const match = useRouteMatch();
  console.log(match);

  return (
    <>
      JazzBar
      <Switch>
        <Route path={`${match.url}/band`} component={() => <>Band</>} />
        <Route path={`${match.url}/`} component={() => <>Main</>} />
      </Switch>
      {/* <JazzBarSkeletonPage
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    >
      {selectedTab === "jazz" && <Jazz setUserList={setUserList} />}
      {selectedTab === "cocktail" && (
        <Cocktail userList={userList} setUserList={setUserList} />
      )}
    </JazzBarSkeletonPage> */}
    </>
  );
};

export default JazzBar;
