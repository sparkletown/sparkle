import React, { useState, useCallback, useRef, useEffect } from "react";
import { FieldError } from "react-hook-form";
import "firebase/functions";
import firebase from "firebase/app";

interface ImageInputProps {
  collectionPath: string;
  disabled: boolean;
  imageUrl?: string;
  image?: FileList;
  fieldName: string;
  register: any;
  containerClassName?: string;
  imageClassName?: string;
  error?: FieldError;
  setImageUrl: (val?: string) => void;
  setImageFile: (val?: FileList) => void;
}

// eslint-disable-next-line
export const ImageCollectionInput: React.FC<ImageInputProps> = (props) => {
  const {
    imageUrl: imageUrlFromAPI,
    imageClassName,
    error,
    disabled,
    collectionPath,
    setImageUrl,
    setImageFile,
    fieldName,
    register,
  } = props;

  // these functions should be non mutating
  const setImageUrlRef = useRef(setImageUrl);
  const setImageFileRef = useRef(setImageFile);
  const [imageCollection, setImageCollection] = useState<Array<string>>([]);

  useEffect(() => {
    register(`${fieldName}File`);
  }, [register, fieldName]);

  useEffect(() => {
    const f = async () => {
      const storageRef = firebase.storage().ref();
      const list = await storageRef.child(collectionPath).listAll();
      const promises = list.items.map((item) => item.getDownloadURL());
      const urls: Array<string> = await Promise.all(promises);
      setImageCollection(urls);
    };
    f();
  }, [collectionPath]);

  const [selectedCollectionImageUrl, setSelectedCollectionImageUrl] = useState<
    string | undefined
  >(imageCollection.find((url) => url === imageUrlFromAPI));
  const [imageFiles, setImageFiles] = useState<FileList>();
  const [imageUrlForPreview, setImageUrlForPreview] = useState<
    string | undefined
  >(imageUrlFromAPI);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setImageFiles(e.target.files ?? undefined);
      setSelectedCollectionImageUrl(undefined);
    },
    []
  );

  const handleSelectCollection = useCallback(
    (url: string) => () => {
      setSelectedCollectionImageUrl(url);
      setImageFiles(undefined);
    },
    []
  );

  // this keeps the component state synchronised with the parent form state
  useEffect(() => {
    if (selectedCollectionImageUrl) {
      setImageFileRef.current(undefined);
      setImageUrlRef.current(selectedCollectionImageUrl);
      setImageUrlForPreview(selectedCollectionImageUrl);
    } else if (imageFiles && imageFiles.length > 0) {
      setImageUrlRef.current(undefined);
      setImageFileRef.current(imageFiles);
      setImageUrlForPreview(URL.createObjectURL(imageFiles[0]));
    } else if (imageUrlFromAPI) {
      setImageFileRef.current(undefined);
      setImageUrlRef.current(imageUrlFromAPI);
      setImageUrlForPreview(imageUrlFromAPI);
    }
  }, [selectedCollectionImageUrl, imageFiles, imageUrlFromAPI]);

  return (
    <>
      <div style={{ marginTop: 10, fontWeight: "bold" }}>
        {`Choose one of our popular icons`}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          paddingBottom: 10,
          paddingLeft: 10,
        }}
      >
        {imageCollection.map((imageCollectionUrl) => (
          <div
            onClick={handleSelectCollection(imageCollectionUrl)}
            key={imageCollectionUrl}
            style={{
              marginRight: 10,
              marginTop: 10,
              borderStyle: "solid",
              borderWidth: 4,
              borderRadius: 10,
              overflow: "hidden",
              cursor: "pointer",
              borderColor:
                selectedCollectionImageUrl === imageCollectionUrl
                  ? "yellow"
                  : "white",
            }}
          >
            <img
              alt="imageCollectionUrl"
              src={imageCollectionUrl}
              style={{ width: 80, height: 80 }}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontWeight: "bold" }}>
        {`Or upload your own`}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          style={{ flex: 1 }}
          disabled={disabled}
          type="file"
          onChange={handleFileChange}
          accept="image/x-png,image/gif,image/jpeg"
          className="btn btn-primary"
        />
        <div style={{ overflow: "hidden" }}>
          {imageUrlForPreview && (
            <img
              style={{ width: 200 }}
              className={`default-image ${imageClassName}`}
              src={imageUrlForPreview}
              alt="upload"
            />
          )}
        </div>
      </div>
      <input
        type="hidden"
        name={`${fieldName}Url`}
        ref={register}
        value={imageUrlForPreview}
      />
      {error?.message && <span className="input-error">{error.message}</span>}
    </>
  );
};
