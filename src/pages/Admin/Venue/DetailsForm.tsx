import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
  VenueInputEdit,
} from "api/admin";
import { ImageInput } from "components/molecules/ImageInput";
import "firebase/functions";
import { useUser } from "hooks/useUser";
import React, { useCallback, useMemo, CSSProperties } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { createJazzbar } from "types/Venue";
import * as Yup from "yup";
import VenuePreview from "../../../components/organisms/VenuePreview";
import {
  editVenueCastSchema,
  editVenueValidationSchema,
  validationSchema,
} from "./DetailsValidationSchema";
import "./Venue.scss";
import { WizardPage } from "./VenueWizard";
import { venueLandingUrl } from "utils/url";
import {
  ZOOM_URL_TEMPLATES,
  VIDEO_IFRAME_TEMPLATES,
  EMBED_IFRAME_TEMPLATES,
} from "settings";
import "./Venue.scss";
import {
  Container,
  CustomDragLayer,
} from "pages/Account/Venue/VenueMapEdition";

export type FormValues = Partial<
  Yup.InferType<typeof editVenueValidationSchema>
>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

interface DetailsFormProps extends WizardPage {
  editing?: boolean;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({
  previous,
  state,
  editing,
}) => {
  const defaultValues = useMemo(
    () => editVenueCastSchema.cast(state.detailsPage?.venue),
    [state.detailsPage]
  );
  console.log("defaultValues", defaultValues);

  const { watch, formState, ...rest } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: editing ? editVenueValidationSchema : validationSchema,
    validationContext: state.templatePage,
    defaultValues,
  });
  const { user } = useUser();
  const history = useHistory();
  const { isSubmitting } = formState;
  const values = watch();
  console.log("values", values);
  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      if (!user) return;
      try {
        // unfortunately the typing is off for react-hook-forms.
        if (editing) await updateVenue(vals as VenueInputEdit, user);
        else await createVenue(vals as VenueInput, user);
        history.push("/admin");
      } catch (e) {
        console.error(e);
      }
    },
    [user, editing, history]
  );

  const onFormSubmit = rest.handleSubmit(onSubmit);
  const mapIconUrl = useMemo(() => {
    const file = values.mapIconImageFile;
    if (file && file.length > 0) return URL.createObjectURL(file[0]);
    return values.mapIconImageUrl;
  }, [values.mapIconImageFile, values.mapIconImageUrl]);

  const iconsMap = useMemo(
    () =>
      mapIconUrl
        ? {
            mapIconUrl: { top: 20, left: 20, url: mapIconUrl },
          }
        : undefined,
    [mapIconUrl]
  );

  if (!state.templatePage) {
    previous && previous();
    return null;
  }

  return (
    <div className="page">
      <div className="page-side">
        <div className="page-container-left">
          <div className="page-container-left-content">
            <DetailsFormLeft
              state={state}
              previous={previous}
              values={values}
              isSubmitting={isSubmitting}
              {...rest}
              onSubmit={onFormSubmit}
              editing={editing}
            />
          </div>
        </div>
      </div>
      <div className="page-side preview">
        <div className="playa">
          <Container
            snapToGrid={false}
            iconsMap={iconsMap ?? {}}
            backgroundImage={"/burn/playa3d.jpeg"}
            iconImageStyle={styles.iconImage}
          />
          <CustomDragLayer
            snapToGrid={false}
            iconImageStyle={styles.draggableIconImage}
          />
        </div>
        <VenuePreview values={values} />
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  iconImage: {
    width: 35,
    height: 35,
    overflow: "hidden",
    borderRadius: 20,
  },
  draggableIconImage: {
    width: 45,
    height: 45,
    overflow: "hidden",
    borderRadius: 20,
  },
};

