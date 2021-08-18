import { useEffect } from "react";
import { useAsyncFn } from "react-use";

export const useCheckImage = (
  src: string
): {
  isValid: boolean;
  isLoading: boolean;
  error: string | undefined;
} => {
  const [{ loading, error }, checkImage] = useAsyncFn(async () => {
    const checkImage = new Image();
    checkImage.src = src;

    await checkImage.decode();
  }, [src]);

  useEffect(() => {
    void checkImage();
  }, [checkImage]);

  return {
    isValid: !error,
    isLoading: loading,
    error: error?.message,
  };
};
