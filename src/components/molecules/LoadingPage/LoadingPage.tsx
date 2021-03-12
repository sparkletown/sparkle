import React, { useEffect, useMemo, useRef, useState } from "react";

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

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      // Make the background image url accessible to our SCSS
      containerRef.current.style.setProperty(
        "--loading-page-background-image",
        `url(${chosenLoader.url})`
      );
    }
  }, [chosenLoader.url]);

  return (
    <div className="LoadingPage" ref={containerRef}>
      <div className="LoadingPage__blur">
        <div className="LoadingPage__image" />

        {/* @debt Extract this loading icon into a standalone component */}
        <div className="loading-icon">
          <div className="loading-icon__mask">
            <div className="loading-icon__fill" />
          </div>
        </div>

        <span className="LoadingPage__loading-text">Loading</span>
      </div>
    </div>
  );
};