interface DetailsFormLeftProps {
  state: WizardPage["state"];
  previous: WizardPage["previous"];
  values: FormValues;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm>["register"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: ReturnType<ReturnType<typeof useForm>["handleSubmit"]>;
  errors: FieldErrors<FormValues>;
  editing?: boolean;
}

const DetailsFormLeft: React.FC<DetailsFormLeftProps> = (props) => {
  const {
    editing,
    state,
    values,
    isSubmitting,
    register,
    errors,
    previous,
    onSubmit,
  } = props;
  const urlSafeName = values.name
    ? `${window.location.host}${venueLandingUrl(
        createUrlSafeName(values.name)
      )}`
    : undefined;
  console.log("errors", errors);
  const disable = isSubmitting;
  const templateType = state.templatePage?.template.name;

  const defaultVenue = createJazzbar({});

  return (
    <form className="full-height-container" onSubmit={onSubmit}>
      <div className="scrollable-content">
        <h4 className="italic">{`Create your ${templateType}`}</h4>
        <p className="small light" style={{ marginBottom: "2rem" }}>
          You can change anything except for the name of your venue later
        </p>
        <div className="input-container">
          <div className="input-title">Name your venue</div>
          <input
            disabled={disable}
            name="name"
            ref={register}
            className="align-left"
            placeholder={`My ${templateType} name`}
          />
          {errors.name ? (
            <span className="input-error">{errors.name.message}</span>
          ) : urlSafeName ? (
            <span className="input-info">
              The URL of your venue will be: <b>{urlSafeName}</b>
            </span>
          ) : null}
        </div>
        <div className="input-container">
          <div className="input-title">
            {`Choose how you'd like your venue to appear on the map`}
          </div>
          <ImageInput
            disabled={disable}
            name={"mapIconImageFile"}
            remoteUrlInputName={"mapIconImageUrl"}
            remoteImageUrl={values.mapIconImageUrl}
            containerClassName="input-square-container"
            imageClassName="input-square-image"
            image={values.mapIconImageFile}
            ref={register}
            error={errors.mapIconImageFile || errors.mapIconImageUrl}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Upload a banner photo</div>
          <ImageInput
            disabled={disable}
            name={"bannerImageFile"}
            image={values.bannerImageFile}
            remoteUrlInputName={"bannerImageUrl"}
            remoteImageUrl={values.bannerImageUrl}
            ref={register}
            error={errors.bannerImageFile || errors.bannerImageUrl}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Upload a square logo</div>
          <ImageInput
            disabled={disable}
            ref={register}
            image={values.logoImageFile}
            remoteUrlInputName={"logoImageUrl"}
            remoteImageUrl={values.logoImageUrl}
            name={"logoImageFile"}
            containerClassName="input-square-container"
            imageClassName="input-square-image"
            error={errors.logoImageFile || errors.logoImageUrl}
          />
        </div>
        <div className="input-container">
          <div className="input-title">The venue tagline</div>
          <input
            disabled={disable}
            name={"subtitle"}
            ref={register}
            className="wide-input-block align-left"
            placeholder={defaultVenue.config.landingPageConfig.subtitle}
          />
          {errors.subtitle && (
            <span className="input-error">{errors.subtitle.message}</span>
          )}
        </div>
        <div className="input-container">
          <div className="input-title">Long description</div>
          <textarea
            disabled={disable}
            name={"description"}
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={defaultVenue.config.landingPageConfig.description}
          />
          {errors.description && (
            <span className="input-error">{errors.description.message}</span>
          )}
        </div>
        {state.templatePage?.template.template && (
          <>
            {ZOOM_URL_TEMPLATES.includes(
              state.templatePage?.template.template
            ) && (
              <div className="input-container">
                <div className="input-title">Zoom URL</div>
                <textarea
                  disabled={disable}
                  name={"zoomUrl"}
                  ref={register}
                  className="wide-input-block input-centered align-left"
                  placeholder="https://us02web.zoom.us/j/654123654123"
                />
                {errors.description && (
                  <span className="input-error">
                    {errors.description.message}
                  </span>
                )}
              </div>
            )}
            {VIDEO_IFRAME_TEMPLATES.includes(
              state.templatePage?.template.template
            ) && (
              <div className="input-container">
                <div className="input-title">
                  Livestream URL, for people to view in your venue
                </div>
                <textarea
                  disabled={disable}
                  name={"videoIframeUrl"}
                  ref={register}
                  className="wide-input-block input-centered align-left"
                  placeholder="https://youtu.be/embed/abcDEF987w"
                />
                {errors.description && (
                  <span className="input-error">
                    {errors.description.message}
                  </span>
                )}
              </div>
            )}
            {EMBED_IFRAME_TEMPLATES.includes(
              state.templatePage?.template.template
            ) && (
              <div className="input-container">
                <div className="input-title">
                  URL to your artwork, to embed in the experience as an iframe
                </div>
                <textarea
                  disabled={disable}
                  name={"embedIframeUrl"}
                  ref={register}
                  className="wide-input-block input-centered align-left"
                  placeholder="https://3dwarehouse.sketchup.com/embed.html?mid=..."
                />
                {errors.description && (
                  <span className="input-error">
                    {errors.description.message}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="page-container-left-bottombar">
        {previous ? (
          <button className="btn btn-primary nav-btn" onClick={previous}>
            Go Back
          </button>
        ) : (
          <div />
        )}
        <div>
          <SubmitButton editing={editing} isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
  editing?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  editing,
}) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input
      className="btn btn-primary"
      type="submit"
      value={editing ? "Update venue" : "Create venue"}
    />
  );
};
