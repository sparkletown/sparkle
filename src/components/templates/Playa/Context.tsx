import React, { createContext, useReducer } from "react";
import { Reducer, InitialState } from "./Reducer";

export const PlayaContext = createContext({});
export const PlayaContextProvider = (props: { children: any }) => {
  const [state, dispatch] = useReducer(Reducer, InitialState);
  return (
    <PlayaContext.Provider value={{ state, dispatch }}>
      {props.children}
    </PlayaContext.Provider>
  );
};
