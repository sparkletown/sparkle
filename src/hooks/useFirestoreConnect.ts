import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect as _useFirestoreConnect,
  isLoaded as _isLoaded,
  isEmpty as _isEmpty,
  WhereOptions,
} from "react-redux-firebase";
import { ValidFirestoreKeys } from "types/Firestore";
import { Defined } from "types/utility";

/**
 * This type allows us to avoid bugs when doc is not specified, and
 * automagically constrain the storeAs parameter to keys that exist
 * within ValidFirestoreKeys, ensuring that we can't forget to define
 * it in our types when using functions that rely on this type
 * (eg. useFirestoreConnect)
 *
 * @see ValidFirestoreKeys
 * @see useFirestoreConnect
 * @see ReduxFirestoreQuerySetting
 */
export interface SparkleRFQuery extends ReduxFirestoreQuerySetting {
  doc?: never;
  where: WhereOptions | WhereOptions[];
  storeAs?: ValidFirestoreKeys;
}

/**
 * This type allows us to query for a single document, and automagically
 * constrain the storeAs parameter to keys that exist within
 * ValidFirestoreKeys, ensuring that we can't forget to define it in our
 * types when using functions that rely on this type
 * (eg. useFirestoreConnect)
 *
 * @see AnySparkleRFQuery
 * @see useFirestoreConnect
 * @see ReduxFirestoreQuerySetting
 */
export interface SparkleRFDocQuery extends ReduxFirestoreQuerySetting {
  doc: string;
  where?: never;
  storeAs?: ValidFirestoreKeys;
}

export type AnySparkleRFQuery = SparkleRFQuery | SparkleRFDocQuery;

/**
 * A wrapper for useFirestoreConnect() that ensures the config
 * we pass it can only use a storeAs key that has been defined
 * in our FirestoreData/FirestoreOrdered types.
 *
 * Note: the config does NOT need to be memo'd before being passed
 * to this function as useFirestoreConnect() determines equality
 * through a deep comparison using lodash's isEqual() function.
 *
 * @param config the config to be passed to useFirestoreConnect()
 * @param shouldExecuteQuery if the value passed is falsy,
 *  don't execute the query (ie. no-op).
 *
 * @see AnySparkleRFQuery
 * @see ValidFirestoreKeys
 * @see ReduxFirestoreQuerySetting
 */
export const useFirestoreConnect = (
  config: AnySparkleRFQuery | AnySparkleRFQuery[],
  shouldExecuteQuery?: boolean
) => {
  if (!shouldExecuteQuery) return;

  return _useFirestoreConnect(config);
};

/**
 * Use react-redux-firestore's isEmpty helper with
 * user-defined type guards to properly narrow types
 * when using this helper.
 *
 * @param item item fetched by react-redux-firestore
 */
export const hasData = <T>(item: T): item is Defined<T> =>
  !_isEmpty(item) && item !== undefined;

/**
 * Re-export react-redux-firestore's isLoaded helper for convenience.
 */
export const isLoaded = <T>(item: T) => _isLoaded(item);
