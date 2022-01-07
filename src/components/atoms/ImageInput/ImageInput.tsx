import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FieldError, useForm } from "react-hook-form";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { useImageInputCompression } from "hooks/useImageInputCompression";

import { ImageOverlay } from "components/atoms/ImageOverlay";

import { ButtonNG } from "../ButtonNG";

import "./ImageInput.scss";

export interface ImageInputProps {
  onChange?: (
    url: string,
    extra: {
      nameUrl: string;
      valueUrl: string;
      nameFile: string;
      valueFile: File;
    }
  ) => void;
  name: string;
  imgUrl?: string;
  error?: FieldError;
  setValue: <T>(prop: string, value: T, validate: boolean) => void;
  small?: boolean;
  register: ReturnType<typeof useForm>["register"];
  nameWithUnderscore?: boolean;
  text?: string;
  subtext?: string;
  isInputHidden?: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  onChange,
  name,
  imgUrl,
  error,
  small = false,
  register,
  setValue,
  nameWithUnderscore = false,
  isInputHidden = false,
  text = "Upload",
  subtext = "",
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(imgUrl);

  useEffect(() => {
    if (imgUrl && !imageUrl) {
      setImageUrl(imgUrl);
    }
  }, [imgUrl, imageUrl]);

  const fileName = nameWithUnderscore ? `${name}_file` : `${name}File`;
  const fileUrl = nameWithUnderscore ? `${name}_url` : `${name}Url`;

  const {
    loading,
    errorMessage,
    handleFileInputChange,
  } = useImageInputCompression(register, error?.message, fileName);

  const handleFileInputChangeWrapper = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const [url, compressedFile] = await handleFileInputChange(event);
      if (!compressedFile || !url) return;

      setImageUrl(url);
      setValue(fileName, [compressedFile], false);
      setValue(fileUrl, url, false);

      onChange?.(url, {
        nameUrl: fileUrl,
        valueUrl: url,
        nameFile: fileName,
        valueFile: compressedFile,
      });
    },
    [handleFileInputChange, fileUrl, onChange, setValue, fileName]
  );

  const onButtonClick = useCallback(() => inputFileRef?.current?.click(), []);

  const labelClasses = classNames("ImageInput__container", {
    "ImageInput__container--error": !!error?.message,
    "ImageInput__container--small": small,
    "ImageInput__container--disabled": loading,
    "mod--hidden": isInputHidden || !imageUrl,
  });

  return (
    <>
      <label className={labelClasses}>
        <input
          accept={ACCEPTED_IMAGE_TYPES}
          hidden
          id={name}
          onChange={handleFileInputChangeWrapper}
          type="file"
          ref={inputFileRef}
        />
        {loading && <ImageOverlay disabled>processing...</ImageOverlay>}
        <span
          className={classNames("ImageInput__button", {
            "ImageInput__button--small": small,
            "ImageInput__button--hidden": !!imageUrl,
          })}
        >
          Upload
        </span>
      </label>
      <input type="hidden" name={fileUrl} ref={register} readOnly />
      <div className="ImageInput__wrapper">
        <ButtonNG onClick={onButtonClick}>{text}</ButtonNG>
        <div className="ImageInput__subtext">{subtext}</div>
      </div>
      {errorMessage && <div className="ImageInput__error">{errorMessage}</div>}
    </>
  );
};
