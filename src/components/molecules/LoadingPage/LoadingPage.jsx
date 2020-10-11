import React, { useState, useEffect } from "react";
import { IS_BURN } from "secrets";

import "./loading.scss";

const quotes = IS_BURN
  ? [
      "Navigating dust storms...",
      "Roadtripping across Nevada...",
      "In a traffic jam in Gerlach...",
      "Biking out to deep playa...",
      "Fixing tyre punctures...",
      "Reimagining the real...",
      "Dodging cow pats in the paddock...",
      "Fighting dropbears...",
      "Herding koalas...",
      "Learning the local lingo...",
      "Becoming good friends with the NEEEEEIGHBOURS...",
      "Throwing shrimp on the barbie...",
      "Watering the speakers...",
      "Massaging minds...",
      "Laying out the croissants...",
      "Adjusting microphone volumes...",
    ]
  : ["Loading..."];

export const LoadingPage = () => {
  const [quote, setQuote] = useState("Loading...");

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
