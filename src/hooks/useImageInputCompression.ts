import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";

import {
  GIF_RESIZER_URL,
  MAX_SELECTABLE_IMAGE_FILE_SIZE_BYTES,
  MAX_SELECTABLE_IMAGE_FILE_SIZE_MB,
} from "settings";

import { useTryCompressImage } from "hooks/useTryCompressImage";

export const imageCompressionErrorMessage =
  "An error occurred while compressing the image.";

export const tooLargeFileSelectedErrorMessage = `File size limit is ${MAX_SELECTABLE_IMAGE_FILE_SIZE_MB}MB. You can shrink images at ${GIF_RESIZER_URL}`;

export const useImageInputCompression = (
  register: ReturnType<typeof useForm>["register"],
  externalErrorMessage: FieldError["message"] | undefined,
  fileInputName: string
) => {
  useEffect(() => {
    register(fileInputName);
  }, [fileInputName, register]);

  const [isTooLargeFileError, setIsTooLargeFileError] = useState(false);
  const tryCompress = useTryCompressImage();

  const [
    { loading, error: isCompressionError },
    handleFileInputChange,
  ] = useAsyncFn(
    async (
      event: ChangeEvent<HTMLInputElement>
    ): Promise<[string | undefined, File | undefined]> => {
      const files = event.target.files;
      const file = files?.[0];

      if (!files || !file) return [undefined, undefined];

      if (file.size >= MAX_SELECTABLE_IMAGE_FILE_SIZE_BYTES) {
        setIsTooLargeFileError(true);
        return [undefined, undefined];
      } else setIsTooLargeFileError(false);

      const compressedFile = await tryCompress(file);
      const url = URL.createObjectURL(file);

      return [url, compressedFile];
    },
    [tryCompress]
  );

  const compressionError = isCompressionError
    ? imageCompressionErrorMessage
    : undefined;

  const tooLargeFileError = isTooLargeFileError
    ? tooLargeFileSelectedErrorMessage
    : undefined;

  const errorMessage = !loading
    ? tooLargeFileError ?? compressionError ?? externalErrorMessage
    : undefined;

  return useMemo(
    () => ({
      errorMessage,
      loading,
      handleFileInputChange,
    }),
    [errorMessage, handleFileInputChange, loading]
  );
};
