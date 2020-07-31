import React, { useMemo } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { useForm, FieldError } from "react-hook-form";
import * as Yup from "yup";
import firebase from "firebase/app";
import "firebase/functions";

const LONG_DESCRIPTION_PLACEHOLDER =
  "Describe what is unique and wonderful and sparkling about your venue";

interface FormInputs {
  name: string;
  bannerImageUrl: FileList;
  logoImageUrl: FileList;
  tagline: string;
  longDescription: string;
}

const validationSchema = Yup.object().shape<FormInputs>({
  name: Yup.string()
    .required("Display name required")
    .test(
      "dfsd",
      "Must have alphanumeric characters",
      (val: string) => val.replace(/\W/g, "").length > 0
    ),
  bannerImageUrl: Yup.mixed<FileList>()
    .required("Required")
    .test(
      "bannerImageUrl",
      "Image required",
      (val: FileList) => val.length > 0
    ),
  logoImageUrl: Yup.mixed<FileList>()
    .required("Required")
    .test("logoImageUrl", "Image required", (val: FileList) => val.length > 0),
  tagline: Yup.string().required("Required"),
  longDescription: Yup.string().required("Required"),
});

export const AdminVenue: React.FC = () => {
  const { register, handleSubmit, errors, watch } = useForm<
    Partial<FormInputs> // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues: {},
  });
  const values = watch();
  const onSubmit = async (vals: Partial<FormInputs>) => {
    const values = vals as FormInputs; // unfortunately the typing is off for react-hook-forms.
    try {
      await firebase.functions().httpsCallable("venue-createVenue")(values);
    } catch (e) {
      console.error(e);
    }
  };
  const urlSafeName = values.name?.replace(/\W/g, "");

  return (
    <WithNavigationBar>
      <div id="admin-venue" className="container admin-container">
        <h3 className="title">
          Create your space in{" "}
          <span className="title-adornment">The Sparkleverse</span>
        </h3>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-container">
            <div className="input-title">Name your space</div>
            <input
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
              name={"bannerImageUrl"}
              image={values.bannerImageUrl}
              ref={register}
              error={errors.bannerImageUrl}
            />
          </div>
          <div className="input-container">
            <div className="input-title">Upload a square logo</div>
            <ImageInput
              ref={register}
              image={values.logoImageUrl}
              name={"logoImageUrl"}
              containerClassName="input-logo-container"
              imageClassName="input-logo-image"
              error={errors.logoImageUrl}
            />
          </div>
          <div className="input-container">
            <div className="input-title">Tagline</div>
            <input
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
              <input
                className="btn btn-primary"
                type="submit"
                value="Create venue"
              />
            </div>
          </div>
        </form>
      </div>
    </WithNavigationBar>
  );
};

interface ImageInputProps {
  name: string;
  image?: FileList;
  containerClassName?: string;
  imageClassName?: string;
  error?: FieldError;
}

// eslint-disable-next-line
const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
  (props, ref) => {
    const { image, containerClassName, imageClassName, name, error } = props;

    const imageUrl = useMemo(
      () => image && image.length > 0 && URL.createObjectURL(image[0]),
      [image]
    );

    return (
      <>
        <div className={`image-input default-container ${containerClassName}`}>
          {imageUrl ? (
            <img className={`default-image ${imageClassName}`} src={imageUrl} />
          ) : (
            <div className="centered-flex empty">
              <h6 className=" text">Click to upload an image</h6>
            </div>
          )}
          <input
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
