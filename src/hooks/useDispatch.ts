// eslint-disable-next-line no-restricted-imports
import { useDispatch as _useDispatch } from "react-redux";
import { RootActions } from "store/actions";
import { Dispatch as _Dispatch } from "redux";

export const useDispatch = () => _useDispatch<_Dispatch<RootActions>>();
export type Dispatch = ReturnType<typeof useDispatch>;
