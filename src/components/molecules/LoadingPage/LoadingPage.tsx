import React, { useLayoutEffect, useRef } from "react";

import { useCustomLoaders } from "hooks/useCustomLoaders";

import "./loading.scss";

export const LoadingPage: React.FC = () => {
  const { chosenRandomLoader } = useCustomLoaders();

  // TODO: randomly choose one of the custom loaders to use
  //   This should be 'stable per load' and not change even if there are multiple re-renders
  // TODO: for some reason it seems to run at least twice, with changing int values.. which makes it 'flash' and change backgrounds
  // TODO: move all of this into useCustomLoaders or similar?

  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (containerRef.current) {
      // Make the background image url accessible to our SCSS
      containerRef.current.style.setProperty(
        "--loading-page-background-image",
        `url(${chosenRandomLoader.url})`
      );
    }
  }, [chosenRandomLoader.url]);

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
