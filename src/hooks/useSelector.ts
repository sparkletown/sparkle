/* eslint-disable @typescript-eslint/no-explicit-any*/
// eslint-disable-next-line no-restricted-imports
import { TypedUseSelectorHook, useSelector as _useSelector } from "react-redux";
import { RootState } from "store";
import { WithId } from "utils/id";
import { useMemo, useRef } from "react";

export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

type SubRecordType = Record<string, object>;
type AllOtherTypes = Array<any> | string | number | boolean;
type RecordType = Record<string, AllOtherTypes | SubRecordType>;

export const useKeyedSelector = <T extends RecordType, Q extends keyof T>(
  callback: (state: RootState) => T,
  keys: ReadonlyArray<Q>
) => {
  const keysRef = useRef(keys);
  const result = useSelector(callback);
  return useMemo(() => withKeyedData(result, keysRef.current), [result]);
};

type WithKeys<T extends Record<string, object>> = {
  [K in keyof T]: WithId<T[K]>;
};

type WithRootKeysNamed<T extends Record<string, any>, Names extends string> = {
  [K in keyof T]: K extends Names
    ? T[K] extends Record<string, object>
      ? WithKeys<T[K]>
      : T[K]
    : T[K];
};

// given an object with shape Record<string, object>, this function adds the key of the root object to
// as a property of the value object
const addIdsToObjectValues = <T extends Record<string, object>>(obj: T) =>
  Object.keys(obj).reduce<typeof obj>((acc, k) => {
    const key = k as keyof typeof obj;
    const valueAtKey = obj[key];
    return { ...acc, [key]: { ...valueAtKey, id: key } };
  }, obj) as WithKeys<T>;

export const withKeyedData = <T extends RecordType, Q extends keyof T>(
  data: T,
  keys: ReadonlyArray<Q>
) => {
  type Data = Extract<T, RecordType>;
  type DataKeys = ExtractReadonlyArray<typeof keys>;
  type KeyedData = WithRootKeysNamed<Data, Extract<DataKeys, string>>;

  return Object.keys(data).reduce<KeyedData>((acc, k) => {
    const key = k as DataKeys;
    if (keys.includes(key)) {
      const valueAtKey = data[key];
      if (typeof valueAtKey !== "object") return acc;
      type ObjectAtKey = Extract<typeof valueAtKey, SubRecordType>;
      // not sure why type inference does not eliminate non-object types, which is the reason for the cast
      const keyedData = addIdsToObjectValues(valueAtKey as ObjectAtKey);
      return { ...acc, [k]: keyedData };
    }
    return acc;
  }, data as KeyedData);
};

type ExtractReadonlyArray<T> = T extends ReadonlyArray<infer U> ? U : never;
