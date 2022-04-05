import {
  Listener,
  subscribeActionAfter as reduxSubscribeActionAfter,
} from "redux-subscribe-action";

export const subscribeActionAfter = (action: string, listener: Listener) => {
  return reduxSubscribeActionAfter(action, listener);
};
