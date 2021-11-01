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

  return (<></>);
};
