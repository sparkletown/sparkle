import React, { useMemo, useState } from "react";

import { CustomLoader } from "types/CustomLoader";

import { useCustomLoaders } from "hooks/useCustomLoaders";

import "./loading.scss";

const getRandomInt = (max: number, randomValue: () => number = Math.random) => {
  return Math.floor(randomValue() * Math.floor(max));
};

// TODO: move this into useCustomLoaders, or settings, or similar?
export const DEFAULT_LOADER: CustomLoader = {
  title: "Loading Sparkle",
  text: "Loading Sparkle",
  url: "",
};

export const LoadingPage = () => {
  const { customLoaders } = useCustomLoaders();

  // TODO: randomly choose one of the custom loaders to use
  //   This should be 'stable per load' and not change even if there are multiple re-renders
  // TODO: for some reason it seems to run at least twice, with changing int values.. which makes it 'flash' and change backgrounds
  // TODO: move all of this into useCustomLoaders or similar?

  // Set the random integer once, but calculate how that maps to an index later
  const [rawRandomValue] = useState<number>(Math.random());

  const chosenLoader: CustomLoader = useMemo(() => {
    if (customLoaders.length < 1) return DEFAULT_LOADER;

    const randomIndex = getRandomInt(
      customLoaders.length - 1,
      () => rawRandomValue
    );

    // TODO: remove this debug logging
    console.log({ rawRandomValue, randomIndex });

    return customLoaders[randomIndex] ?? DEFAULT_LOADER;
  }, [rawRandomValue, customLoaders]);

  // TODO: move these inline styles into scss
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#7c46fb", // $primary
        backgroundImage: `url(${chosenLoader.url})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="loading-screen"
        style={{ backgroundColor: "transparent", backdropFilter: "blur(15px)" }}
      >
        <div className="loading-content">
          <div className="burningman-loading">
            <div className="burningman-loading-anim" />
          </div>
          {chosenLoader.url && (
            // TODO: Unhardcode the width/height here
            //   https://stackoverflow.com/questions/600743/how-to-get-div-height-to-auto-adjust-to-background-size/22211990#22211990
            <div
              style={{
                backgroundImage: `url(${chosenLoader.url})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                width: "600px",
                height: "800px",
                borderRadius: "20px",
              }}
            />
          )}
          <span className="loading-randomquote show">Loading...</span>
        </div>
      </div>
    </div>
  );
};
