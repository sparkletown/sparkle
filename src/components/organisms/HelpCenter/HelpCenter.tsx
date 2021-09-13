import React, { useCallback, useState } from "react";

import { useShowHide } from "hooks/useShowHide";

import { LoadingPage } from "components/molecules/LoadingPage";

import { ButtonNG } from "components/atoms/ButtonNG";

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
          <div className="HelpCenter__iframeContainer">
            <ButtonNG
              className="HelpCenter__backButton"
              onClick={handleBackClicked}
              variant="primary"
            >
              Back
            </ButtonNG>
            <iframe
              className="HelpCenter__iframe"
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
