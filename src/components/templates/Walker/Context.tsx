import React, { createContext, useReducer } from "react";
import { Reducer, InitialState } from "./Reducer";

export const WalkerContext = createContext({});
export const WalkerContextProvider = (props: { children: any }) => {
  const [state, dispatch] = useReducer(Reducer, InitialState);
  return (
    <WalkerContext.Provider value={{ state, dispatch }}>
      {props.children}
    </WalkerContext.Provider>
  );
};
