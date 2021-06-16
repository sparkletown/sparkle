import * as PIXI from "pixi.js";

import React, { useState, useRef, useEffect } from "react";
import { Provider, ReactReduxContext } from "react-redux";
import { AppConsumer, Container, Stage, useApp } from "@inlet/react-pixi";
import { AnimateMapVenue } from "../../../types/venues";
import { useUser } from "hooks/useUser";
import { useSelector } from "../../../hooks/useSelector";
import { animateMapStageOptionsSelector } from "../../../utils/selectors";

import "./AnimateMap.scss";

import { Map } from "./components/Map/Map";
import { MAP_IMAGE } from "./constants/Resources";

export interface AnimateMapProps {
  venue: AnimateMapVenue;
}

export const AnimateMap: React.FC<AnimateMapProps> = () => {
  const options = useSelector(animateMapStageOptionsSelector);

  const containerRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useUser();

  if (!user || !profile) {
    return <>Loading..</>;
  }

  const container = containerRef.current ?? null;

  return (
    <div ref={containerRef} className="animatemap-venue-container">
      {container && (
        <ReactReduxContext.Consumer>
          {({ store }) => (
            <Stage
              width={container.offsetWidth}
              height={container.offsetHeight}
              options={Object.assign(options, { resizeTo: container })}
            >
              <AppConsumer>
                {(app) => (
                  <Provider store={store}>
                    {app ? <LoadingContainer /> : <Container />}
                  </Provider>
                )}
              </AppConsumer>
            </Stage>
          )}
        </ReactReduxContext.Consumer>
      )}
    </div>
  );
};

// @ts-ignore
const LoadingContainer = () => {
  const app = useApp();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && app) {
      setIsLoading(true);

      app.loader.reset().add(MAP_IMAGE).load();
      app.loader.onLoad.add(() => setIsLoaded(true));
      app.loader.onError.add((loader: PIXI.Loader, resource: PIXI.Resource) =>
        console.error(resource)
      );
    }
  }, [isLoading, app]);

  if (!isLoaded) {
    return <Container />;
  }

  return <RootContainer />;
};

const RootContainer = () => {
  return <Map />;
};
