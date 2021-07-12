// eslint-disable-next-line no-restricted-imports
import { useDispatch as _useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState, RootActions } from "store";

export const useDispatch = () =>
  _useDispatch<ThunkDispatch<RootState, void, RootActions>>();
export type Dispatch = ReturnType<typeof useDispatch>;
