import React, { useLayoutEffect, useRef } from "react";

import { useCustomLoaders } from "hooks/useCustomLoaders";

import "./loading.scss";

export const LoadingPage: React.FC = () => {
  const { chosenRandomLoader } = useCustomLoaders();

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
