import React, { useCallback, useState } from "react";
import { useEffectOnce } from "react-use";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapZoom,
  setAnimateMapZoomAction,
} from "store/actions/AnimateMap";

import { useDispatch } from "hooks/useDispatch";

import EventProvider, {
  EventType,
} from "../../bridges/EventProvider/EventProvider";

import AddIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-add.svg";
import BikeIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-bike.svg";
import HumanIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-human.svg";
import PlaneIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-plane.svg";
import RemoveIcon from "assets/images/AnimateMap/UI/BikeToggler/icon-remove.svg";

import "./ControlPanel.scss";

export interface ControlPanelProps {}

export const ControlPanel: React.FC<ControlPanelProps> = ({ children }) => {
  const [zoom, setZoom] = useState(2);
  const dispatch = useDispatch();
  const eventProvider = EventProvider;

  useEffectOnce(() => {
    const unsubscribe = subscribeActionAfter(
      AnimateMapActionTypes.SET_ZOOM,
      (action) => {
        setZoom((action as setAnimateMapZoomAction).payload.zoom);
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
      dispatch(setAnimateMapZoom(zoom));
    },
    [dispatch]
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
