import { useEffect, useState } from "react";

export const useCheckImage = (
  src: string
): [boolean, boolean, string | undefined] => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const checkImage = new Image();
    checkImage.src = src;

    setLoading(true);
    checkImage
      .decode()
      .then(() => {
        setError(undefined);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [src]);

  return [!error, isLoading, error];
};
