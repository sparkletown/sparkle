import { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import firebase from "firebase/compat/app";

export interface UseFetchAssetsReturn {
  assets: string[];
  isLoading: boolean;
  error: Error | undefined;
}

/**
 *
 * @param path: Additional path parameter that is used in addition to the `assets/` path in the database storage.
 * @example useFetchAssets("icons")
 * @returns All assets from the provided firebase storage path.
 */
export const useFetchAssets = (path: string): UseFetchAssetsReturn => {
  const [assets, setAssets] = useState<string[]>([]);

  const [{ loading: isLoading, error }, fetchAssets] = useAsyncFn(async () => {
    const storageRef = firebase.storage().ref();

    const list = await storageRef.child(`assets/${path}`).listAll();
    const promises = list.items.map((item) => item.getDownloadURL());

    const urls: string[] = await Promise.all(promises);

    setAssets(urls);
  }, [path]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets, path]);

  return { assets, isLoading, error };
};
