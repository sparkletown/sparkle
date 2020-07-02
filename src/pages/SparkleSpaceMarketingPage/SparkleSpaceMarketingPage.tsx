import React, { useState } from "react";
import TabNavigation from "components/molecules/TabNavigation";
import { MARKETING_PAGE_TABS } from "./constants";
import "./SparkleSpaceMarketingPage.scss";
import WelcomePage from "./WelcomePage";
import FAQPage from "./FAQPage";

const INTRO_VIDEO = (
  <iframe
    title="SparkleVerse Presentation"
    width="100%"
    height="100%"
    className="marketing-video"
    src="https://www.youtube.com/embed/4Ku4E2MXp-k"
    frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
  />
);

const SparkleSpaceMarketingPage = () => {
  const [selectedTab, setSelectedTab] = useState("welcome");
  return (
    <div className="full-page-container marketing-page">
      <TabNavigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabsArray={MARKETING_PAGE_TABS}
      />

      {selectedTab === "welcome" && <WelcomePage />}
      {selectedTab === "faq" && <FAQPage />}
    </div>
  );
};

export default SparkleSpaceMarketingPage;
