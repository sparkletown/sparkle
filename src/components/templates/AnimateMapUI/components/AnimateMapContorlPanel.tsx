import React, { useCallback, useEffect, useState } from "react";

import EventProvider, {
  EventType,
} from "components/templates/AnimateMap/bridges/EventProvider/EventProvider";

import {
  AnimateMapActionTypes,
  setAnimateMapZoomAction,
  SubscribeActionAfterListener,
} from "../../AnimateMapCommon";

import AddIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-add.svg";
import BikeIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-bike.svg";
import HumanIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-human.svg";
import PlaneIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-plane.svg";
import RemoveIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-remove.svg";

import "./AnimateMapControlPanel.scss";

export interface AnimateMapContorlPanelProps {
  subscribeActionAfter: (
    action: string,
    listener: SubscribeActionAfterListener
  ) => () => void;
  onSetAnimateMapZoom: (zoom: number) => void;
}

export const AnimateMapContorlPanel: React.FC<AnimateMapContorlPanelProps> = (
  props
) => {
  const [zoom, setZoom] = useState(2);
  const eventProvider = EventProvider;

  useEffect(() => {
    const unsubscribe = props.subscribeActionAfter(
      AnimateMapActionTypes.SET_ZOOM_LEVEL,
      (action) => {
        setZoom((action as setAnimateMapZoomAction).payload.zoomLevel);
      }
    );
    return () => {
      unsubscribe();
    };
  });

  const zoomIn = useCallback(
    () => eventProvider.emit(EventType.UI_CONTROL_PANEL_ZOOM_IN),
    [eventProvider]
  );
  const zoomOut = useCallback(
    () => eventProvider.emit(EventType.UI_CONTROL_PANEL_ZOOM_OUT),
    [eventProvider]
  );

  const setZoomMode = useCallback(
    (zoom: number) => {
      setZoom(zoom);
      props.onSetAnimateMapZoom(zoom);
    },
    [props]
  );

  const setWalking = useCallback(() => setZoomMode(0), [setZoomMode]);
  const setBicycle = useCallback(() => setZoomMode(1), [setZoomMode]);
  const setPlane = useCallback(() => setZoomMode(2), [setZoomMode]);

  return (
    <div className="ControlPanel">
      <div className="ControlPanel__icon-panel icon-panel">
        <div
          onClick={zoomIn}
          className={"icon-panel__item icon-panel__item_bottom-border"}
        >
          <img src={AddIcon} alt="zoom-in" />
        </div>
        <div
          onClick={setWalking}
          className={
            "icon-panel__item" + (zoom === 0 ? " icon-panel__item--active" : "")
          }
        >
          <img src={HumanIcon} alt="zoom-indicator" />
        </div>
        <div
          onClick={setBicycle}
          className={
            "icon-panel__item" + (zoom === 1 ? " icon-panel__item--active" : "")
          }
        >
          <img src={BikeIcon} alt="zoom-indicator" />
        </div>
        <div
          onClick={setPlane}
          className={
            "icon-panel__item" + (zoom === 2 ? " icon-panel__item--active" : "")
          }
        >
          <img src={PlaneIcon} alt="zoom-indicator" />
        </div>
        <div
          onClick={zoomOut}
          className={"icon-panel__item icon-panel__item_top-border"}
        >
          <img src={RemoveIcon} alt="zoom-out" />
        </div>
      </div>
    </div>
  );
};
