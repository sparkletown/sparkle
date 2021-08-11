import React, { useState } from "react";
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
// import { useSelector } from "hooks/useSelector";
// import { animateMapEventProviderSelector } from "utils/selectors";

export interface ControlPanelProps {}

export const ControlPanel: React.FC<ControlPanelProps> = ({ children }) => {
  const [zoom, setZoom] = useState(2);
  const dispatch = useDispatch();
  // const eventProvider = useSelector(animateMapEventProviderSelector);
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

  return (
    <div className="ControlPanel">
      <div className="ControlPanel__icon-panel icon-panel">
        <div
          onClick={() => eventProvider.emit(EventType.UI_CONTROL_PANEL_ZOOM_IN)}
          className={"icon-panel__item icon-panel__item_bottom-border"}
        >
          <img src={AddIcon} alt="zoom-in" />
        </div>
        <div
          onClick={() => {
            setZoom(0);
            dispatch(setAnimateMapZoom(0));
          }}
          className={
            "icon-panel__item" + (zoom === 0 ? " icon-panel__item_active" : "")
          }
        >
          <img src={HumanIcon} alt="zoom-indicator" />
        </div>
        <div
          onClick={() => {
            setZoom(1);
            dispatch(setAnimateMapZoom(1));
          }}
          className={
            "icon-panel__item" + (zoom === 1 ? " icon-panel__item_active" : "")
          }
        >
          <img src={BikeIcon} alt="zoom-indicator" />
        </div>
        <div
          onClick={() => {
            setZoom(2);
            dispatch(setAnimateMapZoom(2));
          }}
          className={
            "icon-panel__item" + (zoom === 2 ? " icon-panel__item_active" : "")
          }
        >
          <img src={PlaneIcon} alt="zoom-indicator" />
        </div>
        <div
          onClick={() =>
            eventProvider.emit(EventType.UI_CONTROL_PANEL_ZOOM_OUT)
          }
          className={"icon-panel__item icon-panel__item_top-border"}
        >
          <img src={RemoveIcon} alt="zoom-out" />
        </div>
      </div>
    </div>
  );
};
