import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import TabNavigation from "components/molecules/TabNavigation";
import InformationCard from "components/molecules/InformationCard";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "react-redux";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import { PARTY_NAME } from "config";

import "./JazzBarSkeletonPage.scss";

interface PropsType {
  selectedTab: string;
  children: React.ReactNode;
  setSelectedTab: (value: string) => void;
}

const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  selectedTab,
  children,
  setSelectedTab,
}) => {
  const { user, experience } = useSelector((state: any) => ({
    user: state.user,
    experience: state.firestore.data.config?.[PARTY_NAME]?.experiences.jazzbar,
  }));

  useUpdateLocationEffect(user, experience.associatedRoom);

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container">
        <InformationLeftColumn experienceLogoPath="/kansas-smittys-logo-red.png">
          <InformationCard title="About the venue">
            Kansas Smitty’s is East London’s most dynamic jazz venue. Located on
            Broadway Market, it opens six nights a week for live jazz in an
            intimate basement environment. Their seven-piece house band share
            the name. The signature cocktail in this cult bar, the julep, is a
            bourbon-based cocktail served in an ice-filled tin, and recalls the
            jazzy bars of 1920s Kansas where the likes of Mary Lou Williams gave
            us new ways of hearing.
          </InformationCard>
          <InformationCard
            title="About tonight's show"
            className="information-card"
          >
            <p>Performing tonight at Kansas Smitty's:</p>
            <ul>
              <li>Giacomo Smith - alto/clarinet</li>
              <li>Alec harper - Tenor</li>
              <li>Dave Archer - Guitar</li>
              <li>Joe Webb - Piano</li>
              <li>Ferg Ireland - Double Bass</li>
              <li>Will Cleasby - Drums</li>
            </ul>
            <p>Broadcasting live from their East London home.</p>
          </InformationCard>
        </InformationLeftColumn>
        <div className="content-container">
          <div className="right-hand-corner">
            <TabNavigation
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>
          {children}
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default JazzBarSkeletonPage;
