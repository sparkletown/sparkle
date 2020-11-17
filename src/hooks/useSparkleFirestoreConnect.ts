import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";
import { ValidFirestoreKeys } from "types/Firestore";

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
