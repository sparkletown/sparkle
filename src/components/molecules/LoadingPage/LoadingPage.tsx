import React, { useState } from "react";

import { useInterval } from "hooks/useInterval";

import "./loading.scss";

const QUOTES = ["Loading..."];
const QUOTE_INTERVAL = undefined;

export const LoadingPage = () => {
  const [quote, setQuote] = useState("Loading...");

  useInterval(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, QUOTE_INTERVAL);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="burningman-loading-container">
          <span className="loading-sparkle-1" />
          <span className="loading-sparkle-2" />
          <div className="burningman-loading">
            <div className="burningman-loading-anim" />
          </div>
        </div>
        <span className={`loading-randomquote ${quote && "show"}`}>
          {quote}
        </span>
      </div>
    </div>
  );
};
