// eslint-disable-next-line no-restricted-imports
import {
  isEmpty as _isEmpty,
  isLoaded as _isLoaded,
  ReduxFirestoreQuerySetting,
  useFirestoreConnect as _useFirestoreConnect,
  WhereOptions,
} from "react-redux-firebase";

import {
  ValidFirestoreRootCollections,
  ValidStoreAsKeys,
} from "types/Firestore";
import { Defined } from "types/utility";

/**
 * Query to access a root firestore collection
 */
export type SparkleRFCollectionQuery = ReduxFirestoreQuerySetting & {
  collection: ValidFirestoreRootCollections;
  doc?: never;
  where?: never;
  subcollections?: never;
  storeAs?: never;
};

/**
 * Query to access a root firestore collection with a where filter
 */
export type SparkleRFCollectionWhereQuery = ReduxFirestoreQuerySetting & {
  collection: ValidFirestoreRootCollections;
  doc?: never;
  where: WhereOptions | WhereOptions[];
  subcollections?: never;
  storeAs: ValidStoreAsKeys;
};

/**
 * Query to access a single document from a firestore collection
 */
export type SparkleRFSingleDocumentQuery = ReduxFirestoreQuerySetting & {
  collection: ValidFirestoreRootCollections;
  doc: string;
  where?: never;
  subcollections?: never;
  storeAs: ValidStoreAsKeys;
};

/**
 * Query to access a subcollection within a single document within a firestore collection
 */
export type SparkleRFSubcollectionQuery = ReduxFirestoreQuerySetting & {
  collection: ValidFirestoreRootCollections;
  doc: string;
  where?: WhereOptions | WhereOptions[];
  subcollections: ReduxFirestoreQuerySetting[];
  storeAs: ValidStoreAsKeys;
};

/**
 * All valid Sparkle useFirestoreConnect query types
 *
 * @see useFirestoreConnect
 * @see SparkleRFCollectionQuery
 * @see SparkleRFCollectionWhereQuery
 * @see SparkleRFSingleDocumentQuery
 * @see SparkleRFSubcollectionQuery
 */
export type AnySparkleRFQuery =
  | SparkleRFCollectionQuery
  | SparkleRFCollectionWhereQuery
  | SparkleRFSingleDocumentQuery
  | SparkleRFSubcollectionQuery;

/**
 * A wrapper for react-redux-firestore's useFirestoreConnect() that ensures the
 * config we pass it conforms to our set of allowed query types.
 *
 * Note: the config does NOT need to be memo'd before being passed
 * to this function as useFirestoreConnect() determines equality
 * through a deep comparison using lodash's isEqual() function.
 *
 * @param config the config to be passed to useFirestoreConnect()
 *
 * @see AnySparkleRFQuery
 * @see ReduxFirestoreQuerySetting
 * @see ValidFirestoreRootCollections
 */
export const useFirestoreConnect = (
  config?:
    | AnySparkleRFQuery
    | AnySparkleRFQuery[]
    | ValidFirestoreRootCollections
) => _useFirestoreConnect(config);

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
export const isLoaded = <T>(item: T): boolean => _isLoaded(item);

/**
 * Re-export react-redux-firestore's isEmpty helper for convenience.
 */
export const isEmpty = <T>(item: T): boolean => _isEmpty(item);
