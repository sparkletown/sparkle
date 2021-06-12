import React, { useEffect, useRef } from "react";
import { useUser } from "hooks/useUser";
import "./AnimateMap.scss";
import { AnimateMapVenue } from "../../../types/venues";
import { useSelector } from "../../../hooks/useSelector";
import { animateMapStageOptionsSelector } from "../../../utils/selectors";
import { useDispatch } from "../../../hooks/useDispatch";
import { updateAnimateMapStageOptions } from "../../../store/actions/AnimateMap";
import { AppContext, Container, Stage } from "react-pixi-fiber";
import { Map } from "./components";

export interface AnimateMapProps {
  venue: AnimateMapVenue;
}

export const AnimateMap: React.FC<AnimateMapProps> = ({ venue }) => {
  const options = useSelector(animateMapStageOptionsSelector);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateAnimateMapStageOptions(
        Object.assign(options, { resizeTo: containerRef.current })
      )
    ); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { user, profile } = useUser();
  if (!user || !profile) return <>Loading..</>;

  return (
    <div ref={containerRef} className="animatemap-venue-container">
      <Stage options={{ ...options }}>
        <AppContext.Consumer>
          {(app) => (
            <RootContainer>
              <Map />
              <UI />
            </RootContainer>
          )}
        </AppContext.Consumer>
      </Stage>
    </div>
  );
};

const RootContainer = ({ ...props }) => {
  return <Container {...props} />;
};
const UI = ({ ...props }) => {
  return <Container {...props} />;
};
