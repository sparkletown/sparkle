// eslint-disable-next-line no-restricted-imports
import { RootState } from "index";
import { useDispatch as _useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootActions } from "store/actions";

export const useDispatch = () =>
  _useDispatch<ThunkDispatch<RootState, void, RootActions>>();
export type Dispatch = ReturnType<typeof useDispatch>;
