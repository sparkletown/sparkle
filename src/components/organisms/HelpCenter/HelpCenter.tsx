import React, { useCallback, useState } from "react";

import { useShowHide } from "hooks/useShowHide";

import { LoadingPage } from "components/molecules/LoadingPage";

import { Button } from "components/atoms/Button";

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
      startLoading();
      setUrl(url);
    },
    [startLoading]
  );

  const handleBackClicked = () => {
    setUrl("");
  };

  return (
    <>
      {url ? (
        <>
          {isLoading && <LoadingPage />}
          <div className={"HelpCenter__iframeContainer"}>
            {!isLoading && (
              <Button
                customClass={"HelpCenter__backButton"}
                onClick={handleBackClicked}
              >
                Back
              </Button>
            )}
            <iframe
              className={"HelpCenter__iframe"}
              onLoad={stopLoading}
              frameBorder="0"
              src={url}
              title="Help Center"
            />
          </div>
        </>
      ) : (
        <HelpCenterContent onHelpClicked={handleHelpClicked} />
      )}
    </>
  );
};
