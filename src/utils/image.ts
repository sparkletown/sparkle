import Resizer from "react-image-file-resizer";

export const resizeFile = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      150,
      150,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri as Blob);
      },
      "blob"
    );
  });
};
