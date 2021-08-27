import React, { useCallback, useState } from "react";

import { VPLAYA_URL } from "settings";

import { useShowHide } from "hooks/useShowHide";

import { LoadingPage } from "components/molecules/LoadingPage";

import { HelpCenterContent } from "./components/HelpCenterContent";

import "components/organisms/HelpCenter/HelpCenter.scss";

export const HelpCenter: React.FC = () => {
  const [url, setUrl] = useState<string>();

  const {
    isShown: isLoading,
    show: startLoading,
    hide: stopLoading,
  } = useShowHide(false);

  const handleHelpClicked = useCallback(
    (url: string) => {
      if (url === VPLAYA_URL) {
        window.open(VPLAYA_URL);
      } else {
        startLoading();
        setUrl(url);
      }
    },
    [startLoading]
  );
  console.log(url);

  return (
    <>
      {url ? (
        <>
          {isLoading && <LoadingPage />}
          <iframe
            className={"HelpCenter__iframe"}
            onLoad={stopLoading}
            frameBorder="0"
            src={url}
            title="Help Center"
          />
        </>
      ) : (
        <HelpCenterContent onHelpClicked={handleHelpClicked} />
      )}
    </>
  );
};
