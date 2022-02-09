import { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { FIREBASE } from "core/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

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
    const assetsRef = await ref(FIREBASE.storage, `assets/${path}`);
    const assetsList = await listAll(assetsRef);

    return Promise.all(assetsList.items.map(getDownloadURL));
  }, [path]);

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    fetchAssets()
      .then((urls) => isMounted && setAssets(urls))
      .catch((e) => console.error(useFetchAssets.name, e));

    return () => {
      isMounted = false;
    };
  }, [fetchAssets]);

  return { assets, isLoading, error };
};
