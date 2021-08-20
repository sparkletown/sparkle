import React, { useCallback, useState } from "react";
import { useTimeoutFn } from "react-use";
import classNames from "classnames";
import { isEqual } from "lodash";

import { IS_BURN } from "secrets";

import { LOADING_PAGE_ANIMATION_DELAY } from "settings";

import { useInterval } from "hooks/useInterval";
import { useShowHide } from "hooks/useShowHide";

import { ReactComponent as DiamondSvg } from "assets/icons/loading-diamond.svg";
import { ReactComponent as PlayaSvg } from "assets/icons/loading-playa.svg";

import "./LoadingPage.scss";

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

const _LoadingPage = () => {
  const [quote, setQuote] = useState("Loading...");

  useInterval(
    useCallback(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []),
    IS_BURN ? 1000 : undefined
  );

  const { isShown: animate, show: startAnimation } = useShowHide();
  //this prevents "flickering" of the animation on page load
  useTimeoutFn(startAnimation, LOADING_PAGE_ANIMATION_DELAY);

  return (
    <div className="LoadingPage">
      <div className="LoadingPage__wrapper">
        <div className="LoadingPage__logo-container">
          <DiamondSvg
            className={classNames("LoadingPage__diamond", {
              "LoadingPage__diamond--animation": animate,
            })}
          />
          <PlayaSvg />
        </div>
        <span className={`LoadingPage__text`}>{quote}</span>
      </div>
    </div>
  );
};

export const LoadingPage = React.memo(_LoadingPage, isEqual);
