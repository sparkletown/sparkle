import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import TabNavigation from "components/molecules/TabNavigation";
import InformationCard from "components/molecules/InformationCard";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "react-redux";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import { PARTY_NAME } from "config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./JazzBarSkeletonPage.scss";
import ChatModal from "components/organisms/ChatModal";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  useUpdateLocationEffect(user, experience.associatedRoom);

  return (
    <>
      <WithNavigationBar>
        <div className="full-page-container experience-container">
          <InformationLeftColumn experienceLogoPath="/kansas-smittys-logo-red.png">
            <InformationCard title="About the venue">
              <p>
                Kansas Smitty’s.
                <br /> It's a band and it's a bar.
              </p>

              <p>
                Choose your table, invite your friends to join you and listen to
                the sounds of our House band.
              </p>

              <p>
                Performing tonight at Kansas Smitty's we have:
                <ul>
                  <li>Giacomo Smith - Alto & clarinet</li>
                  <li>Alec Harper - Tenor Sax</li>
                  <li>Joe Webb - Piano</li>
                  <li>Will Sach - Double Bass</li>
                  <li>Will cleasby - Drums</li>
                </ul>
              </p>
              <p>
                If you enjoy the music why not join the Patreon community. Our
                Patreons get access to all sorts of additional musical content
                and updates on all new shows, performances and events we run.
                https://www.patreon.com/kansassmittys
              </p>
              <p>
                Kansas Smitty's have just released their new album 'Things
                Happened Here' available on all good streaming platforms and
                vinyl /CD https://ever-records.lnk.to/ThingsHappenedHere
              </p>
              <p>We'll see you in the bar...</p>
            </InformationCard>
          </InformationLeftColumn>
          <div className="content-container">
            <div className="navigation-container">
              <TabNavigation
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
              <button
                className="btn btn-primary chat-button"
                onClick={() => setIsChatModalOpen(!isChatModalOpen)}
              >
                Chat
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`chevron ${isChatModalOpen ? "chat-open" : ""}`}
                  size="sm"
                />
              </button>
            </div>
            {children}
          </div>
        </div>
      </WithNavigationBar>
      <ChatModal show={isChatModalOpen} room={selectedTab} />
    </>
  );
};

export default JazzBarSkeletonPage;
