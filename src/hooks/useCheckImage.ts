import { useAsync } from "react-use";

export const useCheckImage = (
  src: string
): {
  isValid: boolean;
  isLoading: boolean;
  error: string | undefined;
} => {
  const { loading, error } = useAsync(async () => {
    const checkImage = new Image();
    checkImage.src = src;

    await checkImage.decode();
  }, [src]);

  return {
    isValid: !error,
    isLoading: loading,
    error: error?.message,
  };
};
