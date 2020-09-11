import React, { useState, useEffect } from "react";
import { IS_BURN } from "settings";

import "./loading.scss";

const quotes = [
  "Navigating dust storms...",
  "Roadtripping across Nevada...",
  "In a traffic jam in Gerlach...",
  "Biking out to deep playa...",
  "Fixing tyre punctures...",
  "Reimagining the real...",
];

export const LoadingPage = () => {
  const [quote, setQuote] = useState();

  useEffect(() => {
    if (!IS_BURN) return;
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const id = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [setQuote]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="burningman-loading-container">
          <span className="loading-sparkle-1"></span>
          <span className="loading-sparkle-2"></span>
          <div className="burningman-loading">
            <div className="burningman-loading-anim"></div>
          </div>
        </div>
        <span className={`loading-randomquote ${quote && "show"}`}>
          {quote}
        </span>
      </div>
    </div>
  );
};
