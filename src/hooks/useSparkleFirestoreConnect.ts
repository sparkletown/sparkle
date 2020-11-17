import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
  isLoaded as _isLoaded,
  isEmpty as _isEmpty,
} from "react-redux-firebase";
import { ValidFirestoreKeys } from "types/Firestore";

/**
 * Type helper representing all types of T except undefined
 */
export type Defined<T> = T & Exclude<T, undefined>;

/**
 * This type allows us to automagically constrain the storeAs
 * parameter to keys that exist within ValidFirestoreKeys, ensuring
 * that we can't forget to define it in our types when using functions
 * that rely on this type (eg. useSparkleFirestoreConnect)
 *
 * @see ValidFirestoreKeys
 * @see useSparkleFirestoreConnect
 * @see ReduxFirestoreQuerySetting
 */
export interface SparkleRFQConfig extends ReduxFirestoreQuerySetting {
  storeAs?: ValidFirestoreKeys;
}

/**
 * A wrapper for useFirestoreConnect() that ensures the config
 * we pass it can only use a storeAs key that has been defined
 * in our FirestoreData/FirestoreOrdered types.
 *
 * Note: the config does NOT need to be memo'd before being passed
 * to this function as useSparkleFirestoreConnect() determines equality
 * through a deep comparison using lodash's isEqual() function.
 *
 * @param config the config to be passed to useFirestoreConnect()
 *
 * @see SparkleRFQConfig
 * @see ValidFirestoreKeys
 * @see ReduxFirestoreQuerySetting
 */
export const useSparkleFirestoreConnect = (config: SparkleRFQConfig[]) =>
  useFirestoreConnect(config);

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
