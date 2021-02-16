import { useState, useEffect } from "react";
import firebase from "firebase/app";

export const useFetchAssetImages = (path: string): string[] => {
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storageRef = firebase.storage().ref();

      const list = await storageRef.child(`assets/${path}`).listAll();
      const promises = list.items.map((item) => item.getDownloadURL());

      const urls: string[] = await Promise.all(promises);

      setImagePaths(urls);
    };
    fetchImages();
  }, [path]);

  return imagePaths;
};
