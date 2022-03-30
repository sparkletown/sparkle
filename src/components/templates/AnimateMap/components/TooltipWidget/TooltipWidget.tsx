import React, { useEffect, useState } from "react";

import { DEFAULT_PORTAL_BOX } from "settings";

import { setAnimateMapRoom } from "store/actions/AnimateMap";

import { Room } from "types/rooms";

import { useDispatch } from "hooks/useDispatch";

import {EventProvider,EventType} from "../../../EventProvider";
import { ReplicatedVenue } from "../../../GameInstanceCommonInterfaces";
import { ENTER } from "../../game/utils/Keyboard";
import KeyPoll from "../../game/utils/KeyPollSingleton";

import "./TooltipWidget.scss";

export interface TooltipWidgetProps {}

const TOOLTIP_POOL_SIZE = 3;
const timer = 5 * 1000;

export interface TooltipWidgetItemData {
  text: string;
  status: "active" | "hide" | null;
  room: Room;
}

interface TooltipWidgetState {
  current: number;
  timeoutFunc: null | number;
  lastVenue: ReplicatedVenue;
  itemsData: TooltipWidgetItemData[];
}

//@debt remove this component and write another with simple handler logic
export const TooltipWidget: React.FC<TooltipWidgetProps> = () => {
  const [state, setState] = useState({
    current: 0,
    itemsData: new Array(TOOLTIP_POOL_SIZE).fill(undefined).map(Object),
  } as TooltipWidgetState);

  // const eventProvider = useSelector(animateMapEventProviderSelector);
  const eventProvider = EventProvider;
  useEffect(() => {
    const callback = (venue: ReplicatedVenue) => {
      if (state.timeoutFunc) {
        clearTimeout(state.timeoutFunc);
        if (state.lastVenue === venue) {
          state.timeoutFunc = setTimeout(() => {
            const current =
              state.current === 0 ? TOOLTIP_POOL_SIZE - 1 : state.current - 1;
            state.itemsData[current].status = null;
            state.timeoutFunc = null;
            setState({ ...state });
          }, timer);
          return;
        }
      }

      state.lastVenue = venue;

      const current = state.current;
      const next = state.current === TOOLTIP_POOL_SIZE - 1 ? 0 : current + 1;
      const prev = state.current === 0 ? TOOLTIP_POOL_SIZE - 1 : current - 1;
      state.itemsData[current].text = venue.data.title;
      state.itemsData[current].room = {
        ...DEFAULT_PORTAL_BOX,
        title: venue.data.title,
        subtitle: "Subtitle ",
        url: venue.data.url,
        about: "about text #",
        isEnabled: true,
        image_url: venue.data.image_url,
      };
      state.itemsData[current].status = "active";
      state.itemsData[next].status = null;
      state.itemsData[prev].status = "hide";
      state.current = next;

      state.timeoutFunc = setTimeout(() => {
        state.itemsData[current].status = null;
        state.timeoutFunc = null;
        setState({ ...state });
      }, timer);

      setState({ ...state });
    };
    eventProvider.on(EventType.ON_VENUE_COLLISION, callback);
    return () => {
      eventProvider.off(EventType.ON_VENUE_COLLISION, callback);
    };
  });

  const dispatch = useDispatch();
  useEffect(() => {
    const callback = (type: "down" | "up") => {
      if (!state.timeoutFunc) return; //reject
      if (type === "up") {
        // const current =
        //   state.current === 0 ? TOOLTIP_POOL_SIZE - 1 : state.current - 1; //FIXME
        // if (!state.itemsData[current]) return; //FIXME
        // const room = state.itemsData[current].room;
        // openRoomUrl(room.url);
        dispatch(setAnimateMapRoom(state.lastVenue.data as Room));
      }
    };
    KeyPoll.on(ENTER, callback);
    return () => {
      KeyPoll.off(ENTER, callback);
    };
  });

  const items = [];

  for (let i = 0; i < TOOLTIP_POOL_SIZE; i++) {
    const status = state.itemsData[i].status;
    items.push(
      <div
        key={`TooltipWidget__item_${i}`}
        className={
          status
            ? `item TooltipWidget__item TooltipWidget__item_${status}`
            : "item TooltipWidget__item"
        }
      >
        <img
          className="item__icon"
          src={state.itemsData[i]?.room?.image_url}
          alt="venue icon"
        />
        <div className="item__desc">
          <p>{state.itemsData[i].text}</p>
          <p>
            Press <em>Enter</em> to interact
          </p>
        </div>
        <div className="item__type">venue</div>
      </div>
    );
  }

  return <div className="TooltipWidget">{items}</div>;
};
