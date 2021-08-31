import { useCallback } from "react";
import imageCompression from "browser-image-compression";

import {
  MAX_UPLOAD_IMAGE_FILE_SIZE_BYTES,
  MAX_UPLOAD_IMAGE_FILE_SIZE_MB,
} from "settings";

export const useTryCompressImage = () =>
  useCallback(async (file: File) => {
    if (file.size > MAX_UPLOAD_IMAGE_FILE_SIZE_BYTES) {
      const compressionOptions = {
        maxSizeMB: MAX_UPLOAD_IMAGE_FILE_SIZE_MB,
        useWebWorker: true,
        maxIteration: 20,
      };

      const compressedFile = await imageCompression(file, compressionOptions);
      if (compressedFile.size > MAX_UPLOAD_IMAGE_FILE_SIZE_BYTES) {
        throw Error("Could not compress to desired size.");
      }
      return compressedFile;
    }

    return file;
  }, []);
