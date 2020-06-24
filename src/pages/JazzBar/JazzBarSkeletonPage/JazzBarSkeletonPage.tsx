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
        <InformationLeftColumn experienceLogoPath="/room-images/CRC_Island_JAZZ2.png">
          <InformationCard title="About the venue">
            Jazztastic Park is the Partypelago's most storied jazz venue. All
            flavours of this classic improvisational medium can be heard in the
            jungle-laden hills of this Northwesterly outcrop.
          </InformationCard>
          <InformationCard
            title="About tonight's show"
            className="information-card"
          >
            <p>Performing tonight at Jazztastic Park:</p>
            <ul>
              <li>
                Kansas Smitty's:
                <ul>
                  <li>Giacomo Smith - alto/clarinet</li>
                  <li>Alec harper - Tenor</li>
                  <li>Dave Archer - Guitar</li>
                  <li>Joe Webb - Piano</li>
                  <li>Ferg Ireland - Double Bass</li>
                  <li>Will Cleasby - Drums</li>
                </ul>
              </li>
              <li>Sam Leak</li>
            </ul>
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
