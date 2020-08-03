import React, { useMemo, useCallback } from "react";
import { useForm, FieldError } from "react-hook-form";
import * as Yup from "yup";
import "firebase/functions";
import { useUser } from "hooks/useUser";
import { VenueInput, createUrlSafeName, createVenue } from "api/admin";
import { WizardPage } from "./VenueWizard";
import "./Venue.scss";

const LONG_DESCRIPTION_PLACEHOLDER =
  "Describe what is unique and wonderful and sparkling about your venue";

const validationSchema = Yup.object().shape<VenueInput>({
  name: Yup.string()
    .required("Display name required")
    .test(
      "dfsd",
      "Must have alphanumeric characters",
      (val: string) => val.replace(/\W/g, "").length > 0
    ),
  bannerImageFile: Yup.mixed<FileList>()
    .required("Required")
    .test(
      "bannerImageUrl",
      "Image required",
      (val: FileList) => val.length > 0
    ),
  logoImageFile: Yup.mixed<FileList>()
    .required("Required")
    .test("logoImageUrl", "Image required", (val: FileList) => val.length > 0),
  tagline: Yup.string().required("Required"),
  longDescription: Yup.string().required("Required"),
});

export const DetailsForm: React.FC<WizardPage> = ({ previous }) => {
  const { register, handleSubmit, errors, watch, formState } = useForm<
    Partial<VenueInput> // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues: {},
  });
  const { user } = useUser();
  const { isSubmitting } = formState;
  const values = watch();
  const onSubmit = useCallback(
    async (vals: Partial<VenueInput>) => {
      if (!user) return;
      const values = vals as VenueInput; // unfortunately the typing is off for react-hook-forms.
      try {
        await createVenue(values, user);
      } catch (e) {
        console.error(e);
      }
    },
    [user]
  );
  const urlSafeName = values.name ? createUrlSafeName(values.name) : undefined;
  const disable = isSubmitting;

  return (
    <div id="admin-venue" className="container form-container">
      <h3 className="title">
        Create your space in{" "}
        <span className="title-adornment">The Sparkleverse</span>
      </h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <div className="input-title">Name your space</div>
          <input
            disabled={disable}
            name="name"
            ref={register}
            className="wide-input-block"
            placeholder="This can't be changed in the future"
          />
          {errors.name ? (
            <span className="input-error">{errors.name.message}</span>
          ) : (
            <div className="input-subtext">
              {`The URL of your space will be: ${urlSafeName}`}
            </div>
          )}
        </div>
        <div className="input-container">
          <div className="input-title">Upload a banner page photo</div>
          <ImageInput
            disabled={disable}
            name={"bannerImageFile"}
            image={values.bannerImageFile}
            ref={register}
            error={errors.bannerImageFile}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Upload a square logo</div>
          <ImageInput
            disabled={disable}
            ref={register}
            image={values.logoImageFile}
            name={"logoImageFile"}
            containerClassName="input-logo-container"
            imageClassName="input-logo-image"
            error={errors.logoImageFile}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Tagline</div>
          <input
            disabled={disable}
            name={"tagline"}
            ref={register}
            className="wide-input-block"
            placeholder="Briefly say what people will find here"
          />
          {errors.tagline && (
            <span className="input-error">{errors.tagline.message}</span>
          )}
        </div>
        <div className="input-container">
          <div className="input-title">Long description</div>
          <textarea
            disabled={disable}
            name={"longDescription"}
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={LONG_DESCRIPTION_PLACEHOLDER}
          />
          {errors.longDescription && (
            <span className="input-error">
              {errors.longDescription.message}
            </span>
          )}
        </div>
        <div className="centered-flex input-container">
          <div>
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </div>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input className="btn btn-primary" type="submit" value="Create venue" />
  );
};

interface ImageInputProps {
  disabled: boolean;
  name: string;
  image?: FileList;
  containerClassName?: string;
  imageClassName?: string;
  error?: FieldError;
}

// eslint-disable-next-line
const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  (props, ref) => {
    const {
      image,
      containerClassName,
      imageClassName,
      name,
      error,
      disabled,
    } = props;

    const imageUrl = useMemo(
      () => image && image.length > 0 && URL.createObjectURL(image[0]),
      [image]
    );

    return (
      <>
        <div className={`image-input default-container ${containerClassName}`}>
          {imageUrl ? (
            <img
              className={`default-image ${imageClassName}`}
              src={imageUrl}
              alt="upload"
            />
          ) : (
            <div className="centered-flex empty">
              <h6 className=" text">Click to upload an image</h6>
            </div>
          )}
          <input
            disabled={disabled}
            name={name}
            type="file"
            ref={ref}
            accept="image/x-png,image/gif,image/jpeg"
            className="default-input"
          />
        </div>
        {error?.message && <span className="input-error">{error.message}</span>}
      </>
    );
  }
);
