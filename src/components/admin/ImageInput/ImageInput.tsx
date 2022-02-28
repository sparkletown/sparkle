import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import classNames from "classnames";
import { Button } from "components/admin/Button";

import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_IMAGE_INPUT_BACKGROUND,
  DEFAULT_IMAGE_INPUT_ROUND_BACKGOUND,
} from "settings";

import { AnyForm } from "types/utility";

import { useImageInputCompression } from "hooks/useImageInputCompression";

import * as TW from "./ImageInput.tailwind";

type ImageInputVariant = "wide" | "round";

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
  setValue: UseFormSetValue<AnyForm>;
  register: UseFormRegister<AnyForm>;
  nameWithUnderscore?: boolean;
  text?: string;
  subtext?: string;
  // isInputHidden?: boolean;
  variant?: ImageInputVariant;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  onChange,
  name,
  imgUrl,
  error,
  register,
  setValue,
  nameWithUnderscore = false,
  // isInputHidden = false,
  text = "Upload",
  subtext = "",
  variant = "wide",
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
      setValue(fileName, [compressedFile], { shouldValidate: false });
      setValue(fileUrl, url, { shouldValidate: false });

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

  const wrapperClasses = classNames("ImageInput__wrapper", TW.wrapper, {
    [TW.wideWrapper]: variant === "wide",
    [TW.roundWrapper]: variant === "round",
  });

  const backgroundImage =
    imgUrl ||
    (variant === "wide"
      ? DEFAULT_IMAGE_INPUT_BACKGROUND
      : DEFAULT_IMAGE_INPUT_ROUND_BACKGOUND);

  const wrapperVariantStyles = useMemo(
    () =>
      variant === "wide"
        ? {
            height: "150px",
          }
        : { backgroundPosition: "100% 100%" },
    [variant]
  );
  const wrapperStyles = useMemo(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      ...wrapperVariantStyles,
    }),
    [backgroundImage, wrapperVariantStyles]
  );

  return (
    <>
      <label className="ImageInput__container">
        <input
          accept={ACCEPTED_IMAGE_TYPES}
          hidden
          id={name}
          onChange={handleFileInputChangeWrapper}
          type="file"
          ref={inputFileRef}
        />
      </label>
      <input type="hidden" name={fileUrl} {...register} readOnly />
      <div className={wrapperClasses} style={wrapperStyles}>
        <Button onClick={onButtonClick} disabled={loading} borders="rounded">
          {loading ? "processing..." : text}
        </Button>
        <div className="ImageInput__subtext">{subtext}</div>
      </div>
      {errorMessage && <div className="ImageInput__error">{errorMessage}</div>}
    </>
  );
};