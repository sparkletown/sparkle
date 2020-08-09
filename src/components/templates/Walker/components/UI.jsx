import React, { useContext } from "react";
import { WalkerContext } from "../Context";
import { ActionType } from "../Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const UI = () => {
  const { dispatch } = useContext(WalkerContext);
  return (
    <>
      <div className="button-bar">
        <div
          className="button"
          onClick={() =>
            dispatch({ type: ActionType.Move, payload: { z: -1 } })
          }
        >
          <FontAwesomeIcon icon={faPlus} className="icon" />
        </div>
        <div
          className="button"
          onClick={() => dispatch({ type: ActionType.Move, payload: { z: 1 } })}
        >
          <FontAwesomeIcon icon={faMinus} className="icon" />
        </div>
        <div
          className="button"
          onClick={() =>
            dispatch({ type: ActionType.Move, payload: { x: 0, y: 1 } })
          }
        >
          <FontAwesomeIcon icon={faArrowUp} className="icon" />
        </div>
        <div
          className="button"
          onClick={() =>
            dispatch({ type: ActionType.Move, payload: { x: 0, y: -1 } })
          }
        >
          <FontAwesomeIcon icon={faArrowDown} className="icon" />
        </div>
        <div
          className="button"
          onClick={() =>
            dispatch({ type: ActionType.Move, payload: { x: -1, y: 0 } })
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} className="icon" />
        </div>
        <div
          className="button"
          onClick={() =>
            dispatch({ type: ActionType.Move, payload: { x: 1, y: 0 } })
          }
        >
          <FontAwesomeIcon icon={faArrowRight} className="icon" />
        </div>
      </div>
    </>
  );
};
